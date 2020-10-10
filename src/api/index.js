import firebase, { firestore } from '../firebase';
import * as geofirestore from 'geofirestore';
const GeoFirestore = geofirestore.initializeApp(firestore);

// async function verifyRecaptcha(token) {
//   try {
//     const request = await fetch(`https://us-central1-one-kol.cloudfunctions.net/sendRecaptcha?token=${token}`);
//     const response = await request.json();
//     return response;
//   } catch (err) {
//     throw err;
//   }
// }

export async function createPendingProtest(params) {
  const {
    // recaptchaToken,
    displayName,
    streetAddress,
    telegramLink,
    whatsAppLink,
    dateTimeList,
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
      dateTimeList,
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

export async function updateProtest(protestId, params) {
  await firestore.collection('protests').doc(protestId).update(params);

  const doc = await firestore.collection('protests').doc(protestId).get();

  const { latitude, longitude } = doc.data().g.geopoint;
  const protestLatlng = [latitude, longitude];

  return {
    id: doc.id,
    latlng: protestLatlng,
    ...doc.data(),
    _document: true,
  };
}

export async function archivePendingProtest(protestId) {
  try {
    await firestore.collection('pending_protests').doc(protestId).update({
      archived: true,
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function archiveProtest(protestId) {
  try {
    await firestore.collection('protests').doc(protestId).update({
      archived: true,
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
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
  firebase
    .auth()
    .signOut()
    .then(
      function () {},
      function (error) {
        console.error(error);
      }
    );
}

export async function getFullUserData(uid) {
  return (await firestore.collection('users').doc(uid).get()).data();
}

export async function getProtestsForLeader(uid) {
  var protestsRef = firestore.collection('protests');
  var query = protestsRef.where('roles.leader', 'array-contains', uid);

  const querySnapshot = await query.get();
  const protests = [];

  querySnapshot.forEach(function (doc) {
    protests.push({ id: doc.id, ...doc.data() });
  });

  return protests;
}

export function createLeaderRequestId(userId, protestId) {
  return `${userId}${protestId}`;
}

export async function saveUserInFirestore(userData) {
  const userRef = firestore.collection('users').doc(userData.uid);
  
  if ((await userRef.get()).exists) {
    await userRef.update(userData);
  } else {
    await userRef.set(userData);
  }
}

export async function setPhoneNumberForUser(uid, phoneNumber) {
  await firestore.collection('users').doc(uid).update({ phoneNumber });
}

// return true is the protest exist in the database
export async function isProtestValid(protestId) {
  try {
    const doc = await firestore.collection('protests').doc(protestId).get();
    if (doc.exists) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getUserFromRedirect() {
  const result = await firebase.auth().getRedirectResult();

  if (!result.user) {
    // before redirect we don't have a user
    return false;
  }

  return result;
}

export async function sendProtestLeaderRequest(userData, phoneNumber, protestId) {
  const requestId = createLeaderRequestId(userData.uid, protestId);

  await firestore
    .collection('leader_requests')
    .doc(requestId)
    .set({
      status: 'pending',
      user: {
        ...userData,
        phoneNumber,
      },
      protestId,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
    });
}

export function extractUserData(result) {
  const { uid, displayName, email } = result.user;
  const { first_name, last_name, picture } = result.additionalUserInfo.profile;
  const picture_url = picture.data.url;

  const userData = {
    uid,
    email,
    first_name,
    last_name,
    displayName,
    picture_url,
  };

  return userData;
}

export function handleSignIn() {
  var provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope('email');
  firebase.auth().signInWithRedirect(provider);
}

///////////////////////////////////////////////////////
// functions to be used by the admin page
// in order to show data and complete the process of
// assigning the leader role on protests
export async function listLeaderRequests() {
  const leaderRequests = [];
  const snapshot = await firestore
    .collection('leader_requests')
    .where('status', '==', 'pending')
    .orderBy('created_at', 'desc')
    .limit(20)
    .get();
  snapshot.forEach((doc) => {
    leaderRequests.push({ id: doc.id, ...doc.data() });
  });
  return leaderRequests;
}

// When super-admin approves a protest-user request
export async function assignRoleOnProtest({ userId, protestId, requestId, status }) {
  if (status === 'approved') {
    await firestore
      .collection('protests')
      .doc(protestId)
      .update({
        'roles.leaders': firebase.firestore.FieldValue.arrayUnion(userId),
      });
  }

  // Update request
  await firestore.collection('leader_requests').doc(requestId).update({ status });
}
