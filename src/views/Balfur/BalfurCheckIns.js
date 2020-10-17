import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';

function BalfurCheckIns({ checkIns }) {
  return (
    <CheckInsWrapper>
      <CheckInsList>
        {checkIns.map((checkIn) => (
          <CheckInEntry>
            <CheckInAvatar />
            {checkIn.firstName}
          </CheckInEntry>
        ))}
      </CheckInsList>
    </CheckInsWrapper>
  );
}

export default BalfurCheckIns;

const CheckInsWrapper = styled.div`
  width: 100%;
  height: 60px;
`;

const CheckInsList = styled.div`
  display: flex;
`;

const CheckInEntry = styled.div``;

const CheckInAvatar = styled.image``;
