const functions = require('firebase-functions');
const axios = require('axios');

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
