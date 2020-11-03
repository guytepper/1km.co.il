import firebase, { firestore, realtimeDB } from '../../firebase';
import { nanoid } from 'nanoid';

export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
}

export async function uploadImage({ base64File, protestId, date }) {
  try {
    const fileId = nanoid();
    const formData = new FormData();
    formData.append('upload_preset', 'public_upload');
    formData.append('file', base64File);
    formData.append('public_id', `${protestId}/${date}/${fileId}`);
    const response = await fetch('https://api.cloudinary.com/v1_1/onekm/upload', { method: 'POST', body: formData });

    const data = await response.json();
    console.log(data);
    return { ...data, fileId };
  } catch (err) {
    console.error(err);
  }
}

export async function savePictureToFirestore({ pictureData, fileId }) {
  const pictureParams = {
    ...pictureData,
    archived: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  const pictureDoc = await firestore.collection('pictures').doc(fileId).set(pictureParams);
  return pictureDoc;
}

export async function savePictureToLiveFeed(livePictureData) {
  const livePicture = realtimeDB.ref('live_feed').push();
  await livePicture.set({ ...livePictureData, createdAt: firebase.database.ServerValue.TIMESTAMP });
  return livePicture;
}

export async function keepAnnonymousReference({ userId, pictureId }) {
  const anonData = await firestore.collection('annonymous_uploads_data').doc(pictureId).set({ userId });
  return anonData;
}
