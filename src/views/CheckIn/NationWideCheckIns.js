import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';

function NationWideCheckIns({}) {
  return (
    <CheckInsWrapper>
      <CheckInsList>
        <CheckInEntry>
          <CheckInAvatar src="./anonymousPofile.png" />
          <CheckInInfo>
            <CheckInName>Guy</CheckInName>
            <CheckInComment>Hello</CheckInComment>
          </CheckInInfo>
        </CheckInEntry>
      </CheckInsList>
    </CheckInsWrapper>
  );
}
export default NationWideCheckIns;

const CheckInsWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px 5px;
  overflow: hidden;
`;

const CheckInsList = styled.div`
  justify-items: center;
  align-items: center;
  display: grid;
  grid-auto-rows: 60px;
  height: 500px;
`;

const CheckInEntry = styled.div`
  display: flex;
  width: 320px;
  align-items: center;
  margin: 0 12.5px;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0px 2px 5px -1px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background: #ffffff;
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
