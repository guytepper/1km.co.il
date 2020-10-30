import React from 'react';
import { Avatar, Image } from 'antd';
import styled from 'styled-components/macro';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import he from 'timeago.js/lib/lang/he';

timeago.register('he', he);

function PictureCardList({ pictures }) {
  return (
    <>
      {pictures.map((picture) => (
        <Card key={picture.id}>
          <Card.Info>
            <Card.Info.Title>{picture.protestName}</Card.Info.Title>
            <Card.Info.Subtitle>
              <Avatar size={21} src={picture.userAvatar || 'https://1km.co.il/anonymousPofile.png'} style={{ marginLeft: 6 }} />
              {picture.uploaderName}
            </Card.Info.Subtitle>
            <Card.Description>המהפכה מתקרבת! יא הו !</Card.Description>
            <Card.Info.Timestamp>
              <TimeAgo datetime={picture.createdAt} locale="he" />
            </Card.Info.Timestamp>
          </Card.Info>
          <Card.Image src={picture.imageUrl} alt="" />
        </Card>
      ))}
    </>
  );
}

export default PictureCardList;

const Card = styled.div`
  width: 100%;
  background: #fff;
  margin: 10px 0;
  border-radius: 2px;
  border: 1px solid #e3e3e3;
`;

Card.Image = styled(Image)`
  width: 100%;
  height: 320px;
  cursor: pointer;

  .ant-image-img {
    height: 100%;
    object-fit: cover;
    border-radius: 0 0 2px 2px;
  }
`;

Card.Info = styled.div`
  display: grid;
  grid-template-columns: 1fr 90px;
  padding: 18px 24px 24px;
`;

Card.Info.Title = styled.h3`
  margin-bottom: 2.5px;
  font-size: 22px;
  font-weight: 600;
  grid-column: 1/2;
`;

Card.Info.Subtitle = styled.h4`
  font-size: 17px;
  grid-column: 1/2;
`;

Card.Info.Timestamp = styled.span`
  grid-column: 2/-1;
  grid-row: 1;
  align-self: center;
  text-align: left;
  font-size: 13px;
`;

Card.Description = styled.p`
  grid-column: 1 / 2;
  margin-bottom: 0;
`;
