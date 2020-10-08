import firebase, { firestore } from '../../firebase';

export function createLeaderRequestId(userId, protestId) {
  return `${userId}${protestId}`;
}

export async function saveUserInFirestore(userData) {
  await firestore.collection('users').doc(userData.uid).set(userData);
}

export  async function setPhoneNumberForUser(uid, phoneNumber) {
  await firestore.collection('users').doc(uid).update({ phoneNumber })
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
  } catch(error) {
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

export  async function sendProtestLeaderRequest(userData, protestId) {
  const requestId = createLeaderRequestId(userData.uid, protestId);

  await firestore.collection('leader-pending-requests').doc(requestId).set({
    user: userData,
    protestId,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}

export function extractUserData(result) {
  const { uid, displayName, email } = result.user;
  const  { first_name, last_name, picture} = result.additionalUserInfo.profile;
  const picture_url = picture.data.url;
  
  const userData = {
    uid,
    email,
    first_name,
    last_name,
    displayName,
    picture_url,
  }
  
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
export async function listPendingRequests(uid, phoneNumber) {
  return firestore.collection('leader-pending-requests')
  .orderBy('timestamp', 'desc')
  .limit(10)
  .get();
}

// When super-admin approves a protest-user request
export async function assignRoleOnProtest(userId, protestId, requestId) {
  await firestore.collection('protests').doc(protestId).update({
    'roles.leaders': firebase.firestore.FieldValue.arrayUnion(userId)
  });
  
  // Delete request
  await firestore.collection('leader-pending-requests').doc(requestId).delete();
}

export async function getProtestById(protestId) {
  return (await firestore.collection('protests').doc(protestId).get()).data();
}