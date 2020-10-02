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
    recaptchaToken,
    displayName,
    streetAddress,
    telegramLink,
    whatsAppLink,
    meeting_time,
    phoneNumber,
    notes,
    coords,
    approveContact,
  } = params;

  try {
    const verification = await verifyRecaptcha(recaptchaToken);

    if (verification.success) {
      const [lat, lng] = coords;
      const geocollection = GeoFirestore.collection('pending_protests');

      const request = geocollection.add({
        displayName,
        streetAddress,
        telegramLink,
        whatsAppLink,
        phoneNumber,
        notes,
        meeting_time,
        created_at: new Date(),
        coordinates: new firebase.firestore.GeoPoint(Number(lat), Number(lng)),
        approveContact,
      });

      return request;
    } else {
      throw new Error('Recaptcha error');
    }
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

export default {
  createProtest,
  createPendingProtest,
  archivePendingProtest,
};
