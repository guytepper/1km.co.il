import React, { useState, useEffect, useRef } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components/macro';
import Button from '../Button';
import { getCurrentPosition } from '../../utils';
import PlacesAutocomplete from '../PlacesAutocomplete';

ReactModal.setAppElement('#root');

function Modal({ isOpen, setIsOpen, coordinates, setCoordinates }) {
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

  const [ImageLoaded, setImageLoaded] = useState(false);
  return (
    <ModalWrapper isOpen={isOpen}>
      <ModalContentWrapper>
        {/* image "thumbnail" lower resolution image until the high resolution one loaded"*/}
        <img
          src="welcome-illustration-lowres.webp"
          style={{ width: 250, display: ImageLoaded ? 'none' : '' }}
          alt="אילוסטרציה של הפגנה"
        />
        <img
          src="welcome-illustration.svg"
          onLoad={() => {
            setImageLoaded(true);
          }}
          style={{ maxWidth: 250, display: ImageLoaded ? '' : 'none' }}
          alt="אילוסטרציה של הפגנה"
        />

        <h2 style={{ marginBottom: 0 }}>גם אלף מטרים לא יעצרו אותנו.</h2>
        <h3 style={{ fontWeight: 400 }}>
          חפשו הפגנה ברדיוס הקרוב אליכן, הצטרפו לקבוצת הטלגרם/וואטסאפ וצאו לרחובות. <br />
          <br />
          לא מצאנו? צרו הפגנה חדשה! אנחנו נחבר בינך לבין פעילים ופעילות בסביבה.
        </h3>
        <div style={{ maxWidth: 300 }}>
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
        </div>
      </ModalContentWrapper>
    </ModalWrapper>
  );
}

const ModalWrapper = styled(ReactModal)`
  position: fixed;
  display: inline-block;
  top: 70px;
  left: 25px;
  right: 25px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  border: 1px solid #d2d2d2;
  background-color: #fff;
  padding: 10px 25px;
  z-index: 2;

  @media (min-width: 768px) {
    top: 75px;
    left: 100px;
    right: 100px;
  }

  @media (min-width: 1280px) {
    top: 75px;
    left: 250px;
    right: 250px;
  }

  @media (min-width: 1440px) {
    top: 100px;
    left: 500px;
    right: 500px;
  }
`;

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export default Modal;
