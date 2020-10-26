import React, { useState, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import { Map, ProtestList, IntroModal, Button, Footer } from '../../components';
import styled from 'styled-components/macro';

function ProtestMap() {
  const store = useStore();
  const { mapStore, protestStore } = store;
  const [modalState, setModalState] = useState(true);

  const hoveredProtest = useMemo(() => {
    if (!mapStore.hoveredProtestId) {
      return null;
    }

    return protestStore.nearbyProtests.find((protest) => protest.id === mapStore.hoveredProtestId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStore.hoveredProtestId]);

  // Fetch protests they haven't been loaded yet
  useEffect(() => {
    if (protestStore.nearbyProtests.length === 0 && protestStore.state === 'pending') {
      protestStore.fetchProtests({ onlyMarkers: false });
    }
  }, []);

  return (
    <>
      <HomepageWrapper>
        <ProtestListWrapper>
          <ProtestListHead>
            <Button style={{ width: '100%' }} onClick={() => setModalState(true)}>
              שינוי כתובת
            </Button>
          </ProtestListHead>
          <ProtestList
            closeProtests={protestStore.closeProtests}
            farProtests={protestStore.farProtests}
            loading={protestStore.protests?.length === 0 && protestStore.state === 'pending'}
          />
          <Footer />
        </ProtestListWrapper>

        <Map hoveredProtest={hoveredProtest} />
      </HomepageWrapper>
      <IntroModal isOpen={modalState} setIsOpen={setModalState} />
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

const ProtestListHead = styled.div`
  margin-bottom: 8px;
`;
