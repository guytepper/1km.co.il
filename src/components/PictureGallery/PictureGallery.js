import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Image } from 'antd';
import { getPicturesForEvent } from '../../api';

function PictureGallery({ protestId, date }) {
  const [pictures, setPictures] = useState([]);

  const getPictures = async () => {
    const pictureList = await getPicturesForEvent({ protestId, date });
    setPictures(pictureList);
  };

  useEffect(() => {
    getPictures();
  }, []);

  return (
    <SectionContainer>
      <SectionTitle>תמונות מיום שבת, 31.10</SectionTitle>
      {pictures.length > 0 ? pictures.map((picture) => <ImageThumbnail src={picture.imageUrl} />) : null}
    </SectionContainer>
  );
}

export default PictureGallery;

const SectionContainer = styled.div`
  width: 100%;
  padding: 35px 30px;
  margin: 20px 0;
  box-shadow: 0px 4px 10px -1px rgba(0, 0, 0, 0.15);
  background-color: white;

  display: grid;
  grid-template-columns: repeat(2, 1fr);

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
  }
`;

const SectionTitle = styled.div`
  font-size: 16px;
  line-height: 19px;
  color: #1251f3;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  grid-column: 1 / -1;
`;

const ImageThumbnail = styled(Image)`
  width: 100%;
  height: 175px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  img {
    height: 175px;
    object-fit: cover;
  }

  &:hover {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
    transform: scale(1.075);
  }
`;
