const functions = require('firebase-functions');
const axios = require('axios');
const AWS = require('aws-sdk');

exports.sendRecaptcha = functions.https.onRequest(async (req, res) => {
  const secret = functions.config().recaptca.secret;
  res.set('Access-Control-Allow-Origin', 'https://1km.co.il');

  const token = req.query.token;
  const response = await axios.get(`https://recaptcha.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`);
  const data = response.data;

  console.log(data);

  if (data.success) {
    return res.status(200).send({ success: true });
  }
  return res.status(400).send({ success: false });
});

exports.uploadImage = functions.https.onRequest(async (req, res) => {
  const s3 = new AWS.S3({
    accessKeyId: '',
    secretAccessKey: '',
  });

  const params = {
    Bucket: '1km',
    Key: 'image.jpg', // File name you want to save as in S3
    Body: req.body,
  };

  // Uploading files to the bucket
  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }

    res.status(200).send({ err, data });
    console.log(`File uploaded successfully. ${data.Location}`);
  });
});
