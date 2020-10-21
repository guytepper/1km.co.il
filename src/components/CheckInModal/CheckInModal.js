import React, { useState, useEffect, useRef } from 'react';
import { Modal, LocationButtons } from '../';

const steps = {
  PICK_LOCATION: 'pickLocation',
  PICK_PROTEST: 'pickProtest',
  SIGN_IN: 'signIn',
  CHECK_IN_FORM: 'checkInForm',
  CHECK_IN_FINISHED: 'checkInFinished',
};

function CheckInModal({ coordinates, setCoordinates, closeProtests }) {
  const didMountRef = useRef(false);
  const [currentStep, setCurrentStep] = useState(steps.PICK_LOCATION);

  // TODO: Display loadin if app is in loading state
  useEffect(() => {
    if (closeProtests.length > 0) {
      setCurrentStep(steps.PICK_PROTEST);
    }
  }, [closeProtests]);

  const renderStep = () => {
    switch (currentStep) {
      case steps.PICK_LOCATION:
        return <LocationButtons setCoordinates={setCoordinates} />;
      case steps.PICK_PROTEST:
        return <LocationButtons setCoordinates={setCoordinates} />;

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
