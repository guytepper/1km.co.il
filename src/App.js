import React, { useReducer, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Map, ProtestList, Footer, Modal, ProtestForm } from './components';
import ProjectSupportPage from './views/ProjectSupportPage';
import getDistance from 'geolib/es/getDistance';
import { pointWithinRadius, validateLatLng } from './utils';
import styled from 'styled-components';
import firebase, { firestore } from './firebase';
import * as geofirestore from 'geofirestore';

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
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'setProtests':
      return { ...state, protests: { close: action.payload.close, far: action.payload.far } };
    case 'setMarkers':
      return { ...state, markers: [...state.markers, ...action.payload] };
    case 'setMapPosition':
      return { ...state, mapPosition: action.payload };
    case 'setMapPositionHistory':
      return { ...state, mapPositionHistory: action.payload };
    case 'setModalState':
      return { ...state, isModalOpen: action.payload };
    case 'setUserCoordinates':
      return { ...state, userCoordinates: action.payload };
    case 'setLoading':
      return { ...state, loading: action.payload };

    default:
      throw new Error('Unexpected action');
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (validateLatLng(state.mapPosition)) {
      let requested = false;

      // Check if the protests for the current position have been fetched already
      state.mapPositionHistory.forEach((pos) => {
        if (pointWithinRadius(pos, state.mapPosition, 10000)) {
          requested = true;
          return;
        }
      });

      if (requested) return;

      // TODO: Move API call outside from here
      const geocollection = GeoFirestore.collection('protests');
      const query = geocollection.near({
        center: new firebase.firestore.GeoPoint(state.mapPosition[0], state.mapPosition[1]),
        radius: 10,
      });

      async function fetchProtests() {
        try {
          const snapshot = await query.limit(15).get();
          const protests = snapshot.docs.map((doc) => {
            const { latitude, longitude } = doc.data().g.geopoint;
            const protestLatlng = [latitude, longitude];
            return {
              id: doc.id,
              latlng: protestLatlng,
              distance: getDistance(state.userCoordinates, protestLatlng),
              ...doc.data(),
            };
          });

          // Set protests only on initial load
          // These protests will be shown on ProtestList
          if (state.loading) {
            dispatch({
              type: 'setProtests',
              payload: {
                close: protests.filter((p) => p.distance <= 1000).sort((p1, p2) => p1.distance - p2.distance),
                far: protests.filter((p) => p.distance > 1000).sort((p1, p2) => p1.distance - p2.distance),
              },
            });
          }

          // Filter duplicate markers
          const filteredMarkers = protests.filter((a) => !state.markers.find((b) => b.id === a.id));
          dispatch({ type: 'setMarkers', payload: filteredMarkers });
          dispatch({ type: 'setMapPositionHistory', payload: [...state.mapPositionHistory, state.mapPosition] });
          dispatch({ type: 'setLoading', payload: false });
        } catch (err) {
          console.log(err);
        }
      }
      fetchProtests();
    }
  }, [state.userCoordinates, state.mapPosition]);

  return (
    <AppWrapper>
      <Router>
        <Header>
          <SiteLogo>
            <Link to="/" style={{ color: 'black' }}>
              קילומטר אחד
            </Link>
          </SiteLogo>
          <NavItem to="/add-protest/">+ הוספת הפגנה</NavItem>
        </Header>
        <React.Fragment>
          <Route exact path="/">
            <HomepageWrapper>
              <Map
                coordinates={state.userCoordinates}
                setMapPosition={(position) => {
                  dispatch({ type: 'setMapPosition', payload: position });
                }}
                markers={state.markers}
              ></Map>
              <ProtestListWrapper>
                <SiteMessage>
                  עקב עומס פניות חל עיכוב בהוספת ההפגנות.
                  <br />
                  ביממה הקרובה כל ההפגנות שנשלחו יתווספו למפה.
                  <br />
                </SiteMessage>
                <ProtestList closeProtests={state.protests.close} farProtests={state.protests.far} loading={state.loading} />
                <Footer />
              </ProtestListWrapper>
            </HomepageWrapper>
            <Modal
              isOpen={state.isModalOpen}
              setIsOpen={(isOpen) => dispatch({ type: 'setModalState', payload: isOpen })}
              coordinates={state.userCoordinates}
              setCoordinates={(coords) => dispatch({ type: 'setUserCoordinates', payload: coords })}
            />
          </Route>
          <Route exact path="/add-protest/">
            <ProtestForm initialCoords={state.userCoordinates} />
          </Route>
          <Route exact path="/support-the-project/">
            <ProjectSupportPage />
          </Route>
        </React.Fragment>
      </Router>
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  display: grid;
  grid-template-rows: 60px 1fr;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
  grid-row: 1;
  background-color: #fff;
  box-shadow: inset 0 -1px 0 #e1e4e8;
`;

const SiteLogo = styled.h1`
  font-size: 26px;
`;

const NavItem = styled(Link)`
  &:hover {
    color: #3498db;
  }
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

const SiteMessage = styled.div`
  background-color: #ff6b6b;
  padding: 5px 10px;
  text-align: center;

  @media (min-width: 768px) {
    margin: 0 -15px;
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
    padding: 0 15px;
    max-height: calc(100vh - 60px);
  }
`;

export default App;
