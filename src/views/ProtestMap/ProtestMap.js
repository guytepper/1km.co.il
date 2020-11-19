import React, { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { getCurrentPosition } from '../../utils';
import { useStore } from '../../stores';
import { Map, ProtestList } from '../../components';
import Helmet from 'react-helmet';
import styled from 'styled-components/macro';

function ProtestMap() {
  const store = useStore();
  const { mapStore, protestStore, userCoordinates } = store;
  const hoveredProtest = useMemo(() => {
    if (!mapStore.hoveredProtestId) {
      return null;
    }

    return protestStore.nearbyProtests.find((protest) => protest.id === mapStore.hoveredProtestId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStore.hoveredProtestId]);

  // Fetch protests initially
  useEffect(() => {
    if (protestStore.nearbyProtests.length === 0) {
      protestStore.fetchProtests({ onlyMarkers: false });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCoordinates]);

  // Ask for user location on map initial load
  useEffect(() => {
    const setCoordinates = async () => {
      try {
        if (userCoordinates.length === 0) {
          const coordinates = await getCurrentPosition();
          store.setCoordinates(coordinates);
        }
      } catch (err) {
        alert('לא הצלחנו לאתר את המיקום.\nניתן להזין את המיקום ידנית :)');
      }
    };

    setCoordinates();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>מפת הפגנות</title>
      </Helmet>
      <HomepageWrapper>
        <ProtestListWrapper>
          <ProtestList
            closeProtests={protestStore.closeProtests}
            farProtests={protestStore.farProtests}
            loading={protestStore.protests?.length === 0 && protestStore.state === 'pending'}
          />
        </ProtestListWrapper>

        <Map hoveredProtest={hoveredProtest} />
      </HomepageWrapper>
    </>
  );
}

export default observer(ProtestMap);

const HomepageWrapper = styled.div`
  height: 100%;
  display: grid;
  grid-row: 2;
  z-index: 0;

  @media (min-width: 768px) {
    grid-template-columns: 280px 1fr;
    grid-template-rows: 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 300px 1fr;
  }

  @media (min-width: 1280px) {
    grid-template-columns: 330px 1fr;
  }

  @media (min-width: 1700px) {
    grid-template-columns: 375px 1fr;
  }
`;

const ProtestListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  grid-column: 1 / 2;
  grid-row: 2;

  @media (min-width: 768px) {
    grid-row: 1;
    padding: 10px 15px 0;
    max-height: calc(100vh - 60px);
  }
`;
