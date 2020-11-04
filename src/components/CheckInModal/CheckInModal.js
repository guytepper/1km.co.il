import React, { useState, useEffect } from 'react';
import { Modal, LocationButtons, LoadingSpinner } from '../';
import SignUp from '../SignUp/SignUpV2';
import { useHistory } from 'react-router-dom';
import { ProtestListSelection, CheckInForm } from './';
import { getLocalStorage } from '../../localStorage';
import { createCheckIn, updateUserName } from './CheckInService';

const steps = {
  LOADING: 'loading',
  PICK_LOCATION: 'pickLocation',
  PICK_PROTEST: 'pickProtest',
  SIGN_IN: 'signIn',
  CHECK_IN_FORM: 'checkInForm',
  CHECK_IN_FINISHED: 'checkInFinished',
};

function CheckInModal({ currentProtest, setProtest, setCoordinates, setCheckedIn, closeProtests, setModalOpen, user }) {
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(steps.PICK_LOCATION);

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
    if (user?.uid && currentProtest) {
      setCurrentStep(steps.CHECK_IN_FORM);
      history.push('/live/check-in/form');
    } else if (!currentProtest) {
      setCurrentStep(steps.PICK_LOCATION);
      history.push('/live/check-in/select-protest');
    } else {
      setCurrentStep(steps.SIGN_IN);
      history.push('/live/check-in/auth');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProtest, user]);

  useEffect(() => {
    const { pathname } = history.location;
    if (pathname === '/live/check-in/auth') {
      if (!currentProtest) {
        setCurrentStep(steps.PICK_LOCATION);
        history.push('/live/check-in/select-protest');
      }

      if (user?.uid) {
        setCurrentStep(steps.CHECK_IN_FORM);
      }

      if (currentStep !== steps.SIGN_IN) {
        setCurrentStep(steps.SIGN_IN);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, user]);

  const onCheckIn = async ({ firstName, lastName = '', userMessage = '' }) => {
    try {
      const protestInfo = {
        protestId: currentProtest.id,
        protestDisplayName: currentProtest.displayName,
        protestStreetAddress: currentProtest.streetAddress,
        protestCityName: currentProtest.cityName || '',
      };

      await createCheckIn({
        ...protestInfo,
        firstName,
        lastName,
        userMessage,
        picture_url: user?.picture_url || '',
      });

      if (user?.uid) {
        await updateUserName({ userId: user.uid, firstName, lastName });
      }

      alert("צ'ק אין בוצע בהצלחה!");
      history.push('/live');
      setModalOpen(false);
      setCheckedIn(true);
    } catch (err) {
      console.error(err);
    }
  };

  const onAuth = () => {
    setCurrentStep(steps.CHECK_IN_FORM);
  };

  const renderStep = () => {
    switch (currentStep) {
      case steps.LOADING:
        return (
          <>
            <p>טוען...</p>
            <LoadingSpinner />
          </>
        );
      case steps.PICK_LOCATION:
        return (
          <>
            <p>עשו Check In להפגנה כדי להראות כמה כח יש לנו יחד.</p>
            <LocationButtons setCoordinates={setCoordinates} />
          </>
        );
      case steps.PICK_PROTEST:
        return <ProtestListSelection protests={closeProtests} setProtest={setProtest} setCurrentStep={setCurrentStep} />;
      case steps.SIGN_IN:
        return <SignUp onAuth={onAuth} onAnnonymousClick={() => setCurrentStep(steps.CHECK_IN_FORM)} />;
      case steps.CHECK_IN_FORM:
        return <CheckInForm onCheckIn={onCheckIn} />;
      default:
        return 'test';
    }
  };

  return (
    <Modal isOpen={true}>
      <h2 style={{ marginBottom: 5 }}>ביחד ננצח!</h2>

      {renderStep()}
    </Modal>
  );
}

export default CheckInModal;
