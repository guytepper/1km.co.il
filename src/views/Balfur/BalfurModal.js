import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useHistory } from 'react-router-dom';
import ReactModal from 'react-modal';
import queryString from 'query-string';
import { Button } from '../../components';
import { FormLabel, TextInput } from '../../components/FormElements';
import { extractUserData, getUserFromRedirect, handleSignIn, saveUserInFirestore } from '../../api';
import { isVisitor } from '../../utils';
import { setLocalStorage, getLocalStorage } from '../../localStorage';

import firebase, { realtimeDB } from '../../firebase';

const balfurCheckIn = ({ picture_url, firstName, userMessage }) => {
  const checkIn = realtimeDB.ref('balfur_check_ins').push();
  checkIn.set({ picture_url, firstName, userMessage, createdAt: firebase.database.ServerValue.TIMESTAMP });
  setLocalStorage('protest_event_checked_in', true);
};

/*
const checkIfUserCheckedIn=({uid})=>{
  ref.child("balfur_check_ins").orderByChild("uid").equalTo(uid).once("value",snapshot => {
    if (snapshot.exists()){
      const userData = snapshot.val();
      console.log("exists!", userData);
    }
});
}*/

const stages = {
  UNKNOWN: 'unkonwn',
  BEFORE_FACEBOOK_AUTH: 'beforeFacebookAuth',
  AFTER_FACEBOOK_AUTH: 'afterFacebookAuth',
  AFTER_ANONYMOUS_ENTRY: 'afterAnonymousEntry',
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
        });
      })
      .catch((error) => {
        console.error(error);
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
      <BalfurModalWrapper isOpen={!getLocalStorage('protest_event_checked_in')}>
        <BalfurModalContent>
          <h2>מרעידים את בלפור!</h2>
          <p>דווח/י שהגעת להפגנה וביחד נגרום לביבי לרעוד מפחד.</p>
          <Button onClick={() => handleSignIn()}>צ'ק אין דרך פייסבוק עם התמונה</Button>
          <Button onClick={() => setStage(stages.AFTER_ANONYMOUS_ENTRY)}>צ'ק אין ישיר</Button>
        </BalfurModalContent>
      </BalfurModalWrapper>
    );
  }

  if (stage === stages.AFTER_FACEBOOK_AUTH || stage === stages.AFTER_ANONYMOUS_ENTRY || !isVisitor(user)) {
    return (
      <BalfurModalWrapper isOpen={!getLocalStorage('protest_event_checked_in')}>
        <BalfurModalContent>
          <h2>תודה!</h2>
          <p>מיד נוסיף אותך לרשימת המפגינים.</p>
          <br />
          <FormLabel>
            כינוי <TextInput onChange={(e) => setFirstName(e.target.value)} value={firstName} />
          </FormLabel>
          <FormLabel>
            מסר לאומה (לא חובה)
            <TextInput onChange={(e) => setUserMessage(e.target.value)} value={userMessage} />
          </FormLabel>
          <Button
            onClick={() => {
              setStage(stages.UNKNOWN);
              balfurCheckIn({ userMessage, picture_url: isVisitor(user) ? '' : user.picture_url, firstName });
            }}
          >
            צ'ק אין
          </Button>
        </BalfurModalContent>
      </BalfurModalWrapper>
    );
  }

  return null;
}

const BalfurModalWrapper = styled(ReactModal)`
  z-index: 20;
  position: fixed;
  display: inline-block;
  padding: 20px 25px;
  height: 100vh;
  overflow-y: auto;
  border: 1px solid #d2d2d2;
  text-align: center;
  background-color: #fff;

  @media (min-width: 360px) {
    top: 30px;
    left: 7.5vw;
    right: 7.5vw;
    bottom: 7.5vw;
    max-height: calc(100vh - 10vh);
  }

  @media (min-width: 768px) {
    top: 75px;
    left: 21vw;
    right: 21vw;
    max-height: 550px;
  }

  @media (min-width: 1280px) {
    left: 30vw;
    right: 30vw;
  }

  @media (min-width: 1440px) {
    top: 100px;
    left: 35vw;
    right: 35vw;
  }

  /** Make the modal higher on short screens **/
  @media (max-height: 700px) and (min-width: 1024px) {
    top: 30px;
  }
`;

const BalfurModalContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 280px;
  margin: 0 auto;
`;
