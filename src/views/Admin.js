import React, { useEffect, useState } from 'react';
import { Button } from '../components';
import { useAuth } from '../hooks';
import firebase, { firestore, signInWithGoogle } from '../firebase';
import styled from 'styled-components';
import { Map, TileLayer, Marker } from 'react-leaflet';
import * as geofirestore from 'geofirestore';
import { createProtest, archivePendingProtest } from '../api';

const archiveProtest = async (protestId) => {
  try {
    const archived = await archivePendingProtest(protestId);
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

function Admin() {
  const authUser = useAuth();
  const [pendingProtests, setPendingProtests] = useState([]);
  const [currentProtest, setCurrentProtest] = useState({});

  useEffect(() => {
    async function fetchProtests() {
      const snapshot = await firestore
        .collection('pending_protests')
        // .where('archived', '!=', true)
        .orderBy('archived')
        .limit(3)
        .get();
      const protests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPendingProtests(protests);
    }
    fetchProtests();
  }, []);

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
          <DetailsWrapper>
            {' '}
            <ProtestDetail>
              <ProtestDetailLabel>ID</ProtestDetailLabel>
              <ProtestDetailInput defaultValue={currentProtest.id} disabled />
            </ProtestDetail>
            <ProtestDetail>
              <ProtestDetailLabel>שם המקום</ProtestDetailLabel>
              <ProtestDetailInput defaultValue={currentProtest.displayName} />
            </ProtestDetail>
            <ProtestDetail>
              <ProtestDetailLabel>רחוב</ProtestDetailLabel>
              <ProtestDetailInput defaultValue={currentProtest.streetAddress} />
            </ProtestDetail>
            <ProtestDetail>
              <ProtestDetailLabel>קבוצת וואטסאפ</ProtestDetailLabel>
              <ProtestDetailInput defaultValue={currentProtest.whatsAppLink} />
            </ProtestDetail>
            <ProtestDetail>
              <ProtestDetailLabel>קבוצת טלגרם</ProtestDetailLabel>
              <ProtestDetailInput defaultValue={currentProtest.telegramLink} />
            </ProtestDetail>
            <ProtestDetail>
              <ProtestDetailLabel>הערות</ProtestDetailLabel>
              <ProtestDetailInput defaultValue={currentProtest.notes} />
            </ProtestDetail>
            <ProtestDetail>
              <ProtestDetailLabel>שעה</ProtestDetailLabel>
              <ProtestDetailInput type="time" defaultValue={currentProtest.meeting_time} />
            </ProtestDetail>
            <Button color="#1ED96E" style={{ marginBottom: 7.5 }}>
              יצירת הפגנה
            </Button>
            <Button color="tomato" onClick={() => archiveProtest(currentProtest.id)}>
              מחיקת הפגנה
            </Button>
          </DetailsWrapper>
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

const DetailsWrapper = styled.div`
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
