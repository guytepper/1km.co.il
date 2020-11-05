import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import styled from 'styled-components/macro';
import { PlacesAutocomplete, LoadingSpinner } from '../';
import ProtestListSelection from './ProtestListSelection';

function ProtestSelection({ onProtestSelection, manualAddress = false }) {
  const store = useStore();
  const [isLoadingProgress, setLoadingProtests] = useState(false);

  const handleAddressSelection = async (position) => {
    try {
      setLoadingProtests(true);
      store.setCoordinates(position);
      await store.protestStore.fetchProtests({ onlyMarkers: false, position });
      setLoadingProtests(false);
    } catch (e) {
      setLoadingProtests(false);
      console.log(e);
    }
  };

  return (
    <ProtestSelectionWrapper>
      <h2 style={{ textAlign: 'center', fontWeight: 600 }}>בחירת הפגנה</h2>
      {manualAddress && <PlacesAutocomplete setManualAddress={(coords) => handleAddressSelection(coords)} />}
      <ProtestListSelection
        protests={store.protestStore.closeProtests.slice(0, 5)}
        setProtest={(protest) => onProtestSelection(protest)}
      />
      {isLoadingProgress && <LoadingSpinner style={{ marginTop: 15 }} />}
    </ProtestSelectionWrapper>
  );
}

export default observer(ProtestSelection);

const ProtestSelectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
