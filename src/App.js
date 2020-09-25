import React, { useState, useEffect } from 'react';
import useGeolocation from './hooks/useGeolocation';
import Map from './components/Map';
import ProtestCard from './components/ProtestCard';
import getDistance from 'geolib/es/getDistance';
import styled from 'styled-components';
import firebase, { firestore } from './firebase';
import * as geofirestore from 'geofirestore';

const GeoFirestore = geofirestore.initializeApp(firestore);

const defaultPosition = [31.775028, 35.217614];

function App() {
  const state = useGeolocation(defaultPosition);
  const [protests, setProtests] = useState([]);
  const latlng = [state.latitude, state.longitude];

  useEffect(() => {
    const geocollection = GeoFirestore.collection('protests');
    const query = geocollection.near({ center: new firebase.firestore.GeoPoint(31.775028, 35.217614), radius: 15 });
    async function fetchProtests() {
      try {
        const snapshot = await query.limit(10).get();
        const protests = snapshot.docs.map((doc) => ({
          id: doc.id,
          latlng: [doc.data().g.geopoint.latitude, doc.data().g.geopoint.longitude],
          ...doc.data(),
        }));
        console.log(latlng, protests[0].latlng);
        setProtests(protests);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProtests();
  }, []);

  return (
    <AppWrapper>
      <Header>
        <SiteLogo>קילומטר אחד</SiteLogo>
        <NavItem href="https://forms.gle/oFXS1qQtY2FyYbLA6" target="blank">
          + הוספת הפגנה
        </NavItem>
      </Header>
      <HomepageWrapper>
        <Map position={latlng} protests={protests}></Map>
        <ProtestList>
          {protests.map((protest) => (
            <ProtestCard
              key={protest.id}
              displayName={protest.displayName}
              streetAddress={protest.streetAddress}
              distance={getDistance(latlng, protest.latlng)}
            />
          ))}
        </ProtestList>
      </HomepageWrapper>
      <Footer>
        <FooterLink href="https://github.com/guytepper/1km" target="_blank">
          <FooterLinkIcon src="/icons/github.svg" alt="Github Repo" />
          גיטהאב
        </FooterLink>
        <FooterLink href="mailto:guytepper@gmail.com" target="_blank">
          <FooterLinkIcon src="/icons/email.svg" alt="Github Repo" />
          פידבק
        </FooterLink>
      </Footer>
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  display: grid;
  grid-template-rows: 60px 1fr 30px;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
  grid-row: 1;
`;

const SiteLogo = styled.h1`
  font-size: 26px;
`;

const NavItem = styled.a`
  &:hover {
    color: #3498db;
  }
`;

const HomepageWrapper = styled.div`
  height: 100%;
  display: grid;
  grid-row: 2;

  @media (min-width: 768px) {
    grid-template-columns: 280px 1fr;
    grid-template-rows: 1fr;
  }
`;

const ProtestList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  padding: 15px;
  grid-column: 1/2;
  grid-auto-rows: min-content;
  grid-row: 2;

  @media (min-width: 768px) {
    padding: 0 15px;
    grid-row: 1;
  }
`;

const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  grid-row: 3;
  padding: 0 10px;
`;

const FooterLink = styled.a`
  display: flex;
  align-items: center;
  padding: 0 5px;
  font-size: 14px;
`;

const FooterLinkIcon = styled.img`
  width: 17.5px;
  margin-inline-end: 5px;
`;

export default App;
