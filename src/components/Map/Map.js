import React from 'react';
import { Map, Circle, TileLayer, Marker, Popup } from 'react-leaflet';
import styled from 'styled-components/macro';
import MKs from './MKs.json';
import L from 'leaflet';

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

const PopupMarker = ({ coordinates, displayName, marker, hovered }) => {
  const iconUrl = hovered ? '/icons/protesting.svg' : '/icons/fist.svg';

  // Use a speical marker from the protest object / the default fist.
  let markerInfo = marker || {
    iconUrl,
    iconRetinaUrl: iconUrl,
    iconSize: [50, 48],
    iconAnchor: [12, 43],
  };

  return (
    <Marker position={[coordinates.latitude, coordinates.longitude]} icon={protestPoint(markerInfo)}>
      <Popup>{displayName}</Popup>
    </Marker>
  );
};

const MarkersList = ({ markers, hoveredProtest }) => {
  const items = markers.map(({ id, ...props }) => <PopupMarker key={id} {...props} hovered={hoveredProtest?.id === id} />);
  return <>{items}</>;
};

// Initial map value, before the user provide their coordinates.
const balfur = [31.7749837, 35.219797];

function AppMap({ markers, coordinates, setMapPosition, hoveredProtest }) {
  return (
    <MapWrapper
      center={coordinates.length > 0 ? coordinates : balfur}
      onMoveEnd={(t) => {
        setMapPosition([t.target.getCenter().lat, t.target.getCenter().lng]);
      }}
      zoom={14}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coordinates.length === 2 && (
        <>
          <Marker position={coordinates} icon={positionPoint}></Marker>
          <MarkersList markers={markers} hoveredProtest={hoveredProtest} />
          {MKs.map((mk) => (
            <Marker position={mk.position} icon={new L.icon(mk.icon)} key={mk.position[0]}>
              <Popup>{mk.name}</Popup>
            </Marker>
          ))}
          <Circle radius={1000} center={coordinates} />
        </>
      )}
    </MapWrapper>
  );
}

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
