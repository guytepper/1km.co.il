import firebase, { firestore } from '../../firebase';

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

export async function savePictureToFirestore({ imageUrl, protestId, userId }) {
  const pictureParams = {
    url: imageUrl,
    protestId,
    userId,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
  };

  await firestore.collection('pictures').add(pictureParams);
}
