// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.22.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.22.1/firebase-messaging.js');

// TODO: move to env
var config = {
  apiKey: 'AIzaSyBKg9OXp5MFF3PUh0EwdXTosbNCO1q-9V8',
  authDomain: 'one-km-dev.firebaseapp.com',
  databaseURL: 'https://one-km-dev.firebaseio.com',
  projectId: 'one-km-dev',
  appId: '1:245810621010:web:ade566bba9cc4b4cbe0d8b',
  messagingSenderId: '482982855634',
};

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp(config);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/firebase-logo.png',
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  console.log(event);
  return event;
});
