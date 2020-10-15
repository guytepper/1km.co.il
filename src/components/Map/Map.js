import React, { useState, useEffect, useRef } from 'react';
import { Map, Circle, TileLayer, Marker, Popup } from 'react-leaflet';
import styled from 'styled-components/macro';
import MKs from './MKs.json';
import L from 'leaflet';
import MapSearchAutocomplete from '../MapSearchAutocomplete';

const protestPoint = ({ iconUrl, iconRetinaUrl, iconSize, iconAnchor }) =>
  new L.Icon({
    iconUrl,
    iconRetinaUrl,
    iconAnchor,
    iconSize,
    popupAnchor: [0, -35],
  });

const positionPoint = new L.Icon({
  iconUrl: '/icons/marker.svg',
  iconRetinaUrl: '/icons/marker.svg',
  iconAnchor: [17.5, 40],
  popupAnchor: [0, -35],
  iconSize: [35, 40],
});

const PopupMarker = ({ coordinates, displayName, marker }) => {
  // Use a speical marker / the default black flag.
  let markerInfo = marker || {
    iconUrl: '/icons/fist.svg',
    iconRetinaUrl: '/icons/fist.svg',
    iconSize: [50, 48],
    iconAnchor: [12, 43],
  };

  return (
    <Marker position={[coordinates.latitude, coordinates.longitude]} icon={protestPoint(markerInfo)}>
      <Popup>{displayName}</Popup>
    </Marker>
  );
};

const MarkersList = ({ markers }) => {
  const items = markers.map(({ id, ...props }) => <PopupMarker key={id} {...props} />);
  return <>{items}</>;
};

// Initial map value, before the user provide their coordinates.
const balfur = [31.7749837, 35.219797];

function AppMap({ markers, coordinates, setMapPosition, setCoordinates }) {
  const addressInputRef = useRef(); // Search Bar ref
  return (
    <MapWrapper
      center={coordinates.length > 0 ? coordinates : balfur}
      onMoveEnd={(t) => {
        setMapPosition([t.target.getCenter().lat, t.target.getCenter().lng]);
      }}
      zoom={14}
    >
      <SearchPlaceAutoComplete
        setCoordinates={setCoordinates}
        inputRef={addressInputRef}
        className="leaflet-pane leaflet-map-pane"
      />
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coordinates.length === 2 && (
        <>
          <Marker position={coordinates} icon={positionPoint}></Marker>
          <MarkersList markers={markers} />
          {MKs.map((mk) => (
            <>
              <Marker position={mk.position} icon={new L.icon(mk.icon)}>
                <Popup>{mk.name}</Popup>
              </Marker>
            </>
          ))}
          <Circle radius={1000} center={coordinates} />
        </>
      )}
    </MapWrapper>
  );
}
const SearchPlaceAutoComplete = styled(MapSearchAutocomplete)`
  z-index: 10000;
  position:absolute;
  top 30;
`;
const MapWrapper = styled(Map)`
  width: 100%;
  height: 350px;
  grid-row: 1;
  grid-column: 2 / -1;
  z-index: 0;

  @media (min-width: 768px) {
    height: 100%;
  }
`;

export default AppMap;
