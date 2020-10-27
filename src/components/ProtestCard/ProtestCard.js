import React from 'react';
import styled from 'styled-components/macro';
import { useStore } from '../../stores';
import { useHistory } from 'react-router-dom';
import { formatDistance, dateToDayOfWeek, formatDate, getUpcomingDate } from '../../utils';

function getFormattedDate(date) {
  if (!date) {
    return null;
  }

  return `יום ${dateToDayOfWeek(date.date)} ${formatDate(date.date)} בשעה ${date.time}`;
}

function ProtestCard({ protestInfo, showAction = false, style }) {
  const store = useStore();
  const history = useHistory();

  const { displayName, streetAddress, distance, meeting_time: meetingTime, dateTimeList, id } = protestInfo;

  const upcomingDate = getUpcomingDate(dateTimeList);
  const formattedDate = getFormattedDate(upcomingDate);

  return (
    <ProtestCardWrapper
      tabIndex="0"
      style={style}
      onMouseOver={() => store.mapStore.setHoveredProtestId(protestInfo.id)}
      onMouseOut={() => store.mapStore.setHoveredProtestId(null)}
      onClick={() => {
        history.push(`/protest/${id}`);
      }}
      data-testid="protestCard"
    >
      <ProtestCardTitle>{displayName}</ProtestCardTitle>
      <ProtestCardInfo>
        {streetAddress && (
          <ProtestCardDetail data-testid="protestCard__streetAddress">
            <ProtestCardIcon src="/icons/location.svg" alt="" aria-hidden="true" title="מיקום ההפגנה" />
            {streetAddress}
          </ProtestCardDetail>
        )}

        {upcomingDate && (
          <ProtestCardDetail key={upcomingDate.id}>
            <ProtestCardIcon src="/icons/time.svg" alt="meeting time" aria-hidden="true" title="שעת מפגש" />
            {formattedDate}
          </ProtestCardDetail>
        )}
        {!upcomingDate && meetingTime && (
          <ProtestCardDetail>
            <ProtestCardIcon src="/icons/time.svg" alt="meeting time" aria-hidden="true" title="שעת מפגש" />
            {meetingTime}
          </ProtestCardDetail>
        )}
        {distance && (
          <ProtestCardDetail>
            <ProtestCardIcon src="/icons/ruler.svg" alt="" aria-hidden="true" title="מרחק" />
            {formatDistance(distance)}
          </ProtestCardDetail>
        )}
      </ProtestCardInfo>
    </ProtestCardWrapper>
  );
}

const ProtestCardWrapper = styled.div`
  padding: 16px;
  margin: 0 10px;
  background-color: #fff;
  box-shadow: 0 1px 4px 0px #00000026;
  cursor: pointer;
  border-radius: 4px;
  transition: box-shadow 175ms ease-out;

  &:last-child {
    margin-bottom: 10px;
  }

  &:hover,
  &:focus,
  &:focus-within {
    outline: none;
    box-sizing: border-box;
    box-shadow: 0 0 0 1px #6e7dff, 0px 4px 6px -1px #00000026;
  }
`;

const ProtestCardTitle = styled.h2`
  margin: 0;
  margin-bottom: 7.5px;
  font-size: 22px;
  font-weight: 600;
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
  margin-bottom: 5px;
`;

const ProtestCardIcon = styled.img`
  width: 17.5px;
  margin-inline-end: 5px;
  user-select: none;
`;

export default ProtestCard;
