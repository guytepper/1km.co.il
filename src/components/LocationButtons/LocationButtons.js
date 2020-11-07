import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../stores';
import { PlacesAutocomplete, Button } from '../';
import { getCurrentPosition } from '../../utils';

function LocationButtons() {
  const [addressInputDisplay, setAddressInputDisplay] = useState(false);
  const [manualAddress, setManualAddress] = useState(null);
  const store = useStore();
  const addressInputRef = useRef();

  const getUserPosition = async () => {
    try {
      const position = await getCurrentPosition();
      store.setCoordinates(position);
    } catch (err) {
      alert('לא הצלחנו לאתר את המיקום.\nניתן להזין את המיקום ידנית :)');
    }
  };

  const resetModal = () => {
    setAddressInputDisplay(false);
    setManualAddress(null);
  };

  useEffect(() => {
    // Timeout needed to allow the rendering finish before setting the focus
    const timeout = setTimeout(() => {
      if (addressInputDisplay && addressInputRef.current) {
        addressInputRef.current.focus();
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, [addressInputDisplay]);

  return (
    <>
      <Button
        onClick={() => {
          getUserPosition();
          resetModal();
        }}
        icon="/icons/gps.svg"
        style={{ marginBottom: 10 }}
      >
        מציאת הפגנות באיזורי
      </Button>
      <>
        {!addressInputDisplay && (
          <Button
            onClick={() => {
              setAddressInputDisplay(true);
            }}
            color="radial-gradient(100.6% 793.82% at 9.54% -0.6%,#00ace4 0%,#02779e 100%)"
          >
            הזנת מיקום ידנית
          </Button>
        )}
        {addressInputDisplay && (
          <>
            <PlacesAutocomplete setManualAddress={setManualAddress} inputRef={addressInputRef} />{' '}
            <Button
              disabled={!manualAddress}
              onClick={() => {
                store.setCoordinates(manualAddress);
                resetModal();
              }}
              color="radial-gradient(100.6% 793.82% at 9.54% -0.6%,#00ace4 0%,#02779e 100%)"
            >
              הצגת הפגנות
            </Button>
          </>
        )}
      </>
    </>
  );
}

export default LocationButtons;
