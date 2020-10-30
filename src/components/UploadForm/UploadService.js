import firebase, { firestore, realtimeDB } from '../../firebase';
import { EVENT_DATE } from '../../views/LiveEvent/event_data';

export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
}

export async function uploadImage(base64File) {
  try {
    const formData = new FormData();
    formData.append('upload_preset', 'public_upload');
    formData.append('file', base64File);
    const response = await fetch('https://api.cloudinary.com/v1_1/onekm/upload', { method: 'POST', body: formData });

    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function savePictureToFirestore({ pictureData }) {
  const pictureParams = {
    ...pictureData,
    archived: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  const pictureDoc = await firestore.collection('pictures_TEST').add(pictureParams);
  return pictureDoc;
}

export async function savePictureToLiveFeed(livePictureData) {
  const livePicture = realtimeDB.ref(`${EVENT_DATE}_pictures`).push();
  await livePicture.set({ ...livePictureData, createdAt: firebase.database.ServerValue.TIMESTAMP });
  return livePicture;
}

export async function keepAnnonymousReference({ userId, pictureId }) {
  const anonData = await firestore.collection('annonymous_uploads_data_TEST').doc(pictureId).set({ userId });
  return anonData;
}
