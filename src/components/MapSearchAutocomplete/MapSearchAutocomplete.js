import * as React from 'react';
import styled from 'styled-components/macro';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
import '@reach/combobox/styles.css';

export default function MapSearchAutocomplete({ setStreetAddress, setCoordinates, inputRef, defaultValue, getUserPosition }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete({ debounce: 900, defaultValue });

  const updateStreetAddress = (address) => setStreetAddress && setStreetAddress(address);

  const handleInput = (e) => {
    const charactersThreshold = 3;
    const term = e.target.value;
    const shouldFetch = term.length >= charactersThreshold;
    setValue(term, shouldFetch);
    updateStreetAddress(term);
  };

  const handleSelect = (address) => {
    setValue(address, false);

    getGeocode({ address })
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        const { lat, lng } = latLng;
        setCoordinates([lat, lng]);
        updateStreetAddress(address);
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
    <Combobox style={{ position: 'absolute', zIndex: 10000, width: '100%' }} onSelect={handleSelect}>
      <LocationIcon src="/icons/marker-purple.svg" />
      <GPSIcon src="/icons/gps.svg" alt="" onClick={() => getUserPosition()} />
      <ComboboxInputWrapper
        value={value}
        name="streetAddress"
        onChange={handleInput}
        disabled={!ready}
        ref={inputRef}
        placeholder="מה הכתובת?"
      />
      <ComboboxPopover>
        <ComboboxList>{status === 'OK' && renderSuggestions()}</ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
}

const ComboboxInputWrapper = styled(ComboboxInput)`
  z-index: 10000;
  position: absolute;
  top: 20px;
  left: 10%;
  right: 5%;

  width: 90%;
  margin-bottom: 10px;
  padding: 10px 50px;

  border: 0px;
  border-radius: 50px;
  font-family: Simpler, sans-serif;
  font-size: 16px;
  appearance: none;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);

  @media (min-width: 768px) {
    left: 10%;
    right: 10%;
    width: 80%;
  }
`;

/*1. z-index should be higher then 10000-(the input z-index)*/
const LocationIcon = styled.img`
  z-index: 10001; /* 1 */
  top: 31px;
  right: calc(6.5% + 17px);
  position: absolute;

  height: 20px;
  user-select: none;

  @media (min-width: 768px) {
    right: calc(10% + 20px);
  }
`;

const GPSIcon = styled.img`
  z-index: 10001; /* 1 */
  top: 31px;
  left: calc(6.5% + 17px);
  position: absolute;

  height: 20px;
  user-select: none;
  cursor: pointer;

  /****gps icon is white-changed it to black****/
  filter: invert(100%);

  @media (min-width: 768px) {
    left: calc(10% + 20px);
  }
`;
