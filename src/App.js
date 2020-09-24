import React from 'react';
import './App.css';
import useGeolocation from './hooks/useGeolocation';
import Map from './components/Map';
import ProtestCard from './components/ProtestCard';
import getDistance from 'geolib/es/getDistance';

import protests from './data';

function App() {
  const state = useGeolocation({ latitude: 31.775028, longitude: 35.217614 });
  const latlng = { lat: state.latitude, lng: state.longitude };

  return (
    <div className="App">
      <header className="App-header">קול אחד</header>
      <Map position={latlng}></Map>
      <div style={{ padding: '16px' }}>
        {protests.map((protest) => (
          <ProtestCard
            displayName={protest.displayName}
            location={protest.location}
            distance={getDistance(latlng, protest.location.latlng)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
