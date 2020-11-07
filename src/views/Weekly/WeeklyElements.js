import React from 'react';
import { Image } from 'antd';
import styled from 'styled-components/macro';

export const WeeklyWrapper = styled.div`
  h2,
  h3 {
    font-family: Caravan, sans-serif;
    color: white;
  }

  a {
    color: white;
    text-decoration: underline;
    text-decoration-color: #e7e7e78c;
    text-underline-offset: 4px;
  }
`;

export const WeeklyHeader = styled.h2`
  margin: 0;
  font-size: 38px;
  letter-spacing: 3px;

  @media (min-width: 1024px) {
    font-size: 50px;
  }
`;

export const WeeklySubheader = styled.h2`
  font-size: 22px;
  font-family: Simpler, sans-serif !important;

  @media (min-width: 1024px) {
    font-size: 26px;
  }
`;

export const WeeklyText = styled.p`
  max-width: 88vw;
  margin-bottom: 8px;
  font-size: 18px;
  font-family: Simpler, sans-serif !important;
  color: #fff;

  @media (min-width: 1024px) {
    font-size: 18px;
    max-width: 42vw;
  }

  @media (min-width: 1280px) {
    font-size: 20px;
  }
`;

export const HeroImage = styled.div`
  display: grid;
  grid-template-rows: 70px 200px 1fr;
  width: 100vw;
  height: 660px;
  margin-top: -60px;
  background-image: url('https://res.cloudinary.com/onekm/image/upload/q_auto:eco/v1604163817/protest_pictures/72zivncvY8R8R6EkO8rb/2020-31-10/Brk6xmLDL7WZu_4UhD9Q1.jpg');
  background-repeat: no-repeat;
  background-position: 52%;
  background-size: cover;

  @media (min-width: 1024px) {
    height: 100vh;
  }
`;

HeroImage.TextWrapper = styled.div`
  grid-row: 2 / 3;

  text-align: center;
`;

HeroImage.Title = styled.h2`
  margin-bottom: 0;
  font-size: 40px;
  letter-spacing: 9px;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);

  @media (min-width: 1024px) {
    font-size: 60px;
  }
`;

HeroImage.Subtitle = styled.h3`
  font-size: 25px;
  letter-spacing: 4.5px;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);

  @media (min-width: 1024px) {
    font-size: 40px;
  }
`;

export const WeeklySection = styled.div`
  width: 100vw;
  padding: 25px;
  min-height: 95vh;
  background-image: ${({ imageUrl }) => `url('${imageUrl}')`};
  background-repeat: no-repeat;
  background-size: cover;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: max-content;
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
    font-size: 18px;
    padding: 30px;
  }

  @media (min-width: 1280px) {
    font-size: 19px;
  }

  a {
    color: #0090ff;
    text-decoration: underline;
    text-decoration-color: #0090ff8c;
    text-underline-offset: 4px;
    font-weight: 600;
    transition: all 0.25s;
  }
  a:hover {
    color: #37a8ff;
  }
`;

export const ProtestImage = ({ children, className, imageUrl, style, imgStyle, id }) => {
  return (
    <ProtestImageWrapper style={style} id={id} className={className}>
      <ProtestImageElement src={imageUrl} alt="" style={imgStyle} />
      {children}
    </ProtestImageWrapper>
  );
};

const ProtestImageWrapper = styled.div`
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.5);
`;

const ProtestImageElement = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

ProtestImage.Description = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  height: auto;
  padding: 12.5px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  transform: translateY(-99%);

  p {
    margin: 0;
  }
`;

export const ImageCredit = styled.p`
  margin: -25px 10px;
  font-size: 12px;
  color: white;
  text-align: left;
  text-shadow: 0 0 2px #000;
`;

export const CompactLiveFeed = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;

  width: 100vw;
  height: 225px;
  margin-top: 10px;
  padding: 20px;

  background: rgba(255, 255, 255, 0.85);
  overflow-x: scroll;

  scrollbar-color: #5f6ffa #dde0ff;
  scrollbar-width: thin;

  ::-webkit-scrollbar {
    width: 5px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #dde0ff;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: #5f6ffa;
    border-radius: 10px;
  }
`;

CompactLiveFeed.Card = styled.div`
  width: 150px;
  display: flex;
  flex-direction: column;
`;

CompactLiveFeed.Card.Image = styled(Image)`
  width: 100%;
  height: 112.5px;
  cursor: pointer;
  transition: box-shadow 0.25s ease-in-out;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &:hover {
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
  }
`;

CompactLiveFeed.Card.Title = styled.h4`
  font-size: 14px;
`;
CompactLiveFeed.Card.Subtitle = styled.h4`
  font-size: 13px;
`;

CompactLiveFeed.Card.Avatar = ``;
