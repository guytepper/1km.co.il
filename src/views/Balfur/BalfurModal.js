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
  setLocalStorage('protest_event_checked_in', true);
  const checkIn = realtimeDB.ref('balfur_check_ins').push();
  checkIn.set({ picture_url, firstName, userMessage, createdAt: firebase.database.ServerValue.TIMESTAMP });
  /*increase counter*/
  realtimeDB.ref('balfur_count').set(firebase.database.ServerValue.increment(1));
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

export default function BalfurModal({ user, setUser }) {
  const [stage, setStage] = useState(stages.UNKNOWN);
  const [firstName, setFirstName] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [showSocialLinks, setSocialLinks] = useState(false);
  const [pictureUrl, setPictureUrl] = useState('');
  const history = useHistory();

  useEffect(() => {
    getUserFromRedirect()
      .then((result) => {
        if (!result) {
          setStage(stages.BEFORE_FACEBOOK_AUTH);
          return;
        }

        const userData = extractUserData(result);
        console.log(userData);
        saveUserInFirestore(userData).then((fullUserData) => {
          console.log('fullUserData:', fullUserData);
          setStage(stages.AFTER_FACEBOOK_AUTH);
          setFirstName(userData.first_name);
          setPictureUrl(fullUserData.picture_url);
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

  if (showSocialLinks) {
    return (
      <BalfurModalWrapper isOpen={true}>
        <BalfurModalContent>
          <h2 style={{ marginBottom: 5 }}>הצטרפו אלינו גם בהפגנות הבאות</h2>
          <p style={{ marginTop: 10 }}>המשיכו לעקוב אחרינו כדי שנמשיך להגדיל את המחאה גם בהפגנה הבאה</p>
          <Button
            style={{ marginBottom: 10 }}
            color={'#3859a2'}
            onClick={() => window.open('https://www.facebook.com/1km.co.il/', '_blank')}
          >
            עמוד הפייסבוק שלנו
          </Button>
          <Button
            style={{ marginBottom: 10 }}
            color={'#2dcbf6'}
            onClick={() => window.open('https://www.twitter.com/1kmcoil/', '_blank')}
          >
            עמוד הטוויטר שלנו
          </Button>
          <Button
            style={{ marginBottom: 10 }}
            color={'#9668bf'}
            onClick={() => window.open('https://www.instagram.com/1km.co.il/', '_blank')}
          >
            עמוד האינסטגרם שלנו
          </Button>
          <hr style={{ width: '100%' }} />
          <Button
            style={{ marginBottom: 10 }}
            onClick={() => {
              setSocialLinks(false);
              setStage('');
            }}
          >
            סגירה
          </Button>
        </BalfurModalContent>
      </BalfurModalWrapper>
    );
  }

  if (stage === stages.UNKNOWN && !isVisitor(user)) {
    return (
      <BalfurModalWrapper isOpen={true}>
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
          <h1>מרעידים את בלפור!</h1>
          <h2 style={{ fontWeight: 500 }}>דווח/י שהגעת להפגנה וביחד נגרום לביבי לרעוד מפחד.</h2>
          <Button style={{ marginBottom: 10 }} onClick={() => handleSignIn()}>
            צ'ק-אין עם תמונת פייסבוק
          </Button>
          <Button onClick={() => setStage(stages.AFTER_ANONYMOUS_ENTRY)}>צ'ק-אין אנונימי</Button>
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
            disabled={firstName == ''}
            onClick={() => {
              setStage(stages.UNKNOWN);
              console.log(user);
              balfurCheckIn({ userMessage, picture_url: isVisitor(user) ? '' : pictureUrl, firstName });
              // Open social links modal
              setTimeout(() => {
                setSocialLinks(true);
              }, 2020);
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
