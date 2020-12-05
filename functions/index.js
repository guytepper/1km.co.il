const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const os = require('os');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const { databaseURL, storageBucket } = JSON.parse(process.env.FIREBASE_CONFIG);
admin.initializeApp({
  projectId: process.env.GCLOUD_PROJECT,
  storageBucket: storageBucket,
  databaseURL: databaseURL,
});

/**
 * Listens for new users added to /users/:userId/
 * @param {object} snap - A data object that contains a snapshot of the data stored in the specified document..
 * @param {object} context - The context in which an event occurred.
 * @returns {Promise} A promise to be resolved with a reference to the updated user document.
 */
exports.onUserCreate = functions.firestore.document('/users/{userId}').onCreate((snap, context) => {
  return reuploadUserPicture(snap, context);
});

/**
 * Reuploads the user profile picture to firebase storage and update the relevant user document in firestore.
 * @returns {Promise} Reference to the updated user document.
 */
async function reuploadUserPicture(snap, context) {
  // Grab the current value of what was written to Cloud Firestore.
  const pictureUrl = snap.data().pictureUrl;
  const bucket = admin.storage().bucket();
  const filename = 'profile.jpeg';
  const filePath = `users/${context.params.userId}/${filename}`;
  const tempFilePath = path.join(os.tmpdir(), filename);

  try {
    // Download the image
    const img = await fetch(pictureUrl);
    const imgBlob = img.body;
    const fileStream = fs.createWriteStream(tempFilePath);
    const newPictureUrl = await new Promise((resolve, reject) => {
      imgBlob.pipe(fileStream);
      imgBlob.on('error', (error) => {
        functions.logger.log('Error changing user picutre url', context.params.userId, error);
        reject(pictureUrl);
      });

      // Upload the image to our storage
      fileStream.on('finish', async () => {
        const file = await bucket.upload(tempFilePath, {
          destination: filePath,
          predefinedAcl: 'publicRead',
          public: 'true',
          contentType: 'image/jpeg',
        });
        resolve(file[0].metadata.mediaLink);
      });
    });

    const updatedUser = await snap.ref.set({ pictureUrl: newPictureUrl }, { merge: true });
    functions.logger.log('Changed user picutre url', context.params.userId, newPictureUrl);
    return updatedUser;
  } catch (error) {
    functions.logger.log('Error updating user profile picture', error);
    throw new functions.https.HttpsError('cancelled', error);
  }
}
