import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Image } from 'antd';
import styled from 'styled-components/macro';
import { useTransition, animated, config } from 'react-spring';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import he from 'timeago.js/lib/lang/he';

timeago.register('he', he);

function PictureCardList({ pictures }) {
  const transitions = useTransition(pictures, (picture) => picture?.id, {
    config: config.gentle,
    from: { opacity: 0, transform: 'translate3d(25%, 0%, 0px)' },
    enter: { opacity: 1, transform: 'translate3d(0%, 0px, 0px)' },
    leave: { opacity: 0, height: 0, transform: 'translate3d(-25%, 0px, 0px)' },
  });

  return (
    <>
      {transitions.map(({ item: picture, props, key }) => (
        <Card key={key} style={props}>
          <Card.Info>
            <Link to={`/protest/${picture.protestId}`}>
              <Card.Info.Title>
                {picture.protestName}
                {picture.cityName && `, ${picture.cityName}`}
              </Card.Info.Title>
            </Link>
            {picture.uploaderName && (
              <Card.Info.Subtitle>
                <Avatar size={21} src={picture.userAvatar || 'https://1km.co.il/anonymousPofile.png'} style={{ marginLeft: 6 }} />
                {picture.uploaderName}
              </Card.Info.Subtitle>
            )}
            {picture.description && <Card.Description>{picture.description}</Card.Description>}
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

const Card = styled(animated.div)`
  width: 100%;
  background: #fff;
  margin: 10px 0;
  border-radius: 2px;
  border: 1px solid #e3e3e3;
`;

Card.Image = styled(Image)`
  width: 100%;
  height: auto;
  cursor: pointer;

  .ant-image-img {
    height: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: 0 0 2px 2px;
  }
`;

Card.Info = styled.div`
  display: grid;
  grid-template-columns: 1fr 90px;
  padding: 18px 24px;
  align-items: baseline;
`;

Card.Info.Title = styled.h3`
  margin-bottom: 7.5px;
  font-size: 17px;
  font-weight: 600;
  grid-column: 1/2;
  color: #27235a;
  text-decoration: underline;
  text-decoration-color: #27235a38;
  text-underline-offset: 4px;

  @media (min-width: 402px) {
    font-size: 18px;
  }
`;

Card.Info.Subtitle = styled.h4`
  font-size: 15px;
  grid-column: 1/2;
`;

Card.Info.Timestamp = styled.span`
  grid-column: 2/-1;
  grid-row: 1;
  text-align: left;
  font-size: 13px;
`;

Card.Description = styled.p`
  grid-column: 1 / 3;
  margin-bottom: 0;
  font-size: 14px;
`;
