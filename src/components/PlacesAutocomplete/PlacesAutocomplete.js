import * as React from 'react';
import styled from 'styled-components';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';

import '@reach/combobox/styles.css';

export default function PlacesAutocomplete({ setManualAddress, setStreetName, inputRef }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete({ debounce: 900 });

  const handleInput = (e) => {
    const charactersThreshold = 3;
    const term = e.target.value;
    const shouldFetch = term.length >= charactersThreshold;
    setValue(term, shouldFetch);
    updateStreetName(term);
  };

  const updateStreetName = (address) => setStreetName && setStreetName(address);

  const handleSelect = (address) => {
    setValue(address, false);

    getGeocode({ address })
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        const { lat, lng } = latLng;
        setManualAddress([lat, lng]);
        updateStreetName(address);
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
    <Combobox onSelect={handleSelect} aria-labelledby="demo">
      <ComboboxInputWrapper
        value={value}
        name="streetName"
        onChange={handleInput}
        disabled={!ready}
        placeholder="מה הכתובת?"
        ref={inputRef}
      />
      <ComboboxPopover>
        <ComboboxList>{status === 'OK' && renderSuggestions()}</ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
}

const ComboboxInputWrapper = styled(ComboboxInput)`
  width: 300px;
  padding: 6px 20px;
  margin-bottom: 10px;
  font-size: 16px;
  border: 1px solid #d2d2d2;
  -webkit-appearance: none;
`;
