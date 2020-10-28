import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import { UploadForm } from '../../components';
import { savePictureToFirestore, savePictureToLiveFeed } from '../../components/UploadForm/UploadService';

function PictureFeed() {
  const store = useStore();

  // TODO: MOVE OUT
  store.userStore.setUserProtest('5McvqMWM5jpUXIKdN2Jo');

  const afterUpload = async (file, isAnnonymous) => {
    const imageUrl = file.secure_url;
    const { userCurrentProtest, user } = store.userStore;
    if (!store.userStore.userCurrentProtest) {
      alert('העלאה נכשלה: התמונה לא משוייכת להפגנה.');
      return;
    }

    if (!user?.uid) {
      alert('העלאה נכשלה: אינך מחובר/ת.');
      return;
    }

    const pictureData = { imageUrl, protestId: userCurrentProtest.id };

    if (!isAnnonymous) {
      pictureData.userId = user.uid;
    }

    await savePictureToFirestore(pictureData);

    pictureData.protestName = userCurrentProtest.displayName;
    pictureData.fullName = `${user.firstName || user.first_name} ${user.lastName || user.last_name}`;

    await savePictureToLiveFeed(pictureData);
  };

  return <UploadForm afterUpload={afterUpload} />;
}

export default observer(PictureFeed);
