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

export async function createProtest(params) {
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
        archived: false,
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
