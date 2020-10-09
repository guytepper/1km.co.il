import { useEffect, useState } from 'react';
import firebase, { firestore } from '../../firebase';
import * as geofirestore from 'geofirestore';
import API from '../../api';

const GeoFirestore = geofirestore.initializeApp(firestore);

/**
 * Add a new protest to the map and archive the pending one.
 * @param {*} params - The new protest parameters.
 * @param {*} pendingProtestId - The pending protest id.
 */
const createProtest = async (params, protestId) => {
  try {
    const a = await API.createProtest(params);
    const b = await API.archivePendingProtest(protestId);
    if (a === undefined && b === true) {
      return true;
    }
    return a;
  } catch (err) {
    alert('An error occured; check the console');
    console.error(err);
  }
};

export async function fetchPendingProtests() {
  const snapshot = await firestore
    .collection('pending_protests')
    .where('archived', '!=', true)
    .orderBy('archived')
    .orderBy('created_at', 'desc')
    .limit(50)
    .get();
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
}

export async function archiveProtest(protestId, archiveCallback) {
  try {
    const archived = await API.archivePendingProtest(protestId);
    if (archived) {
      archiveCallback();
      // setPendingProtests((prevState) => {
      //   const index = prevState.indexOf(currentProtest);
      //   const newPendingProtests = [...prevState.slice(0, index), ...prevState.slice(index + 1)];
      //   setCurrentProtest(prevState[index + 1]);
      //   reset(prevState[index + 1]);
      //   return newPendingProtests;
      // });
    } else {
      alert(archived);
    }
  } catch (err) {
    alert('An error occured; check the console');
    console.error(err);
  }
}

export async function submitProtest(params, protest, currentPosition, submitCallback) {
  params.coords = currentPosition;
  const result = await createProtest(params, protest.id);
  if (result) {
    submitCallback();
    // setPendingProtests((prevState) => {
    //   const index = prevState.indexOf(currentProtest);
    //   const newPendingProtests = [...prevState.slice(0, index), ...prevState.slice(index + 1)];
    //   setCurrentProtest(prevState[index + 1]);
    //   reset(prevState[index + 1]);
    //   return newPendingProtests;
    // });
  }
}
