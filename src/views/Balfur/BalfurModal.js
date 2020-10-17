import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { Button } from '../../components';
import { FormLabel, TextInput } from '../../components/FormElements';
import { extractUserData, getUserFromRedirect, handleSignIn, saveUserInFirestore } from '../../api';
import { isVisitor } from '../../utils';
import firebase, { realtimeDB } from '../../firebase';

const balfurCheckIn = ({ profilePic, firstName, userMessage }) => {
  const checkIn = realtimeDB.ref('balfur_check_ins').push();
  checkIn.set({ profilePic, firstName, userMessage, createdAt: firebase.database.ServerValue.TIMESTAMP });
};

const stages = {
  UNKNOWN: 'unkonwn',
  BEFORE_FACEBOOK_AUTH: 'beforeFacebookAuth',
  AFTER_FACEBOOK_AUTH: 'afterFacebookAuth',
};

export default function BalfurModal({ user }) {
  const [stage, setStage] = useState(stages.UNKNOWN);
  const [firstName, setFirstName] = useState('');
  const [userMessage, setUserMessage] = useState('');
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
          setFirstName(userData.first_name);
          console.log(userData);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [history]);

  useEffect(() => {
    if (user?.first_name) {
      setFirstName(user.first_name);
    }
  }, [user]);

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
            השם הפרטי (מומלץ לשנות לעברית!)
            <TextInput onChange={(e) => setFirstName(e.target.value)} value={firstName} />
          </FormLabel>
          <FormLabel>
            מסר לאומה
            <TextInput onChange={(e) => setUserMessage(e.target.value)} value={userMessage} />
          </FormLabel>
          <Button onClick={() => balfurCheckIn({ userMessage, profilePic: user.picture_url, firstName })}>צ'ק אין</Button>
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
