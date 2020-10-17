import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';

function BalfurCheckIns({ checkIns }) {
  return (
    <CheckInsWrapper>
      <CheckInsList>
        {checkIns.map((checkIn) => (
          <CheckInEntry key={checkIn.createdAt}>
            <CheckInAvatar src={checkIn.profilePic} />
            <CheckInName>{checkIn.firstName}</CheckInName>
          </CheckInEntry>
        ))}
      </CheckInsList>
    </CheckInsWrapper>
  );
}

export default BalfurCheckIns;

const CheckInsWrapper = styled.div`
  width: 100vw;
  height: 100px;
  padding: 20px 10px;
  overflow: hidden;
`;

const CheckInsList = styled.div`
  display: flex;
`;

const CheckInEntry = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 12.5px;
`;

const CheckInAvatar = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
  border-radius: 50px;
  box-shadow: 0 0 0px 2px white, 0 0 0px 5px purple;
  user-select: none;
`;

const CheckInName = styled.span`
  font-size: 13px;
`;
