import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Button, PageWrapper, PageContentWrapper, PageParagraph } from '../components';
import { extractUserData, getUserFromRedirect, handleSignIn, saveUserInFirestore } from '../api';

import queryString from 'query-string';

function SignUpBeforeRedirect({ returnUrl }) {
  return (
    <PageContentWrapper>
      {returnUrl === '/add-protest' ? (
        <>
          <p style={{ marginBottom: 10 }}>על מנת ליצור הפגנה יש להזדהות דרך פייסבוק. </p>
          <p style={{ marginTop: 0 }}>ניתן ליצור הפגנה ללא הזדהות, אך היא תתווסף למפה לאחר אישור הנהלת האתר. </p>
        </>
      ) : (
        <p>היי! כדי ליצור או לערוך הפגנה ולקחת חלק בפעילות האתר יש להתחבר באמצעות פייסבוק.</p>
      )}

      <Button onClick={() => handleSignIn()} style={{ marginBottom: 10 }}>
        התחברות דרך פייסבוק
      </Button>
      {returnUrl === '/add-protest' && (
        <Link to="/add-protest">
          <>
            <Button
              style={{
                background:
                  'radial-gradient(100.6% 793.82% at 9.54% -0.6%, rgb(166, 145, 145) 0%, rgb(119, 95, 95) 100%) repeat scroll 0% 0%',
              }}
            >
              יצירת הפגנה אנונימית
            </Button>
          </>
        </Link>
      )}
    </PageContentWrapper>
  );
}

function getReturnUrl(path) {
  return queryString.parse(path).returnUrl;
}

const stages = {
  UNKNOWN: 'unkonwn',
  BEFORE_FACEBOOK_AUTH: 'beforeFacebookAuth',
  AFTER_FACEBOOK_AUTH: 'afterFacebookAuth',
};

export default function SignUp(props) {
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
        setStage(stages.AFTER_FACEBOOK_AUTH);

        saveUserInFirestore(userData).then(() => {
          const returnUrl = getReturnUrl(window.location.search);

          if (returnUrl) {
            history.push(returnUrl);
          } else {
            // Redirect to homepage.
            setTimeout(() => {
              history.push('/');
            }, 2020);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
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
        <SignUpBeforeRedirect returnUrl={getReturnUrl(window.location.search)} />
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
