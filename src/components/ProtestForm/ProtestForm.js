import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
// import { ReCaptcha, loadReCaptcha } from 'react-recaptcha-v3';
import PlacesAutocomplete from '../PlacesAutocomplete';
import { useForm } from 'react-hook-form';
import { Map, TileLayer, Marker } from 'react-leaflet';
import Button from '../Button';
import { validateLatLng } from '../../utils';
import { createPendingProtest } from '../../api';
import firebase, { firestore } from '../../firebase';
import * as geofirestore from 'geofirestore';
import L from 'leaflet';

const GeoFirestore = geofirestore.initializeApp(firestore);

const protestMarker = new L.Icon({
  iconUrl: '/icons/black-flag.svg',
  iconRetinaUrl: '/icons/black-flag.svg',
  iconSize: [50, 48],
  iconAnchor: [25, 48],
});

const geocollection = GeoFirestore.collection('protests');
const getNearProtests = async (position) => {
  const query = geocollection.near({
    center: new firebase.firestore.GeoPoint(position[0], position[1]),
    radius: 2,
  });
  const snapshot = await query.limit(10).get();
  const protests = snapshot.docs.map((doc) => {
    const { latitude, longitude } = doc.data().g.geopoint;
    const protestLatlng = [latitude, longitude];
    return {
      id: doc.id,
      latlng: protestLatlng,
      ...doc.data(),
    };
  });
  return protests;
};

function ProtestForm({ initialCoords }) {
  const { register, handleSubmit } = useForm();
  const [coordinates, setCoordinates] = useState(() => {
    let initialState = [31.7749837, 35.219797];
    if (validateLatLng(initialCoords)) initialState = initialCoords;
    return initialState;
  });
  const [streetName, setStreetName] = useState('');
  // const [recaptchaToken, setRecaptchaToken] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [nearbyProtests, setNearbyProtests] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(14);
  // const { recaptcha } = useRef(null);

  useEffect(() => {
    async function nearbyProtests() {
      const protests = await getNearProtests(coordinates);
      setNearbyProtests(protests);
    }
    nearbyProtests();
  }, [streetName]);

  const onSubmit = async (params) => {
    if (!streetName) {
      alert('אנא הזינו את כתובת ההפגנה');
      return;
    } else {
      try {
        params.coords = coordinates;
        params.streetAddress = streetName;
        // params.recaptchaToken = recaptchaToken;

        let protest = await createPendingProtest(params);
        if (protest._document) {
          setSubmitSuccess(true);
          setSubmitMessage('ההפגנה נשלחה בהצלחה ותתווסף למפה בזמן הקרוב :)');
        } else {
          throw protest;
        }
      } catch (err) {
        setSubmitSuccess(true);
        setSubmitMessage('תקלה התרחשה בתהליך השליחה. אנא פנו אלינו וננסה להבין את הבעיה: support@1km.co.il');
      }
    }
  };

  // useEffect(() => {
  //   loadReCaptcha(process.env.REACT_APP_RECAPTCHA_KEY);
  // }, []);

  // const verifyCallback = (recaptchaToken) => {
  //   setRecaptchaToken(recaptchaToken);
  // };

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
            <ProtestFormInput
              type="text"
              name="displayName"
              ref={register}
              placeholder="איפה ההפגנה?"
              autoFocus
            ></ProtestFormInput>
            <ProtestFormInputDetails>שם המקום כפי שתושבי האיזור מכירים אותו</ProtestFormInputDetails>
          </ProtestFormLabel>
          <ProtestFormLabel>
            כתובת
            <PlacesAutocomplete setManualAdress={setCoordinates} setStreetName={setStreetName} />
            <ProtestFormInputDetails>לאחר בחירת הכתובת, הזיזו את הסמן למיקום המדויק:</ProtestFormInputDetails>
          </ProtestFormLabel>
          <MapWrapper
            center={coordinates}
            zoom={zoomLevel}
            scrollWheelZoom={'center'}
            onMove={(t) => {
              setCoordinates([t.target.getCenter().lat, t.target.getCenter().lng]);
              setZoomLevel(t.target._zoom);
            }}
            onZoom={(event)=>{
              setZoomLevel(event.target._zoom);
            }}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coordinates}></Marker>
            {nearbyProtests.map((protest) => (
              <Marker position={protest.latlng} icon={protestMarker} key={protest.id}></Marker>
            ))}
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
          <hr />
          <ProtestFormSectionTitle>פרטי יצירת קשר</ProtestFormSectionTitle>
          <ProtestFormInputDetails margin="10px 0">
            האימייל לא יפורסם באתר ולא יועבר לשום גורם חיצוני. ניצור קשר במידה ונצטרך לוודא את פרטי ההפגנה.
          </ProtestFormInputDetails>

          <ProtestFormLabel>
            כתובת מייל
            <ProtestFormInput type="email" placeholder="האימייל שלך" name="email" ref={register}></ProtestFormInput>
          </ProtestFormLabel>

          <ProtestFormCheckboxWrapper>
            <ProtestFormCheckbox type="checkbox" id="contact-approve" name="approveContact" ref={register} />
            <label htmlFor="contact-approve">אני מעוניין/מעוניינת לקבל עדכונים מיוצר האתר</label>
          </ProtestFormCheckboxWrapper>

          {/* <ReCaptcha
            ref={recaptcha}
            sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
            action="action_name"
            verifyCallback={verifyCallback}
          /> */}
          <Button type="submit" color="#1ED96E">
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
  border: 1px solid #d2d2d2;
  -webkit-appearance: none;
`;

const ProtestFormInputDetails = styled.span.attrs((props) => ({
  textAlign: props.textAlign || 'initial',
  margin: props.margin || '0',
}))`
  display: block;
  font-size: 14px;
  font-weight: 300;
  margin: ${(props) => props.margin};
  text-align: ${(props) => props.textAlign};
`;

const ProtestFormCheckbox = styled.input``;

const MapWrapper = styled(Map)`
  width: 100%;
  height: 250px;
  margin-bottom: 10px;
  z-index: 0;
`;

const ProtestFormSectionTitle = styled.h3`
  margin: 3px 0;
`;

const ProtestFormCheckboxWrapper = styled.div`
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: start;
  margin: 7.5px 0;
  font-size: 14px;
  font-weight: 100;
`;

const SuccessMessage = styled.h2`
  text-align: center;
`;

export default ProtestForm;
