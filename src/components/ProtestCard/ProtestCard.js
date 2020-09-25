import React from 'react';
import styled from 'styled-components';

function formatDistance(distance) {
  if (distance > 1000) {
    return `${(distance / 1000).toFixed(1)} ק"מ ממיקומך`;
  } else {
    return `${distance} מטר ממיקומך`;
  }
}

function ProtestCard({ displayName, streetAddress, distance }) {
  return (
    <ProtestCardWrapper>
      <ProtestCardTitle>{displayName}</ProtestCardTitle>
      <ProtestCardInfo>
        {streetAddress && (
          <ProtestCardDetail>
            <ProtestCardIcon src="/icons/location.svg" alt="" aria-hidden="true" title="מיקום ההפגנה" />
            {streetAddress}
          </ProtestCardDetail>
        )}
        <ProtestCardDetail>
          <ProtestCardIcon src="/icons/ruler.svg" alt="" aria-hidden="true" title="מרחק" />
          {formatDistance(distance)}
        </ProtestCardDetail>
      </ProtestCardInfo>
      <ProtestCardGroupButton type={'whatsapp'}>קבוצת וואטסאפ</ProtestCardGroupButton>
    </ProtestCardWrapper>
  );
}

const ProtestCardWrapper = styled.div`
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 1px 4px 0px rgba(80, 80, 82, 0.16);
`;

const ProtestCardTitle = styled.h2`
  margin: 0;
  font-size: 22px;
`;

const ProtestCardInfo = styled.div`
  margin-bottom: 7.5px;
`;

const ProtestCardDetail = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 100;
`;

const ProtestCardIcon = styled.img`
  width: 17.5px;
  margin-inline-end: 5px;
  user-select: none;
`;

const ProtestCardGroupButton = styled.button`
  width: 100%;
  height: 40px;
  background: ${(props) => (props.type.whatsapp ? '#6AB2E4' : '#1ED96E')};
  color: #fff;
  font-family: Simpler, sans-serif;
  font-size: 18px;
  font-weight: 600;
  padding: 4px 16px;
  border: none;
  border-radius: 3px;
`;

export default ProtestCard;
