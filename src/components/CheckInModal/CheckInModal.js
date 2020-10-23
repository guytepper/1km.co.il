import React, { useState, useEffect, useRef } from 'react';
import { Modal, LocationButtons } from '../';
import SignUp from '../SignUp/SignUpV2';
import { useHistory } from 'react-router-dom';
import { ProtestListSelection, CheckInForm } from './';
import { getLocalStorage, setLocalStorage } from '../../localStorage';
import { createCheckIn, updateUserName } from './CheckInService';

const steps = {
  LOADING: 'loading',
  PICK_LOCATION: 'pickLocation',
  PICK_PROTEST: 'pickProtest',
  SIGN_IN: 'signIn',
  CHECK_IN_FORM: 'checkInForm',
  CHECK_IN_FINISHED: 'checkInFinished',
};

function CheckInModal({ setCoordinates, closeProtests, user, loading }) {
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(steps.PICK_LOCATION);
  const [currentProtest, setProtest] = useState(null);

  useEffect(() => {
    if (loading === true) {
      setCurrentStep(steps.LOADING);
    }
  }, [loading]);

  useEffect(() => {
    if (closeProtests.length > 0) {
      // If closed protests are available, skip to pick protest step.
      setCurrentStep(steps.PICK_PROTEST);
    } else if (!getLocalStorage('1km_user_coordinates')) {
      // In case there are no cached coordinates, change to pick location step.
      setCurrentStep(steps.PICK_LOCATION);
    }
  }, [closeProtests]);

  useEffect(() => {
    // Check if exists in localStorage
    const cachedProtest = getLocalStorage('check_in_selected_protest');

    if (currentProtest) {
      if (cachedProtest?.id !== currentProtest.id) {
        setLocalStorage('check_in_selected_protest', currentProtest);
      }
      if (user?.uid) {
        setCurrentStep(steps.CHECK_IN_FORM);
        history.push('/check-in/form');
      } else {
        setCurrentStep(steps.SIGN_IN);
        history.push('/check-in/auth');
      }
    } else {
      if (cachedProtest) setProtest(cachedProtest);
    }
  }, [currentProtest]);

  useEffect(() => {
    const { pathname } = history.location;
    if (pathname === '/check-in/auth') {
      if (!currentProtest) {
        setCurrentStep(steps.PICK_LOCATION);
        history.push('/check-in/select-protest');
      }
      if (user?.uid) {
        setCurrentStep(steps.CHECK_IN_FORM);
        history.push('/check-in/form');
        return;
      }
      if (currentStep !== steps.SIGN_IN) {
        setCurrentStep(steps.SIGN_IN);
      }
    }
  }, [history, user]);

  const onCheckIn = async ({ firstName, lastName = '', userMessage = '' }) => {
    try {
      const protestInfo = {
        protestId: currentProtest.id,
        protestDisplayName: currentProtest.displayName,
        protestStreetAddress: currentProtest.streetAddress,
      };

      const checkIn = await createCheckIn({
        firstName,
        lastName,
        userMessage,
        picture_url: user?.picture_url,
        ...protestInfo,
      });

      if (user?.uid) {
        await updateUserName({ userId: user.uid, firstName, lastName });
      }
    } catch (err) {
      console.error(err);
    }
  };

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
        return <ProtestListSelection protests={closeProtests} setProtest={setProtest} setCurrentStep={setCurrentStep} />;
      case steps.SIGN_IN:
        return <SignUp onAnnonymousClick={() => setCurrentStep(steps.CHECK_IN_FORM)} />;
      case steps.CHECK_IN_FORM:
        return <CheckInForm onCheckIn={onCheckIn} />;
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
