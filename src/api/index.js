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
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
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
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
    coordinates: new firebase.firestore.GeoPoint(Number(lat), Number(lng)),
  });

  return request;
}

export async function updateProtest(protestId, params, approved) {
  try {
    const request = await firestore
      .collection('protests')
      //.collection(approved ? 'protests' : 'pending_protests')
      .doc(protestId)
      .update(params);

    if (request === undefined) return { _document: true };
    // Remain compatible with createProtest
    return { ...request, _document: true };
  } catch (err) {
    console.log(err);
    return err;
  }
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
    return { id: protest.id, ...protest.data() };
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

export async function fetchNearbyProtests(position) {
  const geocollection = GeoFirestore.collection('protests');
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
}

export async function signOut() { 
  firebase.auth().signOut().then(function() {
  }, function(error) {
    console.error(error);
  });
}

export async function getFullUserData(uid) {
  return (await firestore.collection('users').doc(uid).get()).data();
}
