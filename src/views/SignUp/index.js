import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import queryString from 'query-string';
import { Button } from '../../components';
import {
  extractUserData,
  getUserFromRedirect,
  handleSignIn,
  saveUserInFirestore,
  sendProtestLeaderRequest,
  setPhoneNumberForUser,
  isProtestValid
} from './utils';

const ProtestFormLabel = styled.label`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
  font-weight: 600;
`;

const ProtestFormInput = styled.input`
  width: 100%;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 16px;
  border: 1px solid #d2d2d2;
  -webkit-appearance: none;
`;

function SignUpBeforeRedirect() {
  return (
    <>
    <Button onClick={() => handleSignIn()}>Sign Up</Button>
    </>
  )
}

function SignUpAfterRedirect({ userData }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const history = useHistory();

  async function submitPhoneNumber(phoneNumber) {
    await setPhoneNumberForUser(userData.uid, phoneNumber);
    history.push('/sign-up-completed');
  }

  return (
    <>
      <ProtestFormLabel>
        Phone Number: 
        <ProtestFormInput name="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </ProtestFormLabel>
      <Button onClick={() => submitPhoneNumber(phoneNumber)}>Finish registration</Button>
    </>
  )
}

const stages = {
  UNKNOWN: 'unkonwn',
  BEFORE_FACEBOOK_AUTH: 'beforeFacebookAuth',
  AFTER_FACEBOOK_AUTH: 'afterFacebookAuth',
}

export default function SignUp(props) {
  const [stage, setStage] = useState(stages.UNKNOWN);
  const [userData, setUserData] = useState({});

  async function postFacebookAuthActions(result) {
    if (!result) {
      setStage(stages.BEFORE_FACEBOOK_AUTH);
      return;
    }

    const userData = extractUserData(result);
    
    const { protest: protestId } = queryString.parse(window.location.search);
  
    if (!protestId) {
      console.error('missing protest id, cannot assign user to a protest');
    }

    const validProtest = await isProtestValid(protestId);

    if (!validProtest) {
      throw new Error(`invalid protest id: ${protestId}`);
    }

    setUserData(userData);
    setStage(stages.AFTER_FACEBOOK_AUTH);

    await saveUserInFirestore(userData);
    await sendProtestLeaderRequest(userData, protestId);
  }

  useEffect(() => {
    getUserFromRedirect()
    .then(postFacebookAuthActions)
    .catch((error) => {
      console.log(error)
    });
  }, []);

  if (stage === stages.UNKNOWN) {
    return (<>loading...</>);
  }

  if (stage === stages.BEFORE_FACEBOOK_AUTH) {
    return  (<SignUpBeforeRedirect/>);
  }

  if (stage === stages.AFTER_FACEBOOK_AUTH) {
    return (<SignUpAfterRedirect userData={userData}/>);
  } 
}
