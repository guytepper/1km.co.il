import React, { useReducer, useEffect } from 'react';
import Helmet from 'react-helmet';
import { observer } from 'mobx-react-lite';
import { useStore } from './stores';
import { BrowserRouter as Router, Route, Redirect, Link, Switch } from 'react-router-dom';
import Menu from 'react-burger-menu/lib/menus/slide';
import {
  Admin,
  SignUp,
  ProtestMap,
  ProtestPage,
  AddProtest,
  Profile,
  LeaderRequest,
  PostView,
  LiveEvent,
  FourOhFour,
} from './views';
import { UploadForm, ScrollToTop } from './components';
import { isAdmin } from './utils';
import styled, { keyframes } from 'styled-components/macro';
import firebase from './firebase';
import { DispatchContext } from './context';
import { getFullUserData } from './api';

const initialState = {
  isModalOpen: true,
  menuOpen: false,
  hoveredProtest: null,
  loading: false,
  user: undefined,
};

function reducer(state, action) {
  switch (action.type) {
    case 'setLoading':
      return { ...state, loading: action.payload };

    case 'setUser':
      return { ...state, user: action.payload };
    case 'setMenuState':
      return { ...state, menuOpen: action.payload };
    default:
      throw new Error('Unexpected action');
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const store = useStore();

  const updateMenuState = (state) => {
    dispatch({ type: 'setMenuState', payload: state });
  };

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

  return (
    <DispatchContext.Provider value={dispatch}>
      <AppWrapper>
        <Helmet titleTemplate="%s - קילומטר אחד" defaultTitle="קילומטר אחד"></Helmet>
        <Router>
          <ScrollToTop />
          <Header>
            <NavItemLive to="/live">
              <LiveIcon src="/icons/live.svg" alt="" style={{ marginRight: 10 }} />
            </NavItemLive>
            <Link to="/">
              <img src="/logo.svg" alt=" קילומטר אחד" />
            </Link>
            <NavProfileWrapper>
              <Menu
                isOpen={state.menuOpen}
                onStateChange={(state) => updateMenuState(state.isOpen)}
                customBurgerIcon={<img src="/icons/hamburger.svg" alt="תפריט" />}
                customCrossIcon={false}
                disableAutoFocus
              >
                <Link to="/live" onClick={() => updateMenuState(false)} className="bm-item">
                  פיד תמונות
                </Link>
                <Link to="/map" onClick={() => updateMenuState(false)} className="bm-item">
                  מפת הפגנות
                </Link>
                <hr />
                <Link to="/about" onClick={() => updateMenuState(false)}>
                  על הפרוייקט
                </Link>
                <Link to="/donate" onClick={() => updateMenuState(false)}>
                  תרומה
                </Link>
                <hr />
                <a href="https://www.facebook.com/1km.co.il" target="_blank" rel="noreferrer noopener">
                  פייסבוק
                </a>
                <a href="https://twitter.com/1kmcoil" target="_blank" rel="noreferrer noopener">
                  טוויטר
                </a>
                <a href="https://www.instagram.com/1km.co.il/" target="_blank" rel="noreferrer noopener">
                  אינסטגרם
                </a>
                <a href="https://github.com/guytepper/1km.co.il" target="_blank" rel="noreferrer noopener">
                  קוד פתוח
                </a>
                {isAdmin(state.user) && <Link to="/admin">ניהול</Link>}
              </Menu>
            </NavProfileWrapper>
          </Header>
          <Switch>
            <Route exact path={['/', '/map']}>
              <ProtestMap />
            </Route>
            <Route exact path="/add-protest">
              <AddProtest user={state.user} />
            </Route>
            <Route path="/admin">
              <Admin user={state.user} />
            </Route>
            <Route path="/protest/:id">
              <ProtestPage user={state.user} />
            </Route>
            <Route path="/protest/:id/gallery">
              <ProtestPage user={state.user} />
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
            <Route exact path={['/live', '/live/check-in', '/live/check-in/*']}>
              <LiveEvent closeProtests={store.protestStore.closeProtests} user={state.user} loading={state.loading} />
            </Route>
            <Route exact path="/balfur">
              <Redirect to="/live" />
            </Route>
            <Route exact path="/live/qr">
              <Redirect to="/live/" />
            </Route>
            <Route exact path="/upload-image">
              <UploadForm />
            </Route>

            <Route exact path={['/support-the-project/', '/about']}>
              <PostView overrideSlug="about" />
            </Route>
            <Route exact path={['/donate']}>
              <PostView overrideSlug="donate" />
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
  padding: 5px 8px 5px 20px;
  grid-row: 1;
  background-color: #fff;
  box-shadow: #e1e4e8 0px -1px 0px inset, #00000026 0px 4px 5px -1px;
  z-index: 10;
`;

const fadeIn = keyframes`
  from {
    opacity: 0.75;
  }

  to {
    opacity: 1;
  }
`;

const NavItemLive = styled(Link)`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  color: tomato;
  font-weight: bold;
  font-size: 18px;
  animation: ${fadeIn} 1.2s linear 1s infinite alternate;
`;

const NavProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LiveIcon = styled.img`
  width: 27px;
  border-radius: 50px;
  margin-left: 5px;
  user-select: none;
`;

export default observer(App);
