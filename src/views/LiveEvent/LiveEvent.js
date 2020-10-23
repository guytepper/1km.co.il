import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import CheckInModal from '../../components/CheckInModal';
import { LiveEventWrapper, LiveEventHeader } from './LiveEventElements';

const VIEWS = {
  feed: 'liveFeed',
  pictures: 'pictureFeed',
  withMe: 'withMeFeed',
};

function LiveEvent({ user, closeProtests, coordinates, setCoordinates, loading }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState(VIEWS.feed);
  const history = useHistory();

  useEffect(() => {
    const { pathname } = history.location;

    if (pathname.startsWith('/live/check-in') && isModalOpen !== true) {
      setModalOpen(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  return (
    <>
      <LiveEventWrapper>
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
            מי מפגין איתי
          </LiveEventHeader.Button>
        </LiveEventHeader>
      </LiveEventWrapper>
      {isModalOpen && (
        <CheckInModal
          isOpen={isModalOpen}
          setModalOpen={setModalOpen}
          closeProtests={closeProtests}
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          user={user}
          loading={loading}
        />
      )}
    </>
  );
}

export default LiveEvent;
