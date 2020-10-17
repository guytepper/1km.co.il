import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';

function BalfurCheckIns({ checkIns }) {
  return (
    <CheckInsWrapper>
      <CheckInsList>
        {checkIns.map((checkIn) => (
          <CheckInEntry key={checkIn.createdAt}>
            <CheckInAvatar src={checkIn.picture_url} />
            <CheckInInfo>
              <CheckInName>{checkIn.firstName} עכשיו בבלפור</CheckInName>
              {checkIn.userMessage && <CheckInComment>{checkIn.userMessage}</CheckInComment>}
            </CheckInInfo>
          </CheckInEntry>
        ))}
      </CheckInsList>
    </CheckInsWrapper>
  );
}

export default BalfurCheckIns;

const CheckInsWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px 5px;
  overflow: hidden;
`;

const CheckInsList = styled.div`
  display: grid;
  grid-auto-rows: 60px;
  height: 500px;
`;

const CheckInEntry = styled.div`
  display: flex;
  max-width: 320px;
  align-items: center;
  margin: 0 12.5px;

  @media (min-width: 600px) {
    max-width: 400px;
  }
`;

const CheckInAvatar = styled.img`
  width: 32.5px;
  height: 32.5px;
  margin-left: 10px;
  margin-bottom: 5px;
  flex-shrink: 0;
  border-radius: 50px;
  user-select: none;
`;

const CheckInInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CheckInName = styled.span`
  font-size: 15px;
`;

const CheckInComment = styled.span`
  font-size: 13px;
  color: #797676;
`;
