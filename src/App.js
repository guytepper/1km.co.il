import React from 'react';
import Helmet from 'react-helmet';
import { useStore } from './stores';
import { observer } from 'mobx-react-lite';
import { useTracking } from './hooks/useTracking';
import { RenderRoutes as Routes } from './routes/RenderRoutes';
import { Header } from './components';
import styled from 'styled-components/macro';

function App() {
  const store = useStore();
  useTracking();

  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - קילומטר אחד"
        defaultTitle="קילומטר אחד"
        onChangeClientState={(newState) => store.setCurrentPageTitle(newState.title)}
      ></Helmet>
      <Header />
      <Routes />
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  display: grid;
  grid-template-rows: 60px 1fr;
  min-height: 100vh;
`;

export default observer(App);
