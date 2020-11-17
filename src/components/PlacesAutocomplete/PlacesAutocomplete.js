import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';

import '@reach/combobox/styles.css';

export default function PlacesAutocomplete({ setManualAddress, setStreetAddress, inputRef, defaultValue }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    clearSuggestions,
    setValue,
  } = usePlacesAutocomplete({ debounce: 900, defaultValue });

  // Updates value when defaultValue changes (happens on the admin page when choosing a protest)
  useEffect(() => {
    setValue(defaultValue, false);
    clearSuggestions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  // useEffect(() => {
  //   if (value === '') {
  //     setManualAddress(null);
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [value]);

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
        setManualAddress([lat, lng]);
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
    <Combobox onSelect={handleSelect} style={{ width: '100%' }} aria-label="הזנת כתובת ידנית" s>
      <ComboboxInputWrapper
        value={value}
        name="streetAddress"
        onChange={handleInput}
        disabled={!ready}
        ref={inputRef}
        placeholder="מה הכתובת?"
      />
      <ComboboxPopover style={{ zIndex: 1000 }}>
        <ComboboxList>{status === 'OK' && renderSuggestions()}</ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
}

const ComboboxInputWrapper = styled(ComboboxInput)`
  width: 100%;
  padding: 6px 20px;
  margin-bottom: 10px;
  font-size: 16px;
  border: 1px solid #d2d2d2;
  -webkit-appearance: none;
`;
