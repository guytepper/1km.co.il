import React, { useState, useEffect } from 'react';
import CheckInModal from '../../components/CheckInModal';
import { useHistory } from 'react-router-dom';

function LiveEvent({ user, closeProtests, coordinates, setCoordinates, loading }) {
  const [isModalOpen, setModalOpen] = useState(false);
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
      לייב!
      {isModalOpen && (
        <CheckInModal
          isOpen={isModalOpen}
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
