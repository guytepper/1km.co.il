import React, { useState } from 'react';
import styled from 'styled-components';
import PlacesAutocomplete from '../PlacesAutocomplete';
import { useForm } from 'react-hook-form';
import { Map, TileLayer, Marker } from 'react-leaflet';
import Button from '../Button';
import { createProtest } from '../../api';

function ProtestForm({ initialCoords }) {
  const { register, handleSubmit, errors } = useForm();
  const [coordinates, setCoordinates] = useState(initialCoords || [31.7749837, 35.219797]);

  const onSubmit = (params) => {
    if (coordinates === initialCoords) params.streetAddress = 'בדיקה';
    params.coords = coordinates;
    createProtest(params);
  };

  console.log(coordinates);

  return (
    <ProtestFormWrapper onSubmit={handleSubmit(onSubmit)}>
      <ProtestFormLabel>
        מיקום ההפגנה
        <PlacesAutocomplete setManualAdress={setCoordinates} />
        <ProtestFormInputDetails>לאחר בחירת הכתובת, הזיזו את הסמן למיקום המדויק:</ProtestFormInputDetails>
      </ProtestFormLabel>

      <MapWrapper
        center={coordinates}
        zoom={14}
        onMove={(t) => {
          setCoordinates([t.target.getCenter().lat, t.target.getCenter().lng]);
        }}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}></Marker>
      </MapWrapper>

      <ProtestFormLabel>
        שעת מפגש
        <ProtestFormInput type="time" defaultValue="17:30" name="meeting_time" ref={register}></ProtestFormInput>
      </ProtestFormLabel>

      <ProtestFormLabel>
        קבוצת וואטסאפ
        <ProtestFormInput placeholder="לינק לקבוצה" name="whatsAppLink" ref={register}></ProtestFormInput>
      </ProtestFormLabel>
      <ProtestFormLabel>
        קבוצת טלגרם
        <ProtestFormInput placeholder="לינק לקבוצה" name="telegramLink" ref={register}></ProtestFormInput>
      </ProtestFormLabel>
      <ProtestFormLabel>
        הערות
        <ProtestFormInput placeholder="הערות להפגנה" name="notes" ref={register}></ProtestFormInput>
        <ProtestFormInputDetails>כל דבר שחשוב שיופיע בפרטי ההפגנה.</ProtestFormInputDetails>
      </ProtestFormLabel>
      <ProtestFormLabel>
        כתובת מייל
        <ProtestFormInput type="email" placeholder="האימייל שלך" name="email" ref={register}></ProtestFormInput>
        <ProtestFormInputDetails>
          אם פרטי ההפגנה לא יהיו ברורים ונצטרך ליצור קשר. <br />
          לא יפורסם באתר ולא יועבר לשום גורם .
        </ProtestFormInputDetails>
      </ProtestFormLabel>
      <Button type="submit" color="#1ED96E">
        {' '}
        הוספת הפגנה
      </Button>
    </ProtestFormWrapper>
  );
}

const ProtestFormWrapper = styled.form`
  width: 300px;
  margin: 25px auto;
  justify-items: center;

  @media (min-width: 768px) {
    grid-column: 1 / -1;
  }
`;

const ProtestFormLabel = styled.label`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
  font-weight: 600;
`;

const ProtestFormInput = styled.input`
  width: 100%;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 16px;
`;

const ProtestFormInputDetails = styled.span`
  font-size: 14px;
  font-weight: 300;
`;

const MapWrapper = styled(Map)`
  width: 100%;
  height: 250px;
`;

export default ProtestForm;
