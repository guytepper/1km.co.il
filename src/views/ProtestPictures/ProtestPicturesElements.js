import React from 'react';
import styled from 'styled-components/macro';

export const ProtestPicturesWrapper = styled.div`
  h2,
  h3 {
    font-family: Caravan, sans-serif;
    color: white;
    text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);
  }
`;

export const ProtestPicturesHeader = styled.h2`
  margin: 0;
  font-size: 38px;
`;

export const ProtestPicturesSubheader = styled.h2`
  font-size: 22px;
  font-family: Simpler, sans-serif !important;
`;

export const ProtestPicturesText = styled.p`
  max-width: 88vw;
  margin-bottom: 8px;
  font-size: 17px;
  font-family: Simpler, sans-serif !important;
  color: #fff;
`;

export const HeroImage = styled.div`
  display: grid;
  grid-template-rows: 70px 200px 1fr;
  width: 100vw;
  height: 660px;
  margin-top: -60px;
  background-image: url('https://res.cloudinary.com/onekm/image/upload/v1604163817/protest_pictures/72zivncvY8R8R6EkO8rb/2020-31-10/Brk6xmLDL7WZu_4UhD9Q1.jpg');
  background-repeat: no-repeat;
  background-position: 52%;
  background-size: cover;
`;

HeroImage.TextWrapper = styled.div`
  grid-row: 2 / 3;

  text-align: center;
`;

HeroImage.Title = styled.h2`
  margin-bottom: 0;
  font-size: 35px;
  letter-spacing: 9px;

  @media (min-width: 1024px) {
    font-size: 42px;
    letter-spacing: 12.5px;
  }
`;

HeroImage.Subtitle = styled.h3`
  font-size: 25px;
  letter-spacing: 4.5px;
`;

export const ProtestPictureSection = styled.div`
  width: 100vw;
  padding: 25px;
  min-height: 95vh;
  background-image: ${({ imageUrl }) => `url('${imageUrl}')`};

  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(420px, max-content);
  gap: 20px;

  @media (min-width: 1024px) {
    padding: 5% 10%;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 235px max-content;
    grid-auto-rows: unset;
  }
`;

export const InfoBox = styled.div`
  padding: 28px;
  font-size: 18px;
  background: #fff;
  text-align: center;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.5);

  @media (min-width: 1024px) {
    padding: 30px;
  }
`;

export const ProtestImage = ({ children, imageUrl, id }) => {
  return (
    <ProtestImageWrapper id={id}>
      <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {children}
    </ProtestImageWrapper>
  );
};

const ProtestImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.5);
`;

ProtestImage.Description = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  min-height: 60px;
  padding: 12.5px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
`;

export const ImageLocation = styled.p`
  margin: -30px 10px;
  text-align: right;
  color: white;
  text-shadow: 0 0 2px #000;
`;

export const ImageCredit = styled.p`
  margin: -30px 10px;
  font-size: 14px;
  color: white;
  text-align: left;
  text-shadow: 0 0 2px #000;
`;
