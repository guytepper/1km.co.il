import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';

function BalfurPictures({ checkIns }) {
  return (
    <CheckInsWrapper>
      <ThumbnailsContentWrapper>
        <ThumbnailImg />
        <ThumbnailImg />
        <ThumbnailImg />
        <ThumbnailImg />
      </ThumbnailsContentWrapper>
    </CheckInsWrapper>
  );
}

export default BalfurPictures;

const CheckInsWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 15px 15px;
  overflow: hidden;
`;

const ThumbnailsContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 130px 130px;
  gap: 30px;
`;

const ThumbnailImg = styled.img`
  width: 100%;
  height: 100%;
  background-color: grey;
`;
