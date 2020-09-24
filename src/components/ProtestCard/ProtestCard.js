import React from 'react';
import styled from 'styled-components';

const ProtestCardWrapper = styled.div`
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 1px 4px 0px rgba(80, 80, 82, 0.16);
`;

const ProtestCardTitle = styled.h2`
  margin: 0;
  font-size: 22px;
`;

const ProtestCardInfo = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 100;
`;

function formatDistance(distance) {
  if (distance > 1000) {
    return `${(distance / 1000).toFixed(1)} ק"מ ממיקומך`;
  } else {
    return `${distance} מטר ממיקומך`;
  }
}

function ProtestCard({ displayName, location, distance }) {
  return (
    <ProtestCardWrapper>
      <ProtestCardTitle>{displayName}</ProtestCardTitle>
      {location.streetAddress && <ProtestCardInfo>{location.streetAddress}</ProtestCardInfo>}
      <ProtestCardInfo>{formatDistance(distance)}</ProtestCardInfo>
    </ProtestCardWrapper>
  );
}

export default ProtestCard;
