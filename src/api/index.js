import firebase, { firestore } from '../firebase';
import * as geofirestore from 'geofirestore';
const GeoFirestore = geofirestore.initializeApp(firestore);

export function createProtest(params) {
  const { streetAddress, telegramLink, whatsAppLink, meeting_time, notes, coords } = params;

  const [lat, lng] = coords;
  const geocollection = GeoFirestore.collection('pending_protests');

  const request = geocollection.add({
    streetAddress,
    telegramLink,
    whatsAppLink,
    notes,
    meeting_time,
    created_at: new Date(),
    coordinates: new firebase.firestore.GeoPoint(Number(lat), Number(lng)),
  });

  console.log(request);
}
