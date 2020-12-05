import firebase, { firestore } from '../firebase';
import * as geofirestore from 'geofirestore';
import { calculateDistance } from '../utils';

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
  console.log(user);

  const protestsCollection = GeoFirestore.collection('protests');
  const pendingCollection = GeoFirestore.collection('pending_protests');

  const protestParams = {
    ...restParams,
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
    coordinates: new firebase.firestore.GeoPoint(Number(lat), Number(lng)),
  };

  // If an authed user created  the protest, add them as a leader.
  // Protests created from pending should not have a user attached to them initially.
  if (user?.uid && fromPending === false) {
    protestParams.roles = { leader: [user.uid] };
  }

  if (user?.uid || fromPending === true) {
    const protestDoc = await protestsCollection.add(protestParams);
    protestParams.protestRef = protestDoc.id;
  }

  // Set archived field for pending protests verifcations.
  protestParams.archived = false;

  // Add protest to `pending_protests` collection
  const request = await pendingCollection.add(protestParams);
  return request;
}

export async function updateProtest({ protestId, params }) {
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

export async function fetchNearbyProtests(position) {
  const geocollection = GeoFirestore.collection('protests');

  const query = geocollection.near({
    center: new firebase.firestore.GeoPoint(position[0], position[1]),
    radius: 20,
  });

  const snapshot = await query.limit(35).get();

  const protests = snapshot.docs.map((doc) => {
    const { latitude, longitude } = doc.data().g.geopoint;
    const protestLatlng = [latitude, longitude];
    return {
      id: doc.id,
      latlng: protestLatlng,
      distance: calculateDistance(position, protestLatlng),
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
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    return { ...userDoc, exists: true };
  } else {
    const { uid, first_name: initialFirst, last_name: initialLast, displayName, pictureUrl } = userData;
    const updatedUserObject = {
      uid,
      initialFirst,
      initialLast,
      displayName,
      pictureUrl,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    return userRef.set(updatedUserObject).then(() => updatedUserObject);
  }
}

export async function setPhoneNumberForUser(uid, phoneNumber) {
  await firestore.collection('users').doc(uid).update({ phoneNumber });
}

// Check if the protest exist in the database
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
    // Before redirect we don't have a user
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
  const { uid, displayName } = result.user;
  let first_name, last_name, pictureUrl;
  const isEmulator = result.additionalUserInfo.profile.picture.data ? false : true;

  // In development mode we are using the authentication emulator; note that the additionalUserInfo.info.profile properties are different while using it.
  if (isEmulator) {
    [first_name, last_name] = result.additionalUserInfo.profile.name.split(' ');
    pictureUrl = result.additionalUserInfo.profile.picture;
  } else {
    first_name = result.additionalUserInfo.profile.first_name;
    last_name = result.additionalUserInfo.profile.last_name;
    pictureUrl = result.additionalUserInfo.profile.picture.data.url;
  }
  const userData = {
    uid,
    first_name,
    last_name,
    displayName,
    pictureUrl,
  };

  return userData;
}

export function handleSignIn() {
  var provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope('email');
  firebase.auth().signInWithRedirect(provider);
}

/**
 * Functions to be used by the admin page in order to show data
 * and complete the process of assigning the leader role on protests
 **/

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

export async function updateUserName({ userId, firstName, lastName = '' }) {
  const userRef = firestore.collection('users').doc(userId);

  const updatedUser = await userRef.update({ firstName, lastName });
  return updatedUser;
}

export async function getLatestProtestPictures(protestId) {
  const latestSnapshot = await firestore
    .collection('pictures')
    .where('protestId', '==', protestId)
    .orderBy('createdAt', 'desc')
    .limit(6)
    .get();

  const pictureList = latestSnapshot.docs.map((picture) => ({ ...picture.data(), id: picture.id }));
  return pictureList;
}

export async function getPicturesForEvent({ protestId }) {
  const eventPictures = await firestore
    .collection('pictures')
    .where('protestId', '==', protestId)
    .orderBy('createdAt', 'desc')
    .get();

  const pictureList = eventPictures.docs.map((picture) => ({ ...picture.data(), id: picture.id }));
  return pictureList;
}
