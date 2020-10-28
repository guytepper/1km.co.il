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
    const response = await fetch('http://localhost:5001/one-kol/us-central1/uploadImage', {
      method: 'POST',
      body: JSON.stringify({ data: base64File }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function savePictureToFirestore({ imageUrl, protestId, userId, annonymousUpload }) {
  const pictureParams = {
    url: imageUrl,
    protestId,
    userId,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  };

  const pictureDoc = await firestore.collection('pictures').add(pictureParams);
  return pictureDoc;
}

export async function savePictureToLiveFeed(livePictureData) {
  const livePicture = realtimeDB.ref(`${EVENT_DATE}_pictures`).push();
  await livePicture.set({ ...livePictureData, createdAt: firebase.database.ServerValue.TIMESTAMP });
  return livePicture;
}
