import firebase, { firestore } from '../firebase';
import * as geofirestore from 'geofirestore';
const GeoFirestore = geofirestore.initializeApp(firestore);

/**
 * Creates a new protest document.
 * - If the visitor is authenticated - add the protest to the public protests & pending protests collection.
 *   The protest will exist in the pending protests only for tracking it's validity.
 * - If the visitor is a guest - add the protest only to the pending protests collection.
 * @param {object} params - The protest object parameters.
 * @param {boolean} fromPending - Is the protest being created from a pending protest.
 * @returns {object} The new protest.
 */
export async function createProtest(params, fromPending = false) {
  const { coords, user, ...restParams } = params;
  const [lat, lng] = coords;

  const protestsCollection = GeoFirestore.collection('protests');
  const pendingCollection = GeoFirestore.collection('pending_protests');

  const protestParams = {
    ...restParams,
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
    coordinates: new firebase.firestore.GeoPoint(Number(lat), Number(lng)),
  };

  // If an authed user created  the protest, add them as a leader.
  if (user?.uid) {
    protestParams.roles = { leader: [user.uid] };
  }

  // Add protest to `protests` collection.
  if (fromPending === false) {
    const protestDoc = await protestsCollection.add(protestParams);
    protestParams.protestRef = protestDoc.id;
  }

  // Set archived field for pending protests verifcations.
  protestParams.archived = false;

  // Add protest to `pending_protests` collection
  const request = await pendingCollection.add(protestParams);
  return request;
}

export async function updateProtest(protestId, params) {
  const [lat, lng] = params.coords;
  await firestore
    .collection('protests')
    .doc(protestId)
    .update({
      ...params,
      coordinates: new firebase.firestore.GeoPoint(Number(lat), Number(lng)),
    });

  const doc = await firestore.collection('protests').doc(protestId).get();

  return {
    id: doc.id,
    latlng: params.coords,
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

export async function makeUserProtestLeader(protestId, userId) {
  return firestore
    .collection('protests')
    .doc(protestId)
    .update({
      'roles.leader': firebase.firestore.FieldValue.arrayUnion(userId),
    });
}

// When super-admin approves a protest-user request
export async function assignRoleOnProtest({ userId, protestId, requestId, status, adminId }) {
  if (status === 'approved') {
    await makeUserProtestLeader(protestId, userId);
  }

  // Update request
  await firestore.collection('leader_requests').doc(requestId).update({ status, approved_by: adminId });
}
