import React from 'react';
import { useTransition, config } from 'react-spring';
import { CheckInListWrapper, CheckIn, UserAvatar } from './LiveEventElements';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import { LoadingSpinner } from '../../components';

import he from 'timeago.js/lib/lang/he';
timeago.register('he', he);

function CheckInList({ checkIns }) {
  const transitions = useTransition(checkIns, (item) => item?.id, {
    config: config.gentle,
    from: { opacity: 0, transform: 'translate3d(25%, 0%, 0px)' },
    enter: { opacity: 1, transform: 'translate3d(0%, 0px, 0px)' },
    leave: { opacity: 0, height: 0, transform: 'translate3d(-25%, 0px, 0px)' },
  });

  return (
    <CheckInListWrapper>
      {checkIns?.length > 0 ? (
        transitions.map(({ item, props, key }, i) => (
          <CheckIn key={key} style={i === 0 ? props : {}}>
            <UserAvatar src={item.pictureUrl === '' ? '/anonymousPofile.png' : item.pictureUrl} />
            <CheckIn.Info>
              <CheckIn.Name>
                {item.firstName} {item.lastName}
              </CheckIn.Name>
              <CheckIn.Location>ב{item.protestCityName || item.protestStreetAddress}</CheckIn.Location>
            </CheckIn.Info>
            {item.userMessage && <CheckIn.Comment>{item.userMessage}</CheckIn.Comment>}
            <CheckIn.TimeAgo>
              <TimeAgo datetime={item.createdAt} locale="he" />
            </CheckIn.TimeAgo>
          </CheckIn>
        ))
      ) : (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
          <span>טוען...</span>
          <LoadingSpinner style={{ marginTop: 15 }} />
        </div>
      )}
    </CheckInListWrapper>
  );
}

export default CheckInList;
