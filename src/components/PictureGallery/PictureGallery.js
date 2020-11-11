import React, { useState, useEffect } from 'react';
import { useHistory, matchPath } from 'react-router-dom';
import { useStore } from '../../stores';
import styled from 'styled-components/macro';
import { Image } from 'antd';
import { getPicturesForEvent } from '../../api';
import { dateToDayOfWeekAndDate } from '../../utils';
import { getGalleryThumbnails, getPicturesForDate } from './PictureGalleryUtils';

function PictureGallery({ protestId }) {
  const history = useHistory();
  const store = useStore();
  const route = matchPath(history.location.pathname, {
    path: '/protest/:id/gallery/:date',
  });
  const galleryDate = route?.params.date;
  const [pictures, setPictures] = useState([]);
  const [picturesFetchState, setPicturesFetchState] = useState(false);

  const getPictures = async () => {
    const pictureList = await getPicturesForEvent({ protestId });
    setPictures(pictureList);
    setPicturesFetchState(true);
  };

  useEffect(() => {
    getPictures();

    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateClick = (date) => {
    history.push(`${history.location.pathname}/${date}`);
  };

  const picArr = galleryDate ? getPicturesForDate(pictures, galleryDate) : getGalleryThumbnails(pictures);
  if (picturesFetchState && !picArr.length && galleryDate) {
    const paths = history.location.pathname.split('/');
    paths.pop();
    history.push(paths.join('/'));
  }

  return (
    <>
      <SectionContainer>
        <SectionTitle>{galleryDate ? `תמונות מ${dateToDayOfWeekAndDate(galleryDate)}` : 'גלריית תמונות'}</SectionTitle>
        {pictures.length > 0 && (
          <>
            {galleryDate
              ? picArr.map((picture) => <ImageThumbnail src={picture.imageUrl} />)
              : picArr.map((picture) => (
                  <ImageDateSection
                    src={picture.imageUrl}
                    date={picture.eventDate}
                    onClick={() => handleDateClick(picture.eventDate)}
                  />
                ))}
          </>
        )}
        <EditButton
          onClick={async () => {
            store.userStore.setUserProtestById(protestId);
            history.push(
              store.userStore.user
                ? `/upload-image?returnUrl=${history.location.pathname}`
                : `/sign-up?returnUrl=/upload-image?returnUrl=${history.location.pathname}`
            );
          }}
        >
          הוספת תמונה לגלרייה
        </EditButton>
      </SectionContainer>
    </>
  );
}

function ImageDateSection({ src, date, onClick }) {
  return (
    <ImageDateContainer onClick={onClick}>
      <ImageThumbnail src={src} />
      <DateTitle>{dateToDayOfWeekAndDate(date)}</DateTitle>
    </ImageDateContainer>
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
  justify-items: center;
  gap: 5px;

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

const ImageDateContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`;

const DateTitle = styled.div`
  margin-top: 10px;
  font-size: 16px;
  line-height: 19px;
  color: black;
  font-weight: 600;
  text-align: center;
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

  @media (min-width: 1024px) {
    &:hover {
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
      transform: scale(1.075);
    }
  }
`;

const EditButton = styled.button`
  width: 100%;
  height: auto;
  margin-top: 10px;
  color: #1251f3;
  border: 1px solid #1251f3;
  box-sizing: border-box;
  font-size: 16px;
  line-height: 19px;
  padding: 6px 24px;
  background: white;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s all;
  grid-column: 1 / -1;

  &:hover {
    background-color: #6e7dff;
    color: #fff;
  }
`;
