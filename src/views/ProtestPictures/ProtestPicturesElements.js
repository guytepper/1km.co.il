import React from 'react';
import styled from 'styled-components/macro';

export const ProtestPicturesWrapper = styled.div``;

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

  h2,
  h3 {
    font-family: Caravan, sans-serif;
    color: white;
    text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);
  }
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
  min-height: 90vh;
  background-image: ${({ imageUrl }) => `url('${imageUrl}')`};

  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: max-content;
  gap: 20px;
`;

export const InfoBox = styled.div`
  padding: 28px;
  font-size: 18px;
  background: #fff;
  text-align: center;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.5);
`;

export const ProtestImage = ({ children, imageUrl }) => {
  return (
    <div style={{ boxShadow: '0 0 3px 0 rgba(0, 0, 0, 0.5);' }}>
      <img src={imageUrl} alt="" style={{ width: '100%' }} />
      {children}
    </div>
  );
};

ProtestImage.Description = styled.div`
  display: flex;
  align-items: center;
  min-height: 60px;
  padding: 12.5px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;

  p {
    margin: 0;
  }
`;
