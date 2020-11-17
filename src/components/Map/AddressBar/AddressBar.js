import * as React from 'react';
import styled from 'styled-components/macro';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
import { getCurrentPosition } from '../../../utils';
import { useStore } from '../../../stores';
import '@reach/combobox/styles.css';

const getUserPosition = async ({ setCoordinates }) => {
  try {
    const position = await getCurrentPosition();
    setCoordinates(position);
  } catch (err) {
    alert('לא הצלחנו לאתר את המיקום.\nניתן להזין את המיקום ידנית :)');
  }
};

export default function MapSearchAutocomplete({ inputRef }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete({ debounce: 900 });
  const store = useStore();

  const handleInput = (e) => {
    const charactersThreshold = 3;
    const term = e.target.value;
    const shouldFetch = term.length >= charactersThreshold;
    setValue(term, shouldFetch);
  };

  const handleSelect = (address) => {
    setValue(address, false);

    getGeocode({ address })
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        const { lat, lng } = latLng;
        store.setCoordinates([lat, lng]);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  const renderSuggestions = () => {
    const suggestions = data.map((suggestion) => <ComboboxOption key={suggestion.place_id} value={suggestion.description} />);

    return (
      <>
        {suggestions}
        <li style={{ margin: '10px 10px 5px', textAlign: 'left' }}>
          <img src="/icons/powered_google.png" alt="Powered by Google" style={{ width: 100 }} />
        </li>
      </>
    );
  };

  return (
    <ComboboxWrapper onSelect={handleSelect}>
      <div style={{ position: 'absolute', width: '100%' }}>
        <LocationIcon src="/icons/marker-purple.svg" />
        <GPSIcon src="/icons/gps.svg" alt="" onClick={() => getUserPosition({ setCoordinates: store.setCoordinates })} />
        <ComboboxInputWrapper
          value={value}
          name="streetAddress"
          onChange={handleInput}
          disabled={!ready}
          ref={inputRef}
          placeholder="מה הכתובת?"
        />
      </div>
      <ComboboxPopover>
        <ComboboxList>{status === 'OK' && renderSuggestions()}</ComboboxList>
      </ComboboxPopover>
    </ComboboxWrapper>
  );
}
const ComboboxWrapper = styled(Combobox)`
  position: absolute;
  z-index: 1000;
  width: 100%;

  @media (min-width: 768px) {
    position: static;
    grid-row: 2 / 3;
    grid-column: 2 / 3;
  }
`;

const ComboboxInputWrapper = styled(ComboboxInput)`
  z-index: 10000;
  position: absolute;
  top: 20px;
  left: 10%;
  right: 5%;
  width: 90%;
  margin-bottom: 10px;
  padding: 10px 45px;
  border: 0;
  border-radius: 50px;
  font-family: Simpler, sans-serif;
  font-size: 16px;
  appearance: none;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
  z-index: 10000;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #b8c0fc;
  }

  @media (min-width: 768px) {
    right: 10%;
    width: 50%;
    position: static;
  }
`;

const LocationIcon = styled.img`
  z-index: 10001;
  top: 31px;
  right: calc(5% + 17px);
  position: absolute;

  grid-column: 1 / 2;
  height: 20px;
  user-select: none;
  z-index: 10001;

  @media (min-width: 768px) {
    top: 10px;
    right: 20px;
  }
`;

const GPSIcon = styled.img`
  z-index: 10001;
  top: 31px;
  left: calc(5% + 17px);
  position: absolute;
  grid-column: 2 / 3;
  height: 20px;
  user-select: none;
  cursor: pointer;
  z-index: 10001;
  filter: invert(100%); /* GPS Icon is white - changed it to black */

  @media (min-width: 768px) {
    top: 10px;
    left: calc(50% + 17px);
  }
`;
