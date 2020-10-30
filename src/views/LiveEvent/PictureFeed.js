import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import { useHistory } from 'react-router-dom';
import { Avatar, Image, Affix } from 'antd';
import styled from 'styled-components/macro';
import { UploadForm } from '../../components';
import ActionButton from '../../components/elements/Button/ActionButton';
import GalleryIcon from '../../assets/icons/gallery.svg';
import { realtimeDB } from '../../firebase';
import { EVENT_DATE } from './event_data';
import TimeAgo from 'timeago-react';

import * as timeago from 'timeago.js';
import he from 'timeago.js/lib/lang/he';

timeago.register('he', he);

function PictureFeed() {
  const store = useStore();
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const livePictures = realtimeDB.ref(`${EVENT_DATE}_pictures`).orderByChild('createdAt').limitToLast(2);

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
              <Avatar size={21} src={picture.userAvatar || 'https://1km.co.il/anonymousPofile.png'} style={{ marginLeft: 6 }} />
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

      <div style={{ position: 'sticky', bottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <ActionButton
          onClick={() =>
            history.push(
              store.userStore.user ? '/upload-image?returnUrl=/live' : `/sign-up?returnUrl=/upload-image?returnUrl=/live`
            )
          }
          icon={GalleryIcon}
        >
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
  border: 1px solid #e3e3e3;
`;

Card.Image = styled(Image)`
  width: 100%;
  height: 320px;
  cursor: pointer;

  .ant-image-img {
    height: 100%;
    object-fit: cover;
    border-radius: 0 0 2px 2px;
  }
`;

Card.Info = styled.div`
  display: grid;
  grid-template-columns: 1fr 90px;
  padding: 18px 24px 24px;
`;

Card.Info.Title = styled.h3`
  margin-bottom: 2.5px;
  font-size: 22px;
  font-weight: 600;
  grid-column: 1/2;
`;

Card.Info.Subtitle = styled.h4`
  font-size: 17px;
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
