import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import { PictureFeed, CheckInList, WithMeList } from './';
import { getLocalStorage, setLocalStorage } from '../../localStorage';
import { LiveEventWrapper, LiveEventHeader, LiveCurrentView } from './LiveEventElements';
import Helmet from 'react-helmet';

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
      return <PictureFeed />;
    case VIEWS.withMe:
      return <WithMeList currentProtest={currentProtest} />;

    default:
      return '...';
  }
}

function LiveEvent() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentProtest, setProtest] = useState(null);
  const [currentView, setCurrentView] = useState(VIEWS.pictures);

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
    wrapper.current.scrollTop = 0;
  });

  return (
    <LiveEventWrapper ref={wrapper}>
      <Helmet>
        <title>פיד מחאה</title>
      </Helmet>

      <LiveEventHeader>
        <LiveEventHeader.Button selected={currentView === VIEWS.pictures} onClick={() => setCurrentView(VIEWS.pictures)}>
          <LiveEventHeader.Button.Icon src="/icons/image-gallery.svg" />
          פיד תמונות
        </LiveEventHeader.Button>
      </LiveEventHeader>
      <LiveCurrentView>{renderView({ currentView, currentProtest })}</LiveCurrentView>
    </LiveEventWrapper>
  );
}

export default observer(LiveEvent);
