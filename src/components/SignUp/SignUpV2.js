import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, PageParagraph, LoadingSpinner } from '../';
import { extractUserData, getUserFromRedirect, handleSignIn, saveUserInFirestore } from '../../api';

function SignUpBeforeRedirect({ returnUrl, onAnnonymousClick }) {
  return (
    <>
      <Button onClick={() => handleSignIn()} style={{ marginBottom: 10 }}>
        צ'ק-אין עם תמונת פייסבוק
      </Button>
      <Button onClick={() => onAnnonymousClick()} color="grey">
        צ'ק-אין אנונימי
      </Button>
    </>
  );
}

const stages = {
  UNKNOWN: 'unkonwn',
  BEFORE_FACEBOOK_AUTH: 'beforeFacebookAuth',
  AFTER_FACEBOOK_AUTH: 'afterFacebookAuth',
};

export default function SignUp({ onAuth, onAnnonymousClick }) {
  const [stage, setStage] = useState(stages.UNKNOWN);
  const history = useHistory();

  useEffect(() => {
    getUserFromRedirect()
      .then((result) => {
        if (!result) {
          setStage(stages.BEFORE_FACEBOOK_AUTH);
          return;
        }

        const userData = extractUserData(result);
        // Next line is commented since the parent currently updates the state based on the App.js user state
        // setStage(stages.AFTER_FACEBOOK_AUTH);

        saveUserInFirestore(userData).then(() => {
          console.log('Authed successfuly.');
          onAuth();
        });
      })
      .catch((error) => {
        console.log(error);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  if (stage === stages.UNKNOWN) {
    return (
      <>
        <p>רק כמה שניות...</p>
        <LoadingSpinner />
      </>
    );
  }

  if (stage === stages.BEFORE_FACEBOOK_AUTH) {
    return <SignUpBeforeRedirect onAnnonymousClick={onAnnonymousClick} />;
  }

  if (stage === stages.AFTER_FACEBOOK_AUTH) {
    return <PageParagraph>התחברת בהצלחה.</PageParagraph>;
  }
}
