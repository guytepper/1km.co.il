import React, { useEffect, useState } from 'react';
import { Button } from '../components';
import { useAuth } from '../hooks';
import firebase, { firestore, signInWithGoogle } from '../firebase';
import styled from 'styled-components';
import { Map, TileLayer, Marker } from 'react-leaflet';
import * as geofirestore from 'geofirestore';
import { useForm } from 'react-hook-form';
import API from '../api';

const archiveProtest = async (protestId) => {
  try {
    const archived = await API.archivePendingProtest(protestId);
    if (archived) {
      alert('success!');
    } else {
      alert(archived);
    }
  } catch (err) {
    alert('An error occured; check the console');
    console.error(err);
  }
};

/**
 * Add a new protest to the map and archive the pending one.
 * @param {*} params - The new protest parameters.
 * @param {*} pendingProtestId - The pending protest id.
 */
const createProtest = async (params, protestId) => {
  try {
    const a = await API.createProtest(params);
    console.log(a);
    const b = await API.archivePendingProtest(protestId);
    console.log(b);
  } catch (err) {
    alert('An error occured; check the console');
    console.error(err);
  }
};

function Admin() {
  const authUser = useAuth();
  const [pendingProtests, setPendingProtests] = useState([]);
  const [currentProtest, setCurrentProtest] = useState({});
  const [currentPosition, setCurrentPosition] = useState([31.7749837, 35.219797]);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    async function fetchProtests() {
      const snapshot = await firestore
        .collection('pending_protests')
        .where('archived', '!=', true)
        .orderBy('archived')
        .orderBy('created_at')
        .limit(5)
        .get();
      const protests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPendingProtests(protests);
    }
    fetchProtests();
  }, []);

  // Update map coordinates on protest select
  useEffect(() => {
    if (currentProtest.coordinates) {
      setCurrentPosition([currentProtest.coordinates.latitude, currentProtest.coordinates.longitude]);
    }
  }, [currentProtest]);

  const submitProtest = (params) => {
    params.coords = currentPosition;
    console.log(params);
  };

  console.log(currentPosition);

  return (
    <AdminWrapper>
      {authUser ? (
        <>
          <PendingProtestsList>
            {pendingProtests.map((protest) => (
              <PendingCard onClick={() => setCurrentProtest(protest)} key={protest.id}>
                {protest.displayName || protest.streetAddress}
              </PendingCard>
            ))}
          </PendingProtestsList>
          <DetailsWrapper onSubmit={handleSubmit(submitProtest)}>
            {' '}
            <ProtestDetail>
              <ProtestDetailLabel>ID</ProtestDetailLabel>
              <ProtestDetailInput defaultValue={currentProtest.id} disabled />
            </ProtestDetail>
            <ProtestDetail>
              <ProtestDetailLabel>שם המקום</ProtestDetailLabel>
              <ProtestDetailInput name="displayName" defaultValue={currentProtest.displayName} ref={register} />
            </ProtestDetail>
            <ProtestDetail>
              <ProtestDetailLabel>רחוב</ProtestDetailLabel>
              <ProtestDetailInput name="streetAddress" defaultValue={currentProtest.streetAddress} ref={register} />
            </ProtestDetail>
            <ProtestDetail>
              <ProtestDetailLabel>קבוצת וואטסאפ</ProtestDetailLabel>
              <ProtestDetailInput name="whatsAppLink" defaultValue={currentProtest.whatsAppLink} ref={register} />
            </ProtestDetail>
            <ProtestDetail>
              <ProtestDetailLabel>קבוצת טלגרם</ProtestDetailLabel>
              <ProtestDetailInput name="telegramLink" defaultValue={currentProtest.telegramLink} ref={register} />
            </ProtestDetail>
            <ProtestDetail>
              <ProtestDetailLabel>הערות</ProtestDetailLabel>
              <ProtestDetailInput name="notes" defaultValue={currentProtest.notes} ref={register} />
            </ProtestDetail>
            <ProtestDetail>
              <ProtestDetailLabel>שעה</ProtestDetailLabel>
              <ProtestDetailInput name="meeting_time" type="time" defaultValue={currentProtest.meeting_time} ref={register} />
            </ProtestDetail>
            <Button type="submit" color="#1ED96E" style={{ marginBottom: 7.5 }}>
              יצירת הפגנה
            </Button>
            <Button color="tomato" onClick={() => archiveProtest(currentProtest.id)}>
              מחיקת הפגנה
            </Button>
          </DetailsWrapper>
          <MapWrapper
            center={currentPosition}
            zoom={14}
            onMove={(t) => {
              setCurrentPosition([t.target.getCenter().lat, t.target.getCenter().lng]);
            }}
          />
        </>
      ) : (
        <Button onClick={signInWithGoogle}>התחבר למערכת</Button>
      )}
    </AdminWrapper>
  );
}

export default Admin;

const AdminWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 3fr;
  padding: 20px;
`;

const PendingProtestsList = styled.div`
  display: grid;
  grid-auto-rows: 80px;
  gap: 15px;
`;

const PendingCard = styled.div`
  background-color: #fff;
`;

const DetailsWrapper = styled.form`
  justify-self: center;
`;

const ProtestDetail = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
  font-weight: 600;
`;

const ProtestDetailLabel = styled.label``;

const ProtestDetailInput = styled.input`
  width: 100%;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 16px;
  border: 1px solid #d2d2d2;
  -webkit-appearance: none;
`;

const MapWrapper = styled(Map)`
  width: 100%;
  height: 250px;
  margin-bottom: 10px;
  z-index: 0;
`;
