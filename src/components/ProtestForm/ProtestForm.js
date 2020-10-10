import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
// import { ReCaptcha, loadReCaptcha } from 'react-recaptcha-v3';
import PlacesAutocomplete from '../PlacesAutocomplete';
import { useForm } from 'react-hook-form';
import { Map, TileLayer, Marker } from 'react-leaflet';
import Button from '../Button';
import { validateLatLng } from '../../utils';
import { fetchNearbyProtests } from '../../api';
import L from 'leaflet';
import DateTimeList from '../DateTimeList';

const protestMarker = new L.Icon({
  iconUrl: '/icons/black-flag.svg',
  iconRetinaUrl: '/icons/black-flag.svg',
  iconSize: [50, 48],
  iconAnchor: [25, 48],
});

function ProtestForm({ initialCoords, submitCallback, defaultValues = {}, afterSubmitCallback = () => {}, editMode = null }) {
  const coordinatesUpdater = useCallback(() => {
    let initialState = [31.7749837, 35.219797];
    if (validateLatLng(initialCoords)) initialState = initialCoords;
    return initialState;
  }, [initialCoords]);

  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues,
  });

  const [streetAddressDefaultValue, setStreetAddressDefaultValue] = useState(defaultValues.streetAddress);

  // These two are separate so that onMoveEnd isn't called on every map move
  // map center
  const [mapCenter, setMapCenter] = useState(coordinatesUpdater);
  // position of marker
  const [markerPostion, setMarkerPosition] = useState(coordinatesUpdater);

  const [dateTimeList, setDateTimeList] = useState(defaultValues.dateTimeList || [{ id: 0, time: '17:30' }]);

  // const [recaptchaToken, setRecaptchaToken] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [nearbyProtests, setNearbyProtests] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(14);
  // const { recaptcha } = useRef(null);

  const setStreetAddress = React.useCallback((value) => setValue('streetAddress', value), [setValue]);

  useEffect(() => {
    reset({});
    setStreetAddressDefaultValue('');
    setStreetAddress('');
  }, [editMode, reset, setStreetAddress]);

  // the two useEffects below this are in order to deal
  // with the defaultValues and the places auto complete
  useEffect(() => {
    if (Object.keys(defaultValues).length > 0) {
      reset(defaultValues);
      setSubmitMessage('');
      setSubmitSuccess(false);
      setStreetAddressDefaultValue(defaultValues.streetAddress);
      setStreetAddress(defaultValues.streetAddress);
      setDateTimeList(defaultValues.dateTimeList || [{ id: 0, time: '17:30' }]);

      if (validateLatLng(defaultValues.latlng)) {
        setMapCenter(defaultValues.latlng);
        setMarkerPosition(defaultValues.latlng);
      }
    }
  }, [defaultValues, reset, setStreetAddress, setDateTimeList]);

  // Load nearby protests on mount
  useEffect(() => {
    const coords = coordinatesUpdater();
    async function nearbyProtests() {
      const protests = await fetchNearbyProtests(coords);
      setNearbyProtests(protests);
    }
    nearbyProtests();
  }, [coordinatesUpdater]);

  const onSubmit = async (params) => {
    if (!editMode && !params.streetAddress) {
      alert('אנא הזינו את כתובת ההפגנה');
      return;
    } else {
      try {
        params.coords = mapCenter;
        params.dateTimeList = dateTimeList;
        // params.recaptchaToken = recaptchaToken;

        let protest = await submitCallback(params);

        if (editMode) {
          setSubmitSuccess(true);
          setSubmitMessage('ההפגנה נשלחה בהצלחה ותתווסף למפה בזמן הקרוב :)');
          afterSubmitCallback();
          return;
        }

        if (protest._document) {
          setSubmitSuccess(true);
          setSubmitMessage('ההפגנה נשלחה בהצלחה ותתווסף למפה בזמן הקרוב :)');
          afterSubmitCallback();
        } else {
          throw new Error('protest._document was null.');
        }
      } catch (err) {
        console.log('error!!', err);
        setSubmitSuccess(true);
        setSubmitMessage('תקלה התרחשה בתהליך השליחה. אנא פנו אלינו וננסה להבין את הבעיה: support@1km.zendesk.com');
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
      {submitSuccess && !editMode ? (
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
          {!editMode && (
            <>
              <ProtestFormLabel>
                כתובת
                <PlacesAutocomplete
                  setManualAddress={setMapCenter}
                  setStreetAddress={setStreetAddress}
                  inputRef={register}
                  defaultValue={streetAddressDefaultValue}
                />
                <ProtestFormInputDetails>לאחר בחירת הכתובת, הזיזו את הסמן למיקום המדויק:</ProtestFormInputDetails>
              </ProtestFormLabel>
              <MapWrapper
                center={mapCenter}
                zoom={zoomLevel}
                scrollWheelZoom={'center'}
                onMove={(t) => {
                  setMarkerPosition([t.target.getCenter().lat, t.target.getCenter().lng]);
                  setZoomLevel(t.target._zoom);
                }}
                onMoveEnd={async (t) => {
                  const newPosition = [t.target.getCenter().lat, t.target.getCenter().lng];
                  setMapCenter(newPosition);
                  setMarkerPosition(newPosition);
                  setZoomLevel(t.target._zoom);
                  // fetch protests on move end
                  if (mapCenter) {
                    const protests = await fetchNearbyProtests(mapCenter);
                    setNearbyProtests(protests);
                  }
                }}
                onZoom={(event) => {
                  setZoomLevel(event.target._zoom);
                }}
              >
                <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={markerPostion}></Marker>
                {nearbyProtests.map((protest) => (
                  <Marker position={protest.latlng} icon={protestMarker} key={protest.id}></Marker>
                ))}
              </MapWrapper>
            </>
          )}

          <hr />
          <ProtestFormSectionTitle>תאריך ושעה</ProtestFormSectionTitle>
          <DateTimeList dateTimeList={dateTimeList} setDateTimeList={setDateTimeList} />

          <hr />
          <ProtestFormSectionTitle>פרטי יצירת קשר</ProtestFormSectionTitle>
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
          {!editMode ? (
            <>
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
          ) : (
            <Button type="submit" color="#1ED96E">
              {editMode === 'pending' ? 'יצירת הפגנה' : 'עריכת הפגנה'}
            </Button>
          )}
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

export const ProtestFormLabel = styled.label`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
  font-weight: 600;
`;

export const ProtestFormInput = styled.input`
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
