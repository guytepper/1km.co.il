import React from 'react';
import { Marker, Polyline, TileLayer } from 'react-leaflet';
import * as S from './ProtestMap.style';

function ProtestMap({ coordinates, mapElement, polylineElement, polyPositions }) {
  return (
    <S.MapWrapper center={{ lat: coordinates.latitude, lng: coordinates.longitude }} zoom={14} ref={mapElement}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={{ lat: coordinates.latitude, lng: coordinates.longitude }}></Marker>
      {polyPositions.length > 0 && (
        <>
          <Polyline ref={polylineElement} positions={polyPositions} />
          {polyPositions.map((position) => (
            <Marker position={{ lat: position[0], lng: position[1] }} key={position[0]}></Marker>
          ))}
        </>
      )}
    </S.MapWrapper>
  );
}

export default ProtestMap;
