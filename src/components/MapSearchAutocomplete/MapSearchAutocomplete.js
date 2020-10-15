import * as React from 'react';
import styled from 'styled-components/macro';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
import { getCurrentPosition } from '../../utils';
import '@reach/combobox/styles.css';

export default function MapSearchAutocomplete({ setStreetAddress, setCoordinates, inputRef, defaultValue }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    clearSuggestions,
    setValue,
  } = usePlacesAutocomplete({ debounce: 900, defaultValue });

  const getUserPosition = async () => {
    try {
      const position = await getCurrentPosition();
      setCoordinates(position);
      setValue('');
      clearSuggestions();
    } catch (err) {
      alert('לא הצלחנו לאתר את המיקום.\nניתן להזין את המיקום ידנית :)');
    }
  };

  // updates value when defaultValue changes
  // happens on the admin page when choosing a protest
  /*React.useEffect(() => {
    setValue(defaultValue, false);
    clearSuggestions();
  }, [defaultValue, setValue, clearSuggestions]);

  React.useEffect(() => {
    if (value === '') {
      setCoordinates(null);
    }
  }, [value, setCoordinates]);
*/
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
      <GpsIcon src="/icons/gps.svg" alt="" onClick={() => getUserPosition()} />
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
  left: 15%;
  right: 15%;

  width: 70%;
  margin-bottom: 10px;
  padding: 10px 50px;

  border: 0px;
  border-radius: 50px;
  font-size: 16px;
  appearance: none;
  box-shadow: 14px 19px 22px -7px rgba(0, 0, 0, 0.19);

  @media (min-width: 768px) {
    left: 10%;
    right: 10%;
    width: 80%;
  }
`;

/*1. z-index should be higher then 10000-(the input z-index)*/
const LocationIcon = styled.img`
  z-index: 10001; /* 1 */
  top: 29px;
  right: calc(15% + 17px);
  position: absolute;

  height: 20px;
  user-select: none;

  @media (min-width: 768px) {
    right: calc(10% + 20px);
  }
`;

const GPSIcon = styled.img`
  z-index: 10001; /* 1 */
  top: 29px;
  left: calc(15% + 17px);
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
