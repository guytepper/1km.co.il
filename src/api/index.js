import firebase, { firestore } from '../firebase';
import * as geofirestore from 'geofirestore';
const GeoFirestore = geofirestore.initializeApp(firestore);

async function verifyRecaptcha(token) {
  try {
    const request = await fetch(`https://us-central1-one-kol.cloudfunctions.net/sendRecaptcha?token=${token}`);
    const response = await request.json();
    return response;
  } catch (err) {
    throw err;
  }
}

export async function createPendingProtest(params) {
  const {
    // recaptchaToken,
    displayName,
    streetAddress,
    telegramLink,
    whatsAppLink,
    meeting_time,
    notes,
    coords,
    approveContact,
  } = params;

  try {
    // Skip protest approval during development
    const tableName = process.env.NODE_ENV === 'development' ? 'protests' : 'pending_protests';
    // const verification = await verifyRecaptcha(recaptchaToken);

    // if (verification.success) {
    const [lat, lng] = coords;
    const geocollection = GeoFirestore.collection(tableName);

    const request = geocollection.add({
      displayName,
      streetAddress,
      whatsAppLink,
      telegramLink,
      notes,
      meeting_time,
      created_at: new Date(),
      coordinates: new firebase.firestore.GeoPoint(Number(lat), Number(lng)),
      approveContact,
      archived: false,
    });

    return request;
    // } else {
    //   throw new Error('Recaptcha error');
    // }
  } catch (err) {
    console.log(err);
    return err;
  }
}

export function createProtest(params) {
  const { displayName, streetAddress, telegramLink, whatsAppLink, meeting_time, notes, coords } = params;
  const [lat, lng] = coords;
  const geocollection = GeoFirestore.collection('protests');
  const request = geocollection.add({
    displayName,
    streetAddress,
    telegramLink,
    whatsAppLink,
    notes,
    meeting_time,
    created_at: new Date(),
    coordinates: new firebase.firestore.GeoPoint(Number(lat), Number(lng)),
  });

  return request;
}

export async function archivePendingProtest(protestId) {
  try {
    const request = await firestore.collection('pending_protests').doc(protestId).update({
      archived: true,
    });
    console.log(request); // <-- Why is this undefined yet the operation successful?
    if (request === undefined) return true;
    return request;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function fetchProtest(protestId) {
  const protest = await firestore.collection('protests').doc(protestId).get();

  if (protest.exists) {
    return protest.data();
  } else {
    return false;
  }
}

export async function uploadFile(params) {
  const request = await fetch('http://localhost:5001/onekm-50c7f/us-central1/uploadImage', {
    method: 'post',
    body: params,
  });
  const response = await request.json();

  console.log(response);

  // TODO: assign s3 url to protest
}

export default {
  createProtest,
  createPendingProtest,
  archivePendingProtest,
  fetchProtest,
  uploadFile,
};
