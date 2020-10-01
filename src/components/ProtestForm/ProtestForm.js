import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ReCaptcha, loadReCaptcha } from 'react-recaptcha-v3';
import PlacesAutocomplete from '../PlacesAutocomplete';
import { useForm } from 'react-hook-form';
import { Map, TileLayer, Marker } from 'react-leaflet';
import Button from '../Button';
import { validateLatLng } from '../../utils';
import { createProtest } from '../../api';

function ProtestForm({ initialCoords }) {
  const { register, handleSubmit } = useForm();
  const [coordinates, setCoordinates] = useState(() => {
    let initialState = [31.7749837, 35.219797];
    if (validateLatLng(initialCoords)) initialState = initialCoords;
    return initialState;
  });
  const [streetName, setStreetName] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const { recaptcha } = useRef(null);

  const onSubmit = async (params) => {
    if (!streetName) {
      alert('אנא הזינו את כתובת ההפגנה');
      return;
    } else {
      try {
        params.coords = coordinates;
        params.streetAddress = streetName;
        params.recaptchaToken = recaptchaToken;

        let protest = await createProtest(params);
        if (protest._document) {
          setSubmitSuccess(true);
          setSubmitMessage('ההפגנה נשלחה בהצלחה ותתווסף למפה בזמן הקרוב :)');
        } else {
          throw protest;
        }
      } catch (err) {
        setSubmitSuccess(true);
        setSubmitMessage('תקלה התרחשה בתהליך השליחה. אנא פנו אלינו וננסה להבין את הבעיה: guytepper@gmail.com');
      }
    }
  };

  useEffect(() => {
    loadReCaptcha(process.env.REACT_APP_RECAPTCHA_KEY);
  }, []);

  const verifyCallback = (recaptchaToken) => {
    setRecaptchaToken(recaptchaToken);
  };

  return (
    <ProtestFormWrapper onSubmit={handleSubmit(onSubmit)}>
      {submitSuccess ? (
        <>
          <SuccessMessage>{submitMessage}</SuccessMessage>
          <Link to="/">
            <Button>לעמוד הראשי</Button>
          </Link>
        </>
      ) : (
        <>
          <ProtestFormLabel>
            שם המקום
            <ProtestFormInput type="text" name="displayName" ref={register} placeholder="איפה ההפגנה?"></ProtestFormInput>
            <ProtestFormInputDetails>שם המקום כפי שתושבי האיזור מכירים אותו</ProtestFormInputDetails>
          </ProtestFormLabel>
          <ProtestFormLabel>
            כתובת
            <PlacesAutocomplete setManualAdress={setCoordinates} setStreetName={setStreetName} />
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
          <ReCaptcha
            ref={recaptcha}
            sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
            action="action_name"
            verifyCallback={verifyCallback}
          />
          <Button type="submit" color="#1ED96E">
            {' '}
            הוספת הפגנה
          </Button>
        </>
      )}
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
  z-index: 0;
`;

const SuccessMessage = styled.h2`
  text-align: center;
`;

export default ProtestForm;
