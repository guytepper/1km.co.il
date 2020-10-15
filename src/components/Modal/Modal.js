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

  return (
    <ModalWrapper isOpen={isOpen}>
      <ModalContentWrapper>
        <picture>
          <source
            type="image/webp"
            srcSet="/illustrations/welcome-illustration@2x.webp 1x, /illustrations/welcome-illustration@2x.webp 2x, /illustrations/welcome-illustration@3x.webp 3x"
          />
          <source srcSet="/illustrations/welcome-illustration@1x.png 1x, /illustrations/welcome-illustration@2x.png 2x, /illustrations/welcome-illustration@3x.png 3x" />
          <ModalContentImage src="/welcome-illustration@1x.jpg" alt="" />
        </picture>

        <h2 style={{ marginBottom: 0 }}>גם אלף מטרים לא יעצרו אותנו.</h2>
        <h3 style={{ fontWeight: 400, maxWidth: 355 }}>
          חפשו הפגנה ברדיוס הקרוב אליכן, הצטרפו לקבוצת וואטסאפ וצאו לרחובות. <br />
          <br />
          לא מצאנו? צרו הפגנה חדשה! אנחנו נחבר בינך לבין פעילים ופעילות בסביבה.
        </h3>
        <ModalButtonsWrapper>
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
        </ModalButtonsWrapper>
      </ModalContentWrapper>
    </ModalWrapper>
  );
}

const ModalWrapper = styled(ReactModal)`
  z-index: 20;
  position: fixed;
  display: inline-block;
  padding: 20px 25px;
  height: 100vh;
  overflow-y: auto;
  border: 1px solid #d2d2d2;
  background-color: #fff;

  @media (min-width: 360px) {
    top: 30px;
    left: 7.5vw;
    right: 7.5vw;
    bottom: 7.5vw;
    max-height: calc(100vh - 10vh);
  }

  @media (min-width: 768px) {
    top: 75px;
    left: 21vw;
    right: 21vw;
    max-height: 550px;
  }

  @media (min-width: 1280px) {
    left: 30vw;
    right: 30vw;
  }

  @media (min-width: 1440px) {
    top: 100px;
    left: 35vw;
    right: 35vw;
  }

  /** Make the modal higher on short screens **/
  @media (max-height: 700px) and (min-width: 1024px) {
    top: 30px;
  }

  /*** Scrollbar ***/
  scrollbar-color: #5f6ffa #dde0ff;
  scrollbar-width: thin;

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: #dde0ff;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: #5f6ffa;
    border-radius: 10px;
  }
`;

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const ModalContentImage = styled.img`
  width: 200px;
  height: 142px;

  @media (min-width: 375px) {
    width: 250px;
    height: 176.7px;
  }
`;

const ModalButtonsWrapper = styled.div`
  max-width: 280px;

  @media (min-width: 400px) {
    max-width: 300px;
  }
`;

export default Modal;
