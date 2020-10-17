import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';

export const SimpleProgress = function SimpleProgress({ checkInsCount, MaxCheckIns }) {
  const [countPercentage, setCountPercentage] = useState(0);

  useEffect(() => {
    setCountPercentage((checkInsCount * 100) / MaxCheckIns);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return <Bar className="progress-bar" length={countPercentage}></Bar>;
};

export const ProgressBar = function ProgressBar({ checkInsCount, MaxCheckIns }) {
  const [countPercentage, setCountPercentage] = useState(0);

  useEffect(() => {
    setCountPercentage((checkInsCount * 100) / MaxCheckIns);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return (
    <Box>
      <h4 style={{ textAlign: 'center' }}>מד העצבים של ביבי: {checkInsCount} צ'ק אינים</h4>
      <Bar className="progress-bar" length={countPercentage}></Bar>
    </Box>
  );
};
const Bar = styled.div`
  /**Progress Bar - Bibi nervous bar**/
  background: #e3e3e3;
  border-radius: 8px;
  display: block;
  height: 16px;
  margin: 20px auto 40px;
  position: relative;
  width: 85%;

  &:before {
    background: linear-gradient(90deg, #79e313 0%, #e3c313 50%, #e35513 100%);
    border-right: 1px solid #d5aa4f;
    border-radius: 8px;
    bottom: 0;
    content: '';
    display: inline-block;
    left: 0;
    position: absolute;
    width: ${(props) => {
      return 'calc( ' + props.length + ' * 1% )';
    }};
    top: 0;
  }
`;

const Box = styled.div`
  position: absolute;
  top: 150px;
  left: 10%;
  width: 80%;
  margin-top: 30px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 10px -1px;
  z-index: 20;

  @media (min-width: 600px) {
    display: none;
  }

  /* @media (min-width: 720px) {
    top: 175px;
  }

  @media (min-width: 1280px) {
    top: 200px;
  }

  @media (min-width: 1444px) {
    top: 200px;
  } ; */
`;
