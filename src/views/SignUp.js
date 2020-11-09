import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useStore } from '../stores';
import { Button, PageWrapper, PageContentWrapper, LoadingSpinner } from '../components';
import { Modal, Button as AntButton, Form, Input, Typography } from 'antd';
import { extractUserData, getUserFromRedirect, handleSignIn, saveUserInFirestore, updateUserName } from '../api';
import styled from 'styled-components/macro';
import queryString from 'query-string';
import Helmet from 'react-helmet';

const { Title } = Typography;

function SignUpBeforeRedirect({ returnUrl }) {
  return (
    <PageContentWrapper>
      <Helmet>
        <title>הרשמה</title>
      </Helmet>
      {returnUrl === '/add-protest' ? (
        <>
          <p style={{ marginBottom: 10 }}>על מנת ליצור הפגנה יש להזדהות דרך פייסבוק. </p>
          <p style={{ marginTop: 0 }}>ניתן ליצור הפגנה ללא הזדהות, אך היא תתווסף למפה לאחר אישור הנהלת האתר. </p>
        </>
      ) : (
        <div>
          <p>היי! כדי לקחת חלק בפעילות האתר יש להתחבר באמצעות פייסבוק.</p>
          <p>תוכלו לשמור על אנונימיות לאחר ההרשמה.</p>
        </div>
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

let userId = '';
let pictureUrl = '';

export default function SignUp(props) {
  const [stage, setStage] = useState(stages.UNKNOWN);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const history = useHistory();
  const store = useStore();

  const redirectToReturnURL = () => {
    const { returnUrl } = queryString.parse(window.location.search);
    if (returnUrl) {
      history.push(returnUrl);
    } else {
      history.push('/');
    }
  };

  const onSignUpSubmit = async () => {
    store.userStore.setUserName(firstName, lastName);
    store.userStore.setUserPicture(pictureUrl);
    await updateUserName({ userId, firstName, lastName });

    Modal.success({
      title: 'נרשמת בהצלחה!',
      okText: 'המשך',
      onOk: () => {
        redirectToReturnURL();
      },
    });
  };

  useEffect(() => {
    getUserFromRedirect()
      .then((result) => {
        if (!result) {
          setStage(stages.BEFORE_FACEBOOK_AUTH);
          return;
        }

        if (!result.additionalUserInfo.isNewUser) {
          redirectToReturnURL();
          return;
        }

        const userData = extractUserData(result);

        saveUserInFirestore(userData).then((userDoc) => {
          setStage(stages.AFTER_FACEBOOK_AUTH);
          userId = userDoc.uid;
          pictureUrl = userDoc.pictureUrl;
        });
      })
      .catch((error) => {
        console.log(error);
      });

    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.pathname]);

  if (stage === stages.UNKNOWN) {
    return (
      <PageWrapper>
        <p style={{ marginTop: 25 }}>רק כמה שניות...</p>
        <LoadingSpinner />
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
        <Helmet>
          <title>סיום הרשמה</title>
        </Helmet>

        <PageContentWrapper>
          <Title level={3}>התחברת בהצלחה!</Title>
          <p style={{ fontSize: 16 }}>יש להזין את שמכם על מנת לסיים את ההרשמה.</p>
          <SignUpFormItem label="שם פרטי / כינוי" required style={{ flexDirection: 'column', marginBottom: 10 }}>
            <Input autoFocus value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </SignUpFormItem>
          <SignUpFormItem label="שם משפחה " style={{ flexDirection: 'column' }}>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </SignUpFormItem>
          <SignUpFormItem>
            <AntButton
              disabled={firstName.length < 2}
              className="bg-success"
              type="primary"
              size="large"
              style={{ width: 300 }}
              onClick={() => onSignUpSubmit()}
            >
              סיום הרשמה
            </AntButton>
          </SignUpFormItem>
        </PageContentWrapper>
      </PageWrapper>
    );
  }
}

const SignUpFormItem = styled(Form.Item)`
  min-width: 100%;
  max-width: 290px;
`;
