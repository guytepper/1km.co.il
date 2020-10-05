import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import Button from '../Button';
import { getCurrentPosition } from '../../utils';
import PlacesAutocomplete from '../PlacesAutocomplete';
import i18n from 'i18n-js';

ReactModal.setAppElement('#root');

function Modal({ isOpen, setIsOpen, coordinates, setCoordinates }) {
  const [addressInputDisplay, setAdressInputDisplay] = useState(false);
  const [manualAdress, setManualAdress] = useState(null);

  const getUserPosition = async () => {
    try {
      const position = await getCurrentPosition();
      setCoordinates(position);
    } catch (err) {
      alert('לא הצלחנו לאתר את המיקום.\nניתן להזין את המיקום ידנית :)');
    }
  };

  useEffect(() => {
    if (coordinates.length === 2) {
      setIsOpen(false);
    }
  }, [coordinates]);

  return (
    <ModalWrapper isOpen={isOpen}>
      <ModalContentWrapper>
        <h2 style={{ marginBottom: 0 }}>{i18n.t('modal.title')}</h2>
        <h3 style={{ fontWeight: 400 }}>
          {i18n.t('modal.subTitle1')}
          <br />
          <br />
          {i18n.t('modal.subTitle2')}
        </h3>
        <div style={{ maxWidth: 300 }}>
          <Button onClick={() => getUserPosition()} icon="/icons/gps.svg" style={{ marginBottom: 10 }}>
            {i18n.t('modal.findProtestsInMyArea')}
          </Button>

          {!addressInputDisplay && (
            <Button onClick={() => setAdressInputDisplay(true)} color="#0096c7">
              {i18n.t("modal.manuallyEnterLocation")}
            </Button>
          )}
          {addressInputDisplay && (
            <>
              <PlacesAutocomplete setManualAdress={setManualAdress} />{' '}
              <Button disabled={!manualAdress} onClick={() => setCoordinates(manualAdress)} color="#0096c7">
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
  top: 50px;
  left: 25px;
  right: 25px;
  bottom: 50px;
  border: 1px solid #d2d2d2;
  background-color: #fff;
  padding: 10px 25px;
  z-index: 2;

  @media (min-width: 768px) {
    top: 75px;
    left: 100px;
    right: 100px;
    bottom: 75px;
  }

  @media (min-width: 1280px) {
    top: 100px;
    left: 250px;
    right: 250px;
    bottom: 250px;
  }

  @media (min-width: 1440px) {
    top: 100px;
    left: 500px;
    right: 500px;
    bottom: 250px;
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
