import React, { useReducer, useEffect } from 'react';
import Helmet from 'react-helmet';
import { observer } from 'mobx-react-lite';
import { useTracking } from './hooks/useTracking';
import { useStore } from './stores';
import { RenderRoutes as Routes } from './routes/RenderRoutes';
import { Header, UploadForm, ScrollToTop } from './components';
import { isAdmin } from './utils';
import firebase from './firebase';
import { getFullUserData } from './api';
import styled from 'styled-components/macro';

const initialState = {
  isModalOpen: true,
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
    default:
      throw new Error('Unexpected action');
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const store = useStore();
  // useTracking();

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
    <AppWrapper>
      <Helmet titleTemplate="%s - קילומטר אחד" defaultTitle="קילומטר אחד"></Helmet>
      <Header />
      <Routes />
      {/*<Switch>
            <Route exact path={['/', '/weekly']}>
              <Weekly />
            </Route>
            <Route exact path="/map">
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

            
            <Route>
              <FourOhFour />
            </Route>
          </Switch>
          
          */}
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  display: grid;
  grid-template-rows: 60px 1fr;
  min-height: 100vh;
`;

export default observer(App);
