import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, PageWrapper, PageContentWrapper, PageParagraph } from '../';
import { extractUserData, getUserFromRedirect, handleSignIn, saveUserInFirestore } from '../../api';

function SignUpBeforeRedirect({ returnUrl }) {
  return (
    <PageContentWrapper>
      <Button onClick={() => handleSignIn()} style={{ marginBottom: 10 }}>
        צ'ק-אין עם תמונת פייסבוק
      </Button>
      <Button
        style={{
          background:
            'radial-gradient(100.6% 793.82% at 9.54% -0.6%, rgb(166, 145, 145) 0%, rgb(119, 95, 95) 100%) repeat scroll 0% 0%',
        }}
      >
        צ'ק-אין אנונימי
      </Button>
    </PageContentWrapper>
  );
}

const stages = {
  UNKNOWN: 'unkonwn',
  BEFORE_FACEBOOK_AUTH: 'beforeFacebookAuth',
  AFTER_FACEBOOK_AUTH: 'afterFacebookAuth',
};

export default function SignUp({ onAuth }) {
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
          // setTimeout(() => {
          //   onAuth();
          // }, 2020);
        });
      })
      .catch((error) => {
        console.log(error);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  if (stage === stages.UNKNOWN) {
    return (
      <PageWrapper>
        <p>רק כמה שניות...</p>
        <img src="/icons/loading-spinner.svg" alt="" />
      </PageWrapper>
    );
  }

  if (stage === stages.BEFORE_FACEBOOK_AUTH) {
    return (
      <PageWrapper>
        <SignUpBeforeRedirect />
      </PageWrapper>
    );
  }

  if (stage === stages.AFTER_FACEBOOK_AUTH) {
    return (
      <PageWrapper>
        <PageContentWrapper>
          <PageParagraph>התחברת בהצלחה.</PageParagraph>
        </PageContentWrapper>
      </PageWrapper>
    );
  }
}
