const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const os = require('os');
const env = require('dotenv').config();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { nanoid } = require('nanoid');

const { Storage } = require('@google-cloud/storage');
const gcs = new Storage();
admin.initializeApp();

exports.onUserCreate = functions.firestore.document('/users/{userId}').onCreate(async (snap, context) => {
  // Grab the current value of what was written to Cloud Firestore.
  const pictureUrl = snap.data().pictureUrl;
  const bucket = gcs.bucket(process.env.FIREBASE_STORAGE);
  const filename = `${nanoid()}.jpeg`;
  const filePath = `profile_pics/${filename}`;
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
        });
        resolve(file[0].metadata.mediaLink);
      });
    });
    functions.logger.log('Changed user picutre url', context.params.userId);
    return snap.ref.set({ pictureUrl: newPictureUrl }, { merge: true });
  } catch (error) {
    return new functions.https.HttpsError('cancelled', error);
  }
});
