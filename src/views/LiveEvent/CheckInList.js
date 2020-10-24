import React from 'react';
import { useTransition, config } from 'react-spring';
import { CheckInListWrapper, CheckIn, UserAvatar } from './LiveEventElements';
import styled from 'styled-components/macro';

function CheckInList({ checkIns }) {
  const transitions = useTransition(checkIns, (item) => item.id, {
    config: config.gentle,
    from: { opacity: 0, transform: 'translate3d(25%, 0%, 0px)' },
    enter: { opacity: 1, transform: 'translate3d(0%, 0px, 0px)' },
    leave: { opacity: 0, height: 0, transform: 'translate3d(-25%, 0px, 0px)' },
  });

  return (
    <CheckInListWrapper>
      {checkIns?.length > 0 &&
        transitions.map(({ item, props, key }, i) => (
          <CheckIn key={key} style={i === 0 ? props : {}}>
            <UserAvatar src={item.picture_url === '' ? '/anonymousPofile.png' : item.picture_url} />
            <CheckIn.Info>
              <CheckIn.Name>
                {item.firstName} {item.lastName}
              </CheckIn.Name>
              <CheckIn.Location>{item.protestCityName || item.protestStreetAddress}</CheckIn.Location>
            </CheckIn.Info>
            {item.userMessage && <CheckIn.Comment>{item.userMessage}</CheckIn.Comment>}
            <CheckIn.TimeAgo>לפני 10 דקות</CheckIn.TimeAgo>
          </CheckIn>
        ))}
      {checkIns?.length == 0 ? (
        <div style={{ textAlign: 'center' }}>
          <LoadingIcon src="/icons/loading-spinner.svg" alt="" />
          <p>טוענים צ'ק אינים...</p>
        </div>
      ) : (
        ''
      )}
    </CheckInListWrapper>
  );
}
const LoadingIcon = styled.img`
  display: flex;
  margin: 40px auto;
`;

export default CheckInList;
