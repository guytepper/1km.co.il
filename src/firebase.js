import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/messaging';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_ID,
};

firebase.initializeApp(config);

export const firestore = firebase.firestore();
export const auth = firebase.auth();

export const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => auth.signInWithPopup(provider);
export const signOut = () => auth.signOut();

console.log('setting up messaging')
const messaging = firebase.messaging();
// messaging.usePublicVapidKey("BLRSg5cI02K8XMW3mKfVOHnKXqRcMk3HBgq8DyQLjfEH-R0Wyi8kGZOvRS-rmyGdGxaYWi7igICLyo0vTlKqsUE");
messaging.getToken().then((currentToken) => {
  if (currentToken) {
    console.log(currentToken)
    // sendTokenToServer(currentToken);
    // updateUIForPushEnabled(currentToken);
  } else {
    // Show permission request.
    console.log('No Instance ID token available. Request permission to generate one.');
    // Show permission UI.
    // updateUIForPushPermissionRequired();
    // setTokenSentToServer(false);
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // showToken('Error retrieving Instance ID token. ', err);
  // setTokenSentToServer(false);
});

messaging.onMessage(msg => {
  console.log({ msg })
})
export default firebase;
