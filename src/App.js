import React, { useReducer, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Map, ProtestList, Footer, Modal, Button } from './components';
import { Admin, SignUp, ProtestPage, AddProtest, Profile, LeaderRequest, PostView, FourOhFour } from './views';
import { pointWithinRadius, validateLatLng, calculateDistance, isAuthenticated, isAdmin } from './utils';
import styled from 'styled-components/macro';
import firebase, { firestore } from './firebase';
import * as geofirestore from 'geofirestore';
import { DispatchContext } from './context';
import { setLocalStorage, getLocalStorage } from './localStorage';
import { getFullUserData } from './api';

const GeoFirestore = geofirestore.initializeApp(firestore);

const initialState = {
  userCoordinates: [],
  protests: {
    close: [],
    far: [],
  },
  markers: [],
  mapPosition: [],
  mapPositionHistory: [],
  isModalOpen: true,
  loading: false,
  user: undefined,
};

function reducer(state, action) {
  switch (action.type) {
    case 'setProtests':
      return { ...state, protests: { close: action.payload.close, far: action.payload.far } };
    case 'setMarkers':
      return {
        ...state,
        markers: [...state.markers, ...action.payload.markers],
        mapPositionHistory: [...state.mapPositionHistory, action.payload.mapPosition],
      };
    case 'setMapPosition':
      return { ...state, mapPosition: action.payload };
    case 'setMapPositionHistory':
      return { ...state, mapPositionHistory: action.payload };
    case 'setModalState':
      return { ...state, isModalOpen: action.payload };
    case 'setUserCoordinates':
      // Save the user coordinates in order to reuse them on the next user session
      setLocalStorage('1km_user_coordinates', action.payload);
      return { ...state, userCoordinates: action.payload, loading: true };
    case 'setLoading':
      return { ...state, loading: action.payload };
    case 'setLoadData':
      return {
        ...state,
        protests: { close: action.payload.close, far: action.payload.far },
        markers: [...state.markers, ...action.payload.markers],
        mapPositionHistory: [...state.mapPositionHistory, action.payload.mapPosition],
        loading: false,
      };
    case 'setInitialData':
      return {
        ...state,
        userCoordinates: action.payload,
        isModalOpen: false,
        loading: true,
      };
    case 'setUser':
      return { ...state, user: action.payload };
    default:
      throw new Error('Unexpected action');
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Check on mount if we have coordinates in local storage and if so, use them and don't show modal
  useEffect(() => {
    const cachedCoordinates = getLocalStorage('1km_user_coordinates');
    if (cachedCoordinates) {
      dispatch({ type: 'setInitialData', payload: cachedCoordinates });
    }
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // This adds the "admin" data which is in our DB
        getFullUserData(user.uid).then((fullUserData) => {
          if (fullUserData) {
            dispatch({ type: 'setUser', payload: fullUserData });
          } else {
            const { uid, email } = user;
            const partialUserData = { uid, email };
            // When the user is initially created, this request returns undefined
            // This is a workaround in order to get the uid in the leader reqest page
            // https://github.com/guytepper/1km.co.il/pull/114
            dispatch({ type: 'setUser', payload: partialUserData });
          }
        });
      } else {
        dispatch({ type: 'setUser', payload: 'visitor' });
      }
    });
  }, []);

  useEffect(() => {
    // if onlyMarkers is true then don't update the protests, only the markers and history.
    async function fetchProtests({ onlyMarkers = false } = {}) {
      // TODO: Move API call outside from here
      const geocollection = GeoFirestore.collection('protests');
      const query = geocollection.near({
        center: new firebase.firestore.GeoPoint(state.mapPosition[0], state.mapPosition[1]),
        radius: 15,
      });

      try {
        const snapshot = await query.limit(30).get();
        const protests = snapshot.docs.map((doc) => {
          const { latitude, longitude } = doc.data().g.geopoint;
          const protestLatlng = [latitude, longitude];
          return {
            id: doc.id,
            latlng: protestLatlng,
            distance: calculateDistance(state.userCoordinates, protestLatlng),
            ...doc.data(),
          };
        });

        // Filter duplicate markers
        const filteredMarkers = protests.filter((a) => !state.markers.find((b) => b.id === a.id));
        if (onlyMarkers) {
          // Set data
          dispatch({
            type: 'setMarkers',
            payload: {
              markers: filteredMarkers,
              mapPosition: state.mapPosition,
            },
          });
        } else {
          // Set data
          dispatch({
            type: 'setLoadData',
            payload: {
              close: protests.filter((p) => p.distance <= 1000).sort((p1, p2) => p1.distance - p2.distance),
              far: protests.filter((p) => p.distance > 1000).sort((p1, p2) => p1.distance - p2.distance),
              markers: filteredMarkers,
              mapPosition: state.mapPosition,
            },
          });
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (validateLatLng(state.mapPosition)) {
      if (state.loading) {
        fetchProtests();
      } else {
        const requested = state.mapPositionHistory.some((pos) => pointWithinRadius(pos, state.mapPosition, 5000));
        if (!requested) {
          fetchProtests({ onlyMarkers: true });
        }
      }
    }
    //TODO: remove this line and make sure deps are correct
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.userCoordinates, state.mapPosition]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <AppWrapper>
        <Router>
          <Header>
            <Link to="/">
              <img src="/logo.svg" alt="קילומטר אחד" />
            </Link>
            <NavItemsWrapper>
              <NavProfileWrapper>
                {isAuthenticated(state.user) ? (
                  <span style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
                    <NavProfilePicture src="/icons/guard.svg" alt="" />
                    <NavItem to="/profile/">הפגנות מורשות לעדכון</NavItem>
                    {isAdmin(state.user) && <NavItem to="/admin">ניהול</NavItem>}
                  </span>
                ) : null}
                <GuestNavItems>
                  <NavItem to="/support-the-project/">☆ תמיכה בפרוייקט</NavItem>
                  <NavItem to="/add-protest/">+ הוספת הפגנה</NavItem>
                </GuestNavItems>
              </NavProfileWrapper>
            </NavItemsWrapper>
          </Header>
          <Switch>
            <Route exact path="/">
              <HomepageWrapper>
                <ProtestListWrapper>
                  <ProtestListHead>
                    {/* <SiteMessage to="/project-updates/1" style={{ backgroundColor: '#6ab04c' }}>
                      <span style={{ boxShadow: '0 2px 0 0 #fff', fontSize: 19 }}>מה נעשה עכשיו? עדכון פרוייקט #1</span>
                    </SiteMessage> */}
                    <Button style={{ width: '100%' }} onClick={() => dispatch({ type: 'setModalState', payload: true })}>
                      שינוי כתובת
                    </Button>
                  </ProtestListHead>

                  <ProtestList closeProtests={state.protests.close} farProtests={state.protests.far} loading={state.loading} />
                  <Footer />
                </ProtestListWrapper>

                <Map
                  coordinates={state.userCoordinates}
                  setMapPosition={(position) => {
                    dispatch({ type: 'setMapPosition', payload: position });
                  }}
                  h
                  markers={state.markers}
                />
              </HomepageWrapper>
              <Modal
                isOpen={state.isModalOpen}
                setIsOpen={(isOpen) => dispatch({ type: 'setModalState', payload: isOpen })}
                coordinates={state.userCoordinates}
                setCoordinates={(coords) => {
                  dispatch({ type: 'setUserCoordinates', payload: coords });
                }}
              />
            </Route>
            <Route exact path="/add-protest">
              <AddProtest initialCoords={state.userCoordinates} />
            </Route>
            <Route path="/admin">
              <Admin user={state.user} />
            </Route>
            <Route path="/protest/:id">
              <ProtestPage user={state.user} coordinates={state.userCoordinates} />
            </Route>
            <Route exact path="/sign-up">
              <SignUp />
            </Route>
            <Route path="/leader-request">
              <LeaderRequest user={state.user} />
            </Route>
            <Route exact path="/profile">
              <Profile user={state.user} />
            </Route>

            <Route exact path="/support-the-project/">
              <PostView overrideSlug="support-the-project" />
            </Route>
            <Route exact path="/legal-notice">
              <PostView overrideSlug="legal-notice" />
            </Route>
            <Route exact path="/project-updates/:slug">
              <PostView />
            </Route>

            {/* 404 */}
            <Route>
              <FourOhFour />
            </Route>
          </Switch>
        </Router>
      </AppWrapper>
    </DispatchContext.Provider>
  );
}

const AppWrapper = styled.div`
  display: grid;
  grid-template-rows: 60px 1fr;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  position: sticky;
  top: 0;
  justify-content: space-between;
  align-items: center;
  padding: 5px 25px;
  grid-row: 1;
  background-color: #fff;
  box-shadow: inset 0 -1px 0 #e1e4e8;
  z-index: 10;
`;

const NavItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 585px) {
    flex-direction: row-reverse;
    align-items: center;
  }

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const GuestNavItems = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  @media (min-width: 585px) {
    flex-direction: row;
    align-items: center;
  }
`;

const NavItem = styled(Link)`
  &:hover {
    color: #3498db;
  }

  margin-left: 10px;

  @media (max-width: 585px) {
    margin-left: 15px;
  }

  @media (max-width: 415px) {
    font-size: 13px;
    margin-left: 10px;
  }
`;

const NavProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NavProfilePicture = styled.img`
  width: 20px;
  border-radius: 50px;
  margin-left: 5px;
`;

const HomepageWrapper = styled.div`
  height: 100%;
  display: grid;
  grid-row: 2;
  z-index: 0;

  @media (min-width: 768px) {
    grid-template-columns: 280px 1fr;
    grid-template-rows: 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 300px 1fr;
  }

  @media (min-width: 1280px) {
    grid-template-columns: 330px 1fr;
  }

  @media (min-width: 1700px) {
    grid-template-columns: 375px 1fr;
  }
`;

const ProtestListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  grid-column: 1 / 2;
  grid-row: 2;

  @media (min-width: 768px) {
    grid-row: 1;
    padding: 10px 15px 0;
    max-height: calc(100vh - 60px);
  }
`;

const ProtestListHead = styled.div`
  margin-bottom: 8px;
`;

export default App;
