import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import Button from '../Button';

ReactModal.setAppElement('#root');

const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (event) => {
        resolve([event.coords.latitude, event.coords.longitude]);
      },
      (error) => {
        reject(error);
      }
    );
  });
};

function Modal({ isOpen, setIsOpen, coordinates, setCoordinates }) {
  const getUserPosition = async () => {
    try {
      const position = await getCurrentPosition();
      setCoordinates(position);
    } catch (err) {
      // TODO: Handle error
    }
  };

  useEffect(() => {
    if (coordinates.length === 2) {
      setIsOpen(false);
    }
  }, [coordinates, setIsOpen]);

  return (
    <ModalWrapper
      isOpen={isOpen}
      // onAfterOpen={afterOpenModal}
      // onRequestClose={closeModal}
      // style={customStyles}
    >
      <ModalContentWrapper>
        <h2 style={{ marginBottom: 0 }}>גם אלף מטרים לא יעצרו אותנו.</h2>
        <h3 style={{ fontWeight: 400 }}>
          חפשו הפגנה ברדיוס הקרוב אליכן, הצטרפו לקבוצת הטלגרם/וואטסאפ וצאו לרחובות. <br />
          <br />
          לא מצאנו? צרו הפגנה חדשה! אנחנו נחבר בינך לבין פעילים ופעילות בסביבה.
        </h3>
        <Button onClick={() => getUserPosition()} icon="/icons/gps.svg">
          מציאת הפגנות באיזורי
        </Button>
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
