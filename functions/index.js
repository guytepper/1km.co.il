const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const os = require('os');
const env = require('dotenv').config();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { nanoid } = require('nanoid');
const cors = require('cors')({ origin: true });

const { Storage } = require('@google-cloud/storage');
const gcs = new Storage();

exports.postUser = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(500).json({
        message: 'Not allowed',
      });
    }
    const userData = req.body;
    const { pictureUrl, uid, first_name: initialFirst, last_name: initialLast, displayName } = userData;
    const userDoc = await admin.firestore().collection('users').where('uid', '==', uid).get();
    const bucket = gcs.bucket(process.env.STORAGE);
    if (!userDoc.empty) return res.json({ ...userDoc.docs[0].data(), exists: true });
    else {
      const filename = `${nanoid()}.jpeg`;
      const filePath = `profile_pics/${filename}`;
      const tempFilePath = path.join(os.tmpdir(), filename);

      try {
        //downloading the image
        const img = await fetch(pictureUrl);
        const imgBlob = await img.body;
        const fileStream = fs.createWriteStream(tempFilePath);

        //uploading the image to google cloud
        await new Promise(() => {
          imgBlob.pipe(fileStream);

          imgBlob.on('error', (error) => {
            console.error(error);
            res.send(500, 'Failed to write the file' + error);
          });

          fileStream.on('finish', async () => {
            try {
              const file = await bucket.upload(tempFilePath, {
                destination: filePath,
                predefinedAcl: 'publicRead',
              });

              const newPictureUrl = file[0].metadata.mediaLink;
              const updatedUserObject = {
                uid,
                initialFirst,
                initialLast,
                displayName,
                newPictureUrl,
                createdAt: new Date(),
              };

              await admin.firestore().collection('users').add(updatedUserObject);
              res.json({ result: `User with ID: ${uid} added.`, User: updatedUserObject });
              fileStream.end();
            } catch (error) {
              console.error(error);
              res.send(500, 'Failed to  upload the file' + error);
            }
          });
        });
      } catch (error) {
        console.error(error);
        res.send(500, 'Failed to download the image' + error);
      }
    }
  });
});
