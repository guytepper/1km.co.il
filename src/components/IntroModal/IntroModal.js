import React, { useState, useEffect, useRef } from 'react';
import Modal from '../Modal';
import { PlacesAutocomplete, Button } from '../';
import { getCurrentPosition } from '../../utils';

export default function IntroModal({ isOpen, setIsOpen, coordinates, setCoordinates }) {
  const [addressInputDisplay, setAddressInputDisplay] = useState(false);
  const [manualAddress, setManualAddress] = useState(null);
  const addressInputRef = useRef();

  const getUserPosition = async () => {
    try {
      const position = await getCurrentPosition();
      setCoordinates(position);
    } catch (err) {
      alert('לא הצלחנו לאתר את המיקום.\nניתן להזין את המיקום ידנית :)');
    }
  };

  const resetModal = () => {
    setAddressInputDisplay(false);
    setManualAddress(null);
  };

  useEffect(() => {
    if (coordinates.length === 2) {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates]);

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
    <Modal isOpen={isOpen}>
      <picture>
        <source
          type="image/webp"
          srcSet="/illustrations/welcome-illustration@2x.webp 1x, /illustrations/welcome-illustration@2x.webp 2x, /illustrations/welcome-illustration@3x.webp 3x"
        />
        <source srcSet="/illustrations/welcome-illustration@1x.png 1x, /illustrations/welcome-illustration@2x.jpg 2x, /illustrations/welcome-illustration@3x.jpg 3x" />
        <Modal.ContentImage src="/welcome-illustration@1x.jpg" alt="" />
      </picture>

      <h2 style={{ marginBottom: 0 }}>גם אלף מטרים לא יעצרו אותנו.</h2>
      <h3 style={{ fontWeight: 400, maxWidth: 355 }}>
        חפשו הפגנה ברדיוס הקרוב אליכן, הצטרפו לקבוצת וואטסאפ וצאו לרחובות. <br />
        <br />
        לא מצאנו? צרו הפגנה חדשה! אנחנו נחבר בינך לבין פעילים ופעילות בסביבה.
      </h3>
      <Modal.ButtonsWrapper>
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
                setCoordinates(manualAddress);
                resetModal();
              }}
              color="radial-gradient(100.6% 793.82% at 9.54% -0.6%,#00ace4 0%,#02779e 100%)"
            >
              הצגת הפגנות
            </Button>
          </>
        )}
      </Modal.ButtonsWrapper>
    </Modal>
  );
}
