import styled from 'styled-components/macro';
import { Map } from 'react-leaflet';
import { Image } from 'antd';

export const EditViewContainer = styled.div`
  width: 80%;
  max-width: 1000px;
  padding: 24px 0;
  margin: 0 auto;
`;

export const ProtestPageContainer = styled.div``;

export const ProtestContainer = styled.div`
  margin: 0 auto 30px;
  max-width: 700px;
  padding: 0 15px;
  z-index: 1;

  @media (min-width: 1024px) {
    max-width: 920px;
  }
`;

export const Info = styled.div`
  position: relative;
  padding: 20px 34px;
  background: #ffffff;
  box-shadow: 0px 4px 10px -1px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  margin-top: -30px;
  z-index: 5;

  @media (min-width: 600px) {
    display: grid;
    grid-template-columns: 1fr 200px;
  }
`;

export const Title = styled.h1`
  font-weight: bold;
  font-size: 28px;
  line-height: 47px;
  color: #000000;
  margin-bottom: 8px;
`;

export const MapWrapper = styled(Map)`
  width: 100%;
  height: 256px;
  z-index: 0;
`;

export const EditButton = styled.button`
  width: 100%;
  height: auto;
  color: #1251f3;
  border: 1px solid #1251f3;
  box-sizing: border-box;
  font-size: 16px;
  line-height: 18.96px;
  padding-top: 6px;
  padding-bottom: 7px;
  padding-left: 24px;
  padding-right: 24px;
  background: white;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s all;

  &:hover {
    background-color: #6e7dff;
    color: #fff;
  }
`;

export const SectionContainer = styled.div`
  width: 100%;
  padding: 35px 30px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 10px -1px rgba(0, 0, 0, 0.15);
  background-color: white;

  @media (min-width: 1024px) {
    margin: 0;
  }
`;

export const SectionTitle = styled.div`
  font-size: 16px;
  line-height: 19px;
  color: #1251f3;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  img {
    height: 15px;
    width: 15px;
    margin-left: 9px;
  }
`;

export const Details = styled.div``;

export const DatesAndSocial = styled.div`
  margin-top: 24px;
  display: grid;

  @media (min-width: 1024px) {
    gap: 25px;
    grid-template-columns: 2fr 1.25fr;
  }
`;

export const Dates = styled.ul`
  width: 100%;
  padding: 0;
  margin: 0 0 20px;

  @media (min-width: 768px) {
    max-width: 420px;
  }
`;

export const DateCard = styled.li`
  list-style: none;
`;

export const DateText = styled.span`
  font-size: 18px;
  font-weight: 400;
  line-height: 28px;
`;

export const LatestPicturesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
  margin-bottom: 12.5px;

  @media (min-width: 580px) {
    gap: 10px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const PictureThumbnail = styled(Image)`
  width: 100%;
  cursor: pointer;

  img {
    height: 120px;
    object-fit: cover;

    @media (min-width: 580px) {
      height: 220px;
    }
  }
`;
