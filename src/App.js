import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import ProtestList from './components/ProtestList';
import Modal from './components/Modal';
import getDistance from 'geolib/es/getDistance';
import { pointWithinRadius } from './utils';
import styled from 'styled-components';
import firebase, { firestore } from './firebase';
import * as geofirestore from 'geofirestore';

const GeoFirestore = geofirestore.initializeApp(firestore);

function App() {
  const [modalIsOpen, setIsOpen] = useState(true);
  const [userCoordinates, setCoordinates] = useState([]);
  const [mapPosition, setMapPosition] = useState([]);
  const [mapPositionHistory, setMapPositionHistory] = useState([]);
  const [protests, setProtests] = useState({ all: [], close: [], far: [] });
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mapPosition.length === 2) {
      let requested = false;

      // Check if the protests for the current position have been fetched already
      mapPositionHistory.forEach((pos) => {
        if (pointWithinRadius(pos, mapPosition, 20000)) {
          requested = true;
          return;
        }
      });

      if (requested) return;

      const geocollection = GeoFirestore.collection('protests');
      const query = geocollection.near({ center: new firebase.firestore.GeoPoint(mapPosition[0], mapPosition[1]), radius: 20 });
      async function fetchProtests() {
        try {
          const snapshot = await query.limit(10).get();
          const protests = snapshot.docs.map((doc) => {
            const { latitude, longitude } = doc.data().g.geopoint;
            const protestLatlng = [latitude, longitude];
            return {
              id: doc.id,
              latlng: protestLatlng,
              distance: getDistance(userCoordinates, protestLatlng),
              ...doc.data(),
            };
          });

          // Set protests only on initial load
          // These protests will be shown on ProtestList
          if (loading) {
            setProtests({
              all: protests,
              close: protests.filter((p) => p.distance <= 1000).sort((p1, p2) => p1.distance - p2.distance),
              far: protests.filter((p) => p.distance > 1000).sort((p1, p2) => p1.distance - p2.distance),
            });
          }

          setMarkers((prevState) => {
            // Filter duplicate markers
            const filtered = protests.filter((a) => !prevState.find((b) => b.id === a.id));
            const newMarkers = [...prevState, ...filtered];
            return newMarkers;
          });

          setMapPositionHistory((prevState) => [...prevState, mapPosition]);

          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
      fetchProtests();
    }
  }, [userCoordinates, mapPosition]);

  return (
    <AppWrapper>
      <Header>
        <SiteLogo>קילומטר אחד</SiteLogo>
        <NavItem href="https://forms.gle/oFXS1qQtY2FyYbLA6" target="blank">
          + הוספת הפגנה
        </NavItem>
      </Header>
      <HomepageWrapper>
        <Map
          coordinates={userCoordinates}
          setMapPosition={setMapPosition}
          setMapPositionHistory={setMapPositionHistory}
          markers={markers}
        ></Map>
        <ProtestListWrapper>
          <ProtestList closeProtests={protests.close} farProtests={protests.far} loading={loading} />
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
        </ProtestListWrapper>
      </HomepageWrapper>
      <Modal isOpen={modalIsOpen} setIsOpen={setIsOpen} coordinates={userCoordinates} setCoordinates={setCoordinates} />
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
    padding: 0 15px;
  }
`;

const Footer = styled.footer`
  display: flex;
  align-items: center;
  padding: 15px;
  opacity: 0.6;
  justify-content: flex-end;

  @media (min-width: 768px) {
    padding: 10px 0;
    justify-content: flex-start;
  }
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
