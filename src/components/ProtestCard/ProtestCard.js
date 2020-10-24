import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { DispatchContext } from '../../context';
import { useHistory } from 'react-router-dom';
import { formatDistance, dateToDayOfWeek, formatDate, getUpcomingDate } from '../../utils';

function getFormattedDate(date) {
  if (!date) {
    return null;
  }

  return `יום ${dateToDayOfWeek(date.date)} ${formatDate(date.date)} בשעה ${date.time}`;
}

function ProtestCard({ protestInfo, showAction = false, style }) {
  const dispatch = useContext(DispatchContext);
  const history = useHistory();

  const {
    displayName,
    streetAddress,
    distance,
    whatsAppLink,
    telegramLink,
    meeting_time: meetingTime,
    dateTimeList,
    notes,
    id,
  } = protestInfo;

  const upcomingDate = getUpcomingDate(dateTimeList);
  const formattedDate = getFormattedDate(upcomingDate);

  return (
    <ProtestCardWrapper
      tabIndex="0"
      style={style}
      onMouseOver={() => dispatch({ type: 'setHoveredProtest', payload: id })}
      onMouseOut={() => dispatch({ type: 'setHoveredProtest', payload: null })}
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

const ProtestCardGroupButton = styled.a`
  display: block;
  max-width: 100%;
  margin-top: 10px;
  padding: 4px 16px;
  background: ${(props) =>
    props.type
      ? props.type === 'whatsapp'
        ? '#00c647'
        : '#6AB2E4'
      : 'radial-gradient(100.6% 793.82% at 9.54% -0.6%, #6C7BFD 0%, #2938B7 100%)'};
  color: #fff;
  font-family: Simpler, sans-serif;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  border: none;
  border-radius: 3px;
`;

export default ProtestCard;
