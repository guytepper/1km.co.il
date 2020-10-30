import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../stores';
import { useHistory } from 'react-router-dom';
import PictureCardList from './PicutreCardList';
import ActionButton from '../../../components/elements/Button/ActionButton';
import GalleryIcon from '../../../assets/icons/gallery.svg';
import { realtimeDB } from '../../../firebase';
import { EVENT_DATE } from '../event_data';

function PictureFeed() {
  const store = useStore();
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const livePictures = realtimeDB.ref(`${EVENT_DATE}_pictures`).orderByChild('createdAt').limitToLast(10);

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
      {loading ? (
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '25px 0' }}
        >
          <p style={{ fontSize: 17 }}>טוען ...</p>
          <img src="/icons/loading-spinner.svg" alt="" />
        </div>
      ) : (
        <>
          <PictureCardList pictures={pictures} />
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
        </>
      )}
    </div>
  );
}

export default observer(PictureFeed);
