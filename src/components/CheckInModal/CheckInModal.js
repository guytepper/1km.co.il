import React, { useState, useEffect, useRef } from 'react';
import { Modal, LocationButtons } from '../';
import { getLocalStorage } from '../../localStorage';

const steps = {
  LOADING: 'loading',
  PICK_LOCATION: 'pickLocation',
  PICK_PROTEST: 'pickProtest',
  SIGN_IN: 'signIn',
  CHECK_IN_FORM: 'checkInForm',
  CHECK_IN_FINISHED: 'checkInFinished',
};

function CheckInModal({ setCoordinates, closeProtests }) {
  const [currentStep, setCurrentStep] = useState(steps.LOADING);

  useEffect(() => {
    if (closeProtests.length > 0) {
      // If closed protests are available, skip to pick protest step.
      setCurrentStep(steps.PICK_PROTEST);
    } else if (!getLocalStorage('1km_user_coordinates')) {
      // In case there are no cached coordinates, change to pick location step.
      setCurrentStep(steps.PICK_LOCATION);
    }
  }, [closeProtests]);

  const renderStep = () => {
    switch (currentStep) {
      case steps.LOADING:
        return (
          <>
            <p>טוען...</p>
            <img src="/icons/loading-spinner.svg" alt="" />
          </>
        );
      case steps.PICK_LOCATION:
        return <LocationButtons setCoordinates={setCoordinates} />;
      case steps.PICK_PROTEST:
        return 'pick protest';

      default:
        return 'test';
    }
  };

  return (
    <Modal isOpen={true}>
      <h2>צ'ק אין</h2>

      {renderStep()}
    </Modal>
  );
}

export default CheckInModal;
