import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import styled from 'styled-components/macro';
import { PlacesAutocomplete } from '../';
import ProtestListSelection from './ProtestListSelection';

function ProtestSelection({ onProtestSelection, manualAddress = false }) {
  const store = useStore();
  // const [protests, setProtests] = useState([])

  const handleAddressSelection = (position) => {
    store.setCoordinates(position);
    store.protestStore.fetchProtests({ onlyMarkers: false, position });
  };

  return (
    <ProtestSelectionWrapper>
      <h2 style={{ textAlign: 'center', fontWeight: 600 }}>בחירת הפגנה</h2>
      {manualAddress && <PlacesAutocomplete setManualAddress={(coords) => handleAddressSelection(coords)} />}
      <ProtestListSelection
        protests={store.protestStore.closeProtests.slice(0, 5)}
        setProtest={(protest) => onProtestSelection(protest)}
      />
    </ProtestSelectionWrapper>
  );
}

export default observer(ProtestSelection);

const ProtestSelectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
