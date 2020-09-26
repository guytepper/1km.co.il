import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

function Modal({ isOpen, setIsOpen }) {
  return (
    <ReactModal
      isOpen={isOpen}
      // onAfterOpen={afterOpenModal}
      // onRequestClose={closeModal}
      // style={customStyles}
      contentLabel="Example Modal"
    >
      <button onClick={() => setIsOpen(false)}>close</button>
      <div>I am a modal</div>
      <form>
        <input />
        <button>tab navigation</button>
        <button>stays</button>
        <button>inside</button>
        <button>the modal</button>
      </form>
    </ReactModal>
  );
}

export default Modal;
