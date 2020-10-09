import React, { useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import queryString from 'query-string';
import { Button } from '../components';
import {
  sendProtestLeaderRequest,
  isProtestValid
} from '../api';
import { LeaderRequestSubmitted } from '.';

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

export default function LeaderRequest(props) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const history = useHistory();

  async function submitLeaderRequest(phoneNumber) {
    const { protest: protestId } = queryString.parse(window.location.search);
  
    if (!protestId) {
      console.error('missing protest id, cannot assign user to a protest');
    }

    isProtestValid(protestId).then(async (validProtest) => {
      if (!validProtest) {
        throw new Error(`invalid protest id: ${protestId}`);
      }
      
      await sendProtestLeaderRequest(props.user, phoneNumber, protestId);
      
      history.push('/leader-request/submitted');
    });
  }

  if (!props.user) {
    return null;
  }

  return (
    <>
      <Switch>
        <Route exact path="/leader-request/submitted">
          <LeaderRequestSubmitted user={props.user}/>
        </Route>
        <Route>
          <ProtestFormLabel>
            Phone Number: 
            <ProtestFormInput name="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </ProtestFormLabel>
          <Button onClick={() => submitLeaderRequest(phoneNumber)}>Submit request</Button>
        </Route>
      </Switch>
    </>
  )
}
