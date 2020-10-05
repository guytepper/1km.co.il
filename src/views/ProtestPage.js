import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useParams } from 'react-router-dom';
import { fetchProtest } from '../api';
import { Map, TileLayer, Marker } from 'react-leaflet';

function useFetchProtest() {
  const [protest, setProtest] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function _fetchProtest(id) {
      const result = await fetchProtest(id);
      if (result) {
        setProtest(result);
      } else {
        // TODO: handle 404
      }
    }

    _fetchProtest(id);
  }, [id]);

  return protest;
}

export default function ProtestPage() {
  const protest = useFetchProtest();

  if (!protest) {
    // TODO: loading state
    return <div>Loading...</div>;
  }

  const { coordinates, whatsAppLink, telegramLink } = protest;

  return (
    <Container>
      <h2>{protest.displayName}</h2>
      <p>
        {protest.streetAddress} - יום שבת, {protest.meeting_time}
      </p>
      {whatsAppLink && (
        <a href={whatsAppLink} target="_blank" rel="noopener noreferrer">
          <Icon src="/icons/whatsapp.svg" alt="whatsapp link" />
        </a>
      )}

      {telegramLink && (
        <a href={telegramLink} target="_blank" rel="noopener noreferrer">
          <Icon src="/icons/telegram.svg" alt="telegram link" />
        </a>
      )}

      <MapWrapper center={{ lat: coordinates.latitude, lng: coordinates.longitude }} zoom={14}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={{ lat: coordinates.latitude, lng: coordinates.longitude }}></Marker>
      </MapWrapper>
    </Container>
  );
}

//----------------- Styles -------------------------//

const Container = styled.div`
  width: 80%;
  max-width: 1000px;
  padding: 24px 0;
  margin: 0 auto;
`;

const MapWrapper = styled(Map)`
  height: 250px;
  width: 250px;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
`;
