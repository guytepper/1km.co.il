import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '../components';

export default function SignUpCompleted(props) {
  const history = useHistory();
  
  function goBackHome() { 
    history.push('/');
  }

  if(!props.user) {
    return null;
  }

  return <>
    <h2>Thank you {props.user.displayName}!</h2>
    <Button onClick={() => goBackHome()}>go back home</Button>
  </>;
}
