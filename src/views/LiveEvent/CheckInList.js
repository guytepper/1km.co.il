import React, { useState, useEffect } from 'react';
import { CheckInListWrapper, CheckIn } from './LiveEventElements';

function CheckInList({ checkIns }) {
  return (
    <CheckInListWrapper>
      {checkIns?.length > 0 &&
        checkIns.map((checkIn, index) => (
          <CheckIn key={checkIn.id}>
            <CheckIn.Avatar src={checkIn.picture_url === '' ? './anonymousPofile.png' : checkIn.picture_url} />
            <CheckIn.Info>
              <CheckIn.Name>{checkIn.firstName}</CheckIn.Name>
              <CheckIn.Location>מפגין במזכרת בתיה</CheckIn.Location>
            </CheckIn.Info>
            {checkIn.userMessage && <CheckIn.Comment>{checkIn.userMessage}</CheckIn.Comment>}
            <CheckIn.TimeAgo>לפני 10 דקות</CheckIn.TimeAgo>
          </CheckIn>
        ))}
    </CheckInListWrapper>
  );
}

export default CheckInList;
