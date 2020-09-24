import React from 'react';
import { Map, Circle, TileLayer, Marker, Popup } from 'react-leaflet';

function AppMap({ position }) {
  console.log(position);
  return (
    <Map center={[position.lat, position.lng]} zoom={16} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[position.lat, position.lng]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <Circle radius={1000} center={[position.lat, position.lng]} />
    </Map>
  );
}

export default AppMap;
