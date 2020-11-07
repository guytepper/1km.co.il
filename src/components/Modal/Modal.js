import React from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components/macro';

ReactModal.setAppElement('#root');

function Modal(props) {
  return (
    <ModalWrapper isOpen={props.isOpen}>
      <ModalContentWrapper>{props.children}</ModalContentWrapper>
    </ModalWrapper>
  );
}

const ModalWrapper = styled(ReactModal)`
  position: fixed;
  display: inline-block;
  height: 100vh;
  width: 100%;
  padding: 20px 25px;
  overflow-y: auto;
  border: 1px solid #d2d2d2;
  background-color: #fff;
  z-index: 20;

  @media (min-width: 360px) {
    width: initial;
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

Modal.ContentImage = styled.img`
  width: 200px;
  height: 142px;

  @media (min-width: 375px) {
    width: 250px;
    height: 176.7px;
  }
`;

Modal.ButtonsWrapper = styled.div`
  max-width: 280px;

  @media (min-width: 400px) {
    max-width: 300px;
  }
`;

export default Modal;
