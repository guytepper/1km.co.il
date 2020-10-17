import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';

function ProgressBar({ checkInsCount, MaxCheckIns }) {
  useState(() => {
    CountPercentage = (checkInsCount / MaxCheckIns) * 100;
  }, [checkInsCount]);
  return <Bar class="progress-bar"></Bar>;
}
var CountPercentage = 0;
const Bar = styled.div`
  /**Progress Bar - Bibi nervous bar**/
  position: absolute;
  background: #e3e3e3;
  border-radius: 8px;
  display: block;
  height: 16px;
  margin: 40px auto;
  position: relative;
  width: 600px;

  &:before {
    background: linear-gradient(90deg, #d53369 0%, #daae51 100%);
    border-right: 1px solid #d5aa4f;
    border-radius: 8px;
    bottom: 0;
    content: '';
    display: inline-block;
    left: 0;
    position: absolute;
    width: calc(${CountPercentage} * 1%);
    top: 0;
  }
`;
export default ProgressBar;
