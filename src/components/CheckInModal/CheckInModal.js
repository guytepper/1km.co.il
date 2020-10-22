import React, { useState, useEffect, useRef } from 'react';
import { Modal, LocationButtons } from '../';
import SignUp from '../SignUp/SignUpV2';
import { useHistory } from 'react-router-dom';
import { ProtestListSelection, CheckInForm } from './';
import { getLocalStorage } from '../../localStorage';

const steps = {
  LOADING: 'loading',
  PICK_LOCATION: 'pickLocation',
  PICK_PROTEST: 'pickProtest',
  SIGN_IN: 'signIn',
  CHECK_IN_FORM: 'checkInForm',
  CHECK_IN_FINISHED: 'checkInFinished',
};

function CheckInModal({ setCoordinates, closeProtests, user }) {
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(steps.PICK_PROTEST);
  const [currentProtest, setProtest] = useState(null);

  useEffect(() => {
    if (closeProtests.length > 0) {
      // If closed protests are available, skip to pick protest step.
      setCurrentStep(steps.PICK_PROTEST);
    } else if (!getLocalStorage('1km_user_coordinates')) {
      // In case there are no cached coordinates, change to pick location step.
      setCurrentStep(steps.PICK_PROTEST);
    }
  }, [closeProtests]);

  useEffect(() => {
    if (currentProtest) {
      if (user?.uid) {
        setCurrentStep(steps.CHECK_IN_FORM);
        history.push('/check-in/form');
      } else {
        setCurrentStep(steps.SIGN_IN);
        history.push('/check-in/auth');
      }
    }
  }, [currentProtest]);

  useEffect(() => {
    const { pathname } = history.location;
    if (pathname === '/check-in/auth') {
      if (user?.uid) {
        setCurrentStep(steps.CHECK_IN_FORM);
        history.push('/check-in/form');
      }
      if (currentStep !== steps.SIGN_IN) {
        setCurrentStep(steps.SIGN_IN);
      }
    }
  }, [history, user]);

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
        return <ProtestListSelection protests={closeProtests} setProtest={setProtest} />;
      case steps.SIGN_IN:
        return <SignUp />;
      case steps.CHECK_IN_FORM:
        return <CheckInForm user={user} />;
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
