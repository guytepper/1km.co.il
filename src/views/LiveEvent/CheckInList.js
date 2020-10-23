import React, { useState, useEffect } from 'react';
import { CheckInListWrapper, CheckIn } from './LiveEventElements';
import { useSpring, animated } from 'react-spring';

function CheckInList({ checkIns }) {
  const newItem = useSpring({
    delay: 600,
    from: { transform: 'translate3d(100%,0,0)' },
    to: { transform: 'translate3d(0,0,0)' },
  });
  const oldItem = useSpring({
    delay: 900,
    from: { transform: 'translate3d(0,0,0)' },
    to: { transform: 'translate3d(0,-200%,0)' },
  });

  return (
    <CheckInListWrapper>
      {checkIns?.length > 0 &&
        checkIns.slice(1).map((checkIn, i) => (
          <CheckIn key={checkIn.id} style={i == 0 ? newItem : oldItem}>
            <CheckIn.Avatar src={checkIn.picture_url === '' ? './anonymousPofile.png' : checkIn.picture_url} />
            <CheckIn.Info>
              <CheckIn.Name>{checkIn.firstName}</CheckIn.Name>
              <CheckIn.Location>מפגין במזכרת בתיה</CheckIn.Location>
              {checkIn.userMessage && <CheckIn.Comment>{checkIn.userMessage}</CheckIn.Comment>}
            </CheckIn.Info>
          </CheckIn>
        ))}
    </CheckInListWrapper>
  );
}

export default CheckInList;
