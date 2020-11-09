import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../stores';
import { useHistory } from 'react-router-dom';
import PictureCardList from './PicutreCardList';
import ActionButton from '../../../components/elements/Button/ActionButton';
import GalleryIcon from '../../../assets/icons/gallery.svg';
import { realtimeDB } from '../../../firebase';
import { nanoid } from 'nanoid';
import { LoadingSpinner } from '../../../components';
import { useVisible } from 'react-hooks-visible';

function PictureFeed() {
  const store = useStore();
  const [pictures, setPictures] = useState([]);
  const [initialLoading, setLoading] = useState(true);
  const [fetching, setFetchingState] = useState(false);
  const [fetchedAll, setFetchedAll] = useState(false); // Whether all pictures have been fetched
  const [targetRef, visible] = useVisible(); // Check if the bottom spinner is visible
  const history = useHistory();

  useEffect(() => {
    const livePictures = realtimeDB.ref('live_feed').orderByChild('createdAt').limitToLast(10);

    livePictures.on('child_added', (data) => {
      setPictures((prevState) => {
        return [{ ...data.val(), id: nanoid() }, ...prevState];
      });
    });

    livePictures.once('value', () => {
      setLoading(false);
    });

    return () => {
      livePictures.off();
    };
  }, []);

  // If reached page bottom, fetch more pictures
  useEffect(() => {
    if (visible && !fetching) {
      setFetchingState(true);
      const lastPictureTimestamp = pictures[pictures.length - 1].createdAt - 1;
      const picturesQuery = realtimeDB.ref(`live_feed`).orderByChild('createdAt').endAt(lastPictureTimestamp).limitToLast(10);

      picturesQuery.once('value', (snapshot) => {
        const snapshotValue = snapshot.val();
        if (snapshotValue) {
          const newPictures = Object.values(snapshotValue)
            .reverse()
            .map((picture) => ({ ...picture, id: nanoid() }));

          setPictures((prevState) => [...prevState, ...newPictures]);
          setFetchingState(false);
        } else {
          // Fetched all pictures
          setFetchedAll(true);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <div>
      {initialLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '25px 0' }}>
          <p style={{ fontSize: 17 }}>טוען ...</p>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <PictureCardList pictures={pictures} />
          {!fetchedAll && (
            <div ref={targetRef} style={{ display: 'flex', justifyContent: 'center', margin: '25px 0' }}>
              <LoadingSpinner />
            </div>
          )}
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
