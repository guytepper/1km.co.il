import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import { pointWithinRadius } from '../../utils';
import { Map, Circle, TileLayer, Marker, Popup } from 'react-leaflet';
import styled from 'styled-components/macro';
import MKs from './MKs.json';
import L from 'leaflet';
import AddressBar from './AddressBar';
import ProtestCard from '../ProtestCard';

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

const PopupMarker = ({ coordinates, marker, hovered, ...props }) => {
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
      <Popup closeButton={false}>
        <ProtestCard protestInfo={props} style={{ margin: 0 }} />
      </Popup>
    </Marker>
  );
};

const MarkersList = ({ markers, hoveredProtest }) => {
  let items = [];

  // TODO: useMemo for items
  if (markers.length > 0) {
    items = markers.map((props) => <PopupMarker key={props.id} {...props} hovered={hoveredProtest?.id === props.id} />);
  }

  return <>{items}</>;
};

// Initial map value, before the user provide their coordinates.
const balfur = [31.7749837, 35.219797];

function AppMap({ hoveredProtest }) {
  const store = useStore();
  const { mapStore, protestStore, userCoordinates: coordinates } = store;
  const addressInputRef = useRef(); // Search Bar ref, used by the combobox

  const updateMap = (currentMapPosition) => {
    // The following if condition is a 'hack' to check if the userCoordinates have just updated their position
    // If they did, update the protest list with the fetched nearby protests (by setting the onlyMarkers parameter to false)
    // TODO: Check if the user has just updated their position & update nearby protests list in a more elegant way.
    if (currentMapPosition[0] === coordinates[0]) {
      protestStore.fetchProtests({ onlyMarkers: false, position: currentMapPosition });
    } else {
      // Check if the protests in the current map position were requested already.
      const alreadyRequested = mapStore.mapPositionHistory.some((pos) => pointWithinRadius(pos, currentMapPosition, 3000));

      if (!alreadyRequested) {
        protestStore.fetchProtests({ onlyMarkers: true, position: currentMapPosition });
      }
    }

    mapStore.setMapPosition(currentMapPosition);
  };

  return (
    <MapWrapper
      center={coordinates.length > 0 ? coordinates : balfur}
      onMoveEnd={({ target }) => {
        updateMap([target.getCenter().lat, target.getCenter().lng]);
      }}
      zoom={14}
      zoomControl={false}
    >
      <AddressBarWrapper inputRef={addressInputRef} className="leaflet-pane leaflet-map-pane" />
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coordinates.length > 0 && (
        <>
          <Marker position={coordinates} icon={positionPoint}></Marker>
          <MarkersList markers={mapStore.markers} hoveredProtest={hoveredProtest} />
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
const AddressBarWrapper = styled(AddressBar)`
  z-index: 10000;
  position: absolute;
  top: 30px;
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

export default observer(AppMap);
