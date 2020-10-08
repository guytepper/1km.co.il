import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '../../components';
import {
  extractUserData,
  getUserFromRedirect,
  handleSignIn,
  saveUserInFirestore,
} from './utils';

function SignUpBeforeRedirect() {
  return (
    <>
    <Button onClick={() => handleSignIn()}>Sign Up</Button>
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
  const history = useHistory();

  useEffect(() => {
    getUserFromRedirect()
    .then((result)=> {
      if (!result) {
        setStage(stages.BEFORE_FACEBOOK_AUTH);
        return;
      }
  
      const userData = extractUserData(result);
      
      setUserData(userData);
      setStage(stages.AFTER_FACEBOOK_AUTH);
  
      saveUserInFirestore(userData).then(() => {
        console.log(window.location.search);
        history.push(`/leader-request${window.location.search}`);
      });
    })
    .catch((error) => {
      console.log(error)
    });
  }, [history]);

  if (stage === stages.UNKNOWN) {
    return (<>loading...</>);
  }

  if (stage === stages.BEFORE_FACEBOOK_AUTH) {
    return  (<SignUpBeforeRedirect/>);
  }

  if (stage === stages.AFTER_FACEBOOK_AUTH) {
    return (<div>Thank you {userData.displayName} for sigining up!</div>);
  } 
}
