import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { realtimeDB } from '../../firebase';
import { CheckInModal, Button } from '../../components';
import { CheckInList, WithMeList } from './';
import { getLocalStorage, setLocalStorage } from '../../localStorage';
import { LiveEventWrapper, LiveEventHeader, LiveEventMessage, LiveCurrentView } from './LiveEventElements';

const VIEWS = {
  feed: 'liveFeed',
  pictures: 'pictureFeed',
  withMe: 'withMeFeed',
};

function renderView({ currentView, currentProtest, checkIns }) {
  switch (currentView) {
    case VIEWS.feed:
      return <CheckInList checkIns={checkIns} />;
    case VIEWS.pictures:
      return <p>Pictures!</p>;
    case VIEWS.withMe:
      return <WithMeList currentProtest={currentProtest} />;

    default:
      return 'hi!';
  }
}

function LiveEvent({ user, closeProtests, coordinates, setCoordinates }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentProtest, setProtest] = useState(null);
  const [currentView, setCurrentView] = useState(VIEWS.feed);
  const [checkIns, setCheckIns] = useState([]);
  const [hasCheckedIn, setCheckedIn] = useState(false);
  const wrapper = useRef(null);
  const history = useHistory();

  useEffect(() => {
    const { pathname } = history.location;

    if (pathname.startsWith('/live/check-in') && isModalOpen !== true) {
      setModalOpen(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  useEffect(() => {
    // Check if exists in localStorage
    const cachedProtest = getLocalStorage('check_in_selected_protest');

    if (currentProtest) {
      if (cachedProtest?.id !== currentProtest.id) {
        setLocalStorage('check_in_selected_protest', currentProtest);
      }
    } else {
      if (cachedProtest) setProtest(cachedProtest);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProtest]);

  useEffect(() => {
    const checkIns = realtimeDB.ref('24-10-20_check_ins').orderByChild('createdAt').limitToLast(15);
    checkIns.on('child_added', (data) => {
      setCheckIns((prevState) => {
        return [{ ...data.val(), id: data.key }, ...prevState];
      });
      console.log(checkIns);
    });

    // checkIns.once('value', () => {
    //   setLoading(false);
    // });

    return () => {
      checkIns.off();
    };
  }, []);

  useEffect(() => {
    const checkedIn = getLocalStorage('24-10-20_check_in');
    if (checkedIn) {
      setCheckedIn(true);
    }
  }, []);

  useEffect(() => {
    wrapper.current.scrollTop = 0;
  });

  return (
    <>
      <LiveEventWrapper ref={wrapper}>
        <LiveEventHeader>
          <LiveEventHeader.Button selected={currentView === VIEWS.feed} onClick={() => setCurrentView(VIEWS.feed)}>
            <LiveEventHeader.Button.Icon invert={currentView === VIEWS.feed} src="/icons/israel-map.svg" />
            פיד ארצי
          </LiveEventHeader.Button>
          <LiveEventHeader.Button selected={currentView === VIEWS.pictures} onClick={() => setCurrentView(VIEWS.pictures)}>
            <LiveEventHeader.Button.Icon src="/icons/image-gallery.svg" />
            פיד תמונות
          </LiveEventHeader.Button>
          <LiveEventHeader.Button selected={currentView === VIEWS.withMe} onClick={() => setCurrentView(VIEWS.withMe)}>
            <LiveEventHeader.Button.Icon src="/icons/strike.svg" />
            מפגינים איתי
          </LiveEventHeader.Button>
        </LiveEventHeader>

        {!hasCheckedIn && (
          <Button onClick={() => setModalOpen(true)} style={{ width: '100%' }}>
            צ'ק אין להפגנה
          </Button>
        )}

        <LiveEventMessage>המידע מתעדכן בזמן אמת</LiveEventMessage>
        <LiveCurrentView>{renderView({ currentView, checkIns, currentProtest })}</LiveCurrentView>
      </LiveEventWrapper>
      {isModalOpen && (
        <CheckInModal
          isOpen={isModalOpen}
          currentProtest={currentProtest}
          setProtest={setProtest}
          setModalOpen={setModalOpen}
          closeProtests={closeProtests}
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          user={user}
        />
      )}
    </>
  );
}

export default LiveEvent;
