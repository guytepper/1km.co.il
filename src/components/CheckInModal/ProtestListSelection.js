import React, { useState, useEffect } from 'react';
import { Button } from '../elements';
import styled from 'styled-components/macro';

import protestsDev from './ProtestListSelectionMockData.json';

function ProtestListSelection({ protests, setProtest, setCurrentStep }) {
  return (
    <ProtestSelectionWrapper>
      <h3>איפה אתם מפגינים?</h3>

      <ProtestSelectionList>
        {protestsDev?.map((protest) => {
          return (
            <ProtestSelectionCard onClick={() => setProtest(protest)} key={protest.id} tabIndex={0}>
              <ProtestSelectionCard.Details>
                <ProtestSelectionCard.Title>{protest.displayName}</ProtestSelectionCard.Title>
                <ProtestSelectionCard.Address>{protest.streetAddress}</ProtestSelectionCard.Address>
              </ProtestSelectionCard.Details>
            </ProtestSelectionCard>
          );
        })}
      </ProtestSelectionList>
      <div>
        <p style={{ margin: '0 auto 10px' }}>
          ההפגנה לא ברשימה?
          <br />
          נסו לעדכן מיקום או הוסיפו הפגנה חסרה
        </p>
        <Button style={{ width: '100%', marginBottom: 10 }} onClick={() => setCurrentStep('pickLocation')}>
          עדכון מיקום
        </Button>
        <Button style={{ width: '100%' }}>הוספת הפגנה</Button>
      </div>
    </ProtestSelectionWrapper>
  );
}

export default ProtestListSelection;

const ProtestSelectionWrapper = styled.div`
  width: 100%;
`;

const ProtestSelectionList = styled.div`
  /* margin: 0 -40px; */
`;

const ProtestSelectionCard = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  margin-bottom: 10px;
  text-align: center;
  background: #1ed96e;
  color: #fff;
  cursor: pointer;
`;

ProtestSelectionCard.Details = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

ProtestSelectionCard.Title = styled.span`
  margin: 0;
  font-size: 18px;
  font-weight: 900;
`;
ProtestSelectionCard.Address = styled.span`
  margin: 0;
  font-size: 14px;
`;
