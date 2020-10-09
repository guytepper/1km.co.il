import React, { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import queryString from 'query-string';
import { Button, PageWrapper, PageContentWrapper, PageParagraph } from '../components';
import { sendProtestLeaderRequest, isProtestValid, setPhoneNumberForUser, getProtestById } from '../api';
import { LeaderRequestSubmitted } from '.';

function LeaderRequestForm({ user }) {
  const history = useHistory();
  const [protestData, setProtestData] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  async function submitLeaderRequest(phoneNumber) {
    const { protest: protestId } = queryString.parse(window.location.search);

    isProtestValid(protestId).then(async (validProtest) => {
      if (!validProtest) {
        throw new Error(`invalid protest id: ${protestId}`);
      }

      await sendProtestLeaderRequest(user, phoneNumber, protestId);
      // Sync our user phone number
      await setPhoneNumberForUser(user.uid, phoneNumber);

      history.push('/leader-request/submitted');
    });
  }

  useEffect(() => {
    const { protest: protestId } = queryString.parse(window.location.search);

    if (!protestId) {
      console.error('Missing protest ID, cannot assign user to a protest');
    }

    getProtestById(protestId).then((protestData) => {
      setProtestData(protestData);
    });
  }, []);

  return (
    <PageWrapper>
      <PageContentWrapper>
        <PageParagraph>תודה שהצטרפת אלינו והגשת בקשה לערוך את עמוד ההפגנה:</PageParagraph>
        <PageParagraph>
          <b>
            {protestData?.displayName}
            <br />
            {protestData?.streetAddress}
          </b>
        </PageParagraph>
        <PageParagraph>
          נשמח אם נוכל להיעזר בך באופן קבוע כדי לעדכן את עמוד ההפגנה, על מנת שהפעילים יוכלו להתעדכן בזמן אמת/באופן שוטף ולהצטרף
          אליה.
        </PageParagraph>
        <PageParagraph>אנא מלא/י את מספר טלפון וצוות האתר יצור איתך קשר בהקדם האפשרי:</PageParagraph>
        <ProtestFormLabel>
          <span style={{ marginBottom: 5 }}>מספר טלפון:</span>
          <ProtestFormInput type="tel" name="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </ProtestFormLabel>
        <Button color="#1ED96E" style={{ width: '100%' }} onClick={() => submitLeaderRequest(phoneNumber)}>
          הגשת בקשה
        </Button>
      </PageContentWrapper>
    </PageWrapper>
  );
}

export default function LeaderRequest(props) {
  if (!props.user) {
    return null;
  }

  return (
    <>
      <Switch>
        <Route exact path="/leader-request/submitted">
          <LeaderRequestSubmitted user={props.user} />
        </Route>
        <Route>
          <LeaderRequestForm user={props.user} />
        </Route>
      </Switch>
    </>
  );
}

//----------------- Styles -------------------------//
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
