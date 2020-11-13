import React from 'react';
import styled from 'styled-components/macro';

function LoadingSpinner({ imgSrc, style = {} }) {
  const spinnerSrc = '/icons/loading-spinner.svg';
  return (
    <LoadingSpinnerWrapper>
      <img alt={'loading'} src={imgSrc || spinnerSrc} style={{ width: 80, ...style }} />
    </LoadingSpinnerWrapper>
  );
}

export default LoadingSpinner;

const LoadingSpinnerWrapper = styled.span`
  text-align: center;
`;
