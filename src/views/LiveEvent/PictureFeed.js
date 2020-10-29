import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import { Avatar, Image, Affix } from 'antd';
import { UploadForm } from '../../components';
import ActionButton from '../../components/elements/Button/ActionButton';
import GalleryIcon from '../../assets/icons/gallery.svg';
import { realtimeDB } from '../../firebase';
import { savePictureToFirestore, savePictureToLiveFeed } from '../../components/UploadForm/UploadService';
import styled from 'styled-components/macro';
import { EVENT_DATE } from './event_data';
import TimeAgo from 'timeago-react';

import * as timeago from 'timeago.js';
import he from 'timeago.js/lib/lang/he';

timeago.register('he', he);

function PictureFeed() {
  const store = useStore();
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);

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
    pictureData.uploaderName = `${user.firstName || user.first_name} ${user.lastName || user.last_name}`;

    await savePictureToLiveFeed(pictureData);
  };

  useEffect(() => {
    const livePictures = realtimeDB.ref(`${EVENT_DATE}_pictures`).orderByChild('createdAt').limitToLast(15);

    livePictures.on('child_added', (data) => {
      setPictures((prevState) => {
        return [{ ...data.val(), id: data.key }, ...prevState];
      });
    });

    livePictures.once('value', () => {
      setLoading(false);
    });

    return () => {
      livePictures.off();
    };
  }, []);

  return (
    <div>
      {loading && (
        <>
          <p>טוען תמונות...</p>
          <img src="/icons/loading-spinner.svg" alt="" />
        </>
      )}
      {pictures.map((picture) => (
        <Card key={picture.id}>
          <Card.Info>
            <Card.Info.Title>{picture.protestName}</Card.Info.Title>
            <Card.Info.Subtitle>
              <Avatar size={19} src="https://1km.co.il/anonymousPofile.png" style={{ marginLeft: 7.5 }} />
              {picture.uploaderName}
            </Card.Info.Subtitle>
            <Card.Description>המהפכה מתקרבת! יא הו !</Card.Description>
            <Card.Info.Timestamp>
              <TimeAgo datetime={picture.createdAt} locale="he" />
            </Card.Info.Timestamp>
          </Card.Info>
          <Card.Image src={picture.imageUrl} alt="" />
        </Card>
      ))}

      <Card>
        <Card.Info>
          <Card.Info.Title>צומת פת, ירושלים</Card.Info.Title>
          <Card.Info.Subtitle>
            <Avatar size={19} src="https://1km.co.il/anonymousPofile.png" style={{ marginLeft: 7.5 }} />
            גיא טפר
          </Card.Info.Subtitle>
          <Card.Description>המהפכה מתקרבת! יא הו !</Card.Description>
          <Card.Info.Timestamp>לפני 2 דקות</Card.Info.Timestamp>
        </Card.Info>
        <Card.Image
          src="https://img.haarets.co.il/img/1.9269511/2624696559.jpg?precrop=1918,1436,x171,y32&height=462&width=600"
          alt=""
        />
      </Card>
      <div style={{ position: 'sticky', bottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <ActionButton onClick={() => alert(1)} icon={GalleryIcon}>
          העלאת תמונה
        </ActionButton>
      </div>
    </div>
  );
}

export default observer(PictureFeed);

const Card = styled.div`
  width: 100%;
  background: #fff;
  margin: 10px 0;
  border-radius: 2px;
`;

Card.Image = styled(Image)`
  width: 100%;
  height: 320px;
  border-radius: 0 0 2px 2px;

  .ant-image-img {
    height: 100%;
    object-fit: cover;
  }
`;

Card.Info = styled.div`
  display: grid;
  grid-template-columns: 1fr 90px;
  padding: 18px 24px 24px;
`;

Card.Info.Title = styled.h3`
  margin-bottom: 0;
  font-size: 20px;
  font-weight: 600;
  grid-column: 1/2;
`;

Card.Info.Subtitle = styled.h4`
  font-size: 16px;
  grid-column: 1/2;
`;

Card.Info.Timestamp = styled.span`
  grid-column: 2/-1;
  grid-row: 1;
  align-self: center;
  text-align: left;
  font-size: 13px;
`;

Card.Description = styled.p`
  grid-column: 1 / 2;
  margin-bottom: 0;
`;
