import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import styled from 'styled-components/macro';
import { PlacesAutocomplete } from '../';
import ProtestListSelection from './ProtestListSelection';

function ProtestSelection({ onProtestSelection }) {
  const store = useStore();
  // const [protests, setProtests] = useState([])

  const handleAddressSelection = (position) => {
    console.log(position);
    store.setCoordinates(position);
    store.protestStore.fetchProtests({ onlyMarkers: false, position });
  };

  return (
    <ProtestSelectionWrapper>
      <h2 style={{ textAlign: 'center', fontWeight: 600 }}>חיפוש הפגנה</h2>
      <PlacesAutocomplete setManualAddress={(coords) => handleAddressSelection(coords)} />
      <ProtestListSelection protests={store.protestStore.closeProtests} setProtest={(protest) => onProtestSelection(protest)} />
    </ProtestSelectionWrapper>
  );
}

export default observer(ProtestSelection);

const ProtestSelectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
