import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { Button } from '../../components';
import { FormLabel, TextInput } from '../../components/FormElements';
import { extractUserData, getUserFromRedirect, handleSignIn, saveUserInFirestore } from '../../api';
import { isVisitor } from '../../utils';

const stages = {
  UNKNOWN: 'unkonwn',
  BEFORE_FACEBOOK_AUTH: 'beforeFacebookAuth',
  AFTER_FACEBOOK_AUTH: 'afterFacebookAuth',
};

export default function BalfurModal({ user }) {
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

        saveUserInFirestore(userData).then(() => {
          setStage(stages.AFTER_FACEBOOK_AUTH);
          console.log(userData);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [history]);

  if (stage === stages.UNKNOWN) {
    return (
      <BalfurModalWrapper>
        <BalfurModalContent>
          <p>רק כמה שניות...</p>
          <img src="/icons/loading-spinner.svg" alt="" />
        </BalfurModalContent>
      </BalfurModalWrapper>
    );
  }

  if (stage === stages.BEFORE_FACEBOOK_AUTH && isVisitor(user)) {
    return (
      <BalfurModalWrapper>
        <BalfurModalContent>
          <Button onClick={() => handleSignIn()}>התחברות דרך פייסבוק</Button>
        </BalfurModalContent>
      </BalfurModalWrapper>
    );
  }

  if (stage === stages.AFTER_FACEBOOK_AUTH || !isVisitor(user)) {
    return (
      <BalfurModalWrapper>
        <BalfurModalContent>
          <h2>תודה!</h2>
          <p> כבר תוספו לרשימת המפגינים.</p>
          <p>תרצו להוסיף מסר לעולם?</p>
          <br />
          <FormLabel>
            טקסט חופשי
            <TextInput />
          </FormLabel>
          <Button>צ'ק אין</Button>
        </BalfurModalContent>
      </BalfurModalWrapper>
    );
  }
}

const BalfurModalWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100%;
  background-color: #ffffffed;
  z-index: 10;
`;

const BalfurModalContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 280px;
  margin: 0 auto;
`;
