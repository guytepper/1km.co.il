import React from 'react';
import './App.css';
import useGeolocation from './hooks/useGeolocation';
import Map from './components/Map';
import ProtestCard from './components/ProtestCard';
import getDistance from 'geolib/es/getDistance';
import styled from 'styled-components';
import protests from './data';

const ProtestList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  padding: 15px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const defaultPosition = { lat: 31.775028, lng: 35.217614 };

function App() {
  const state = useGeolocation(defaultPosition);
  const latlng = { lat: state.latitude, lng: state.longitude };

  return (
    <div className="App">
      <header className="App-header">קול אחד</header>
      <Map position={latlng.lat ? latlng : defaultPosition}></Map>
      <ProtestList>
        {protests.map((protest) => (
          <ProtestCard
            key={protest.id}
            displayName={protest.displayName}
            location={protest.location}
            distance={getDistance(latlng, protest.location.latlng)}
          />
        ))}
      </ProtestList>
    </div>
  );
}

export default App;
