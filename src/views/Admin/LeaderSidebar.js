import React, { useEffect, useState } from 'react';
import { Card, SidebarList, SidebarListHead, SidebarListHeadTitle, SidebarWrapper } from './components';
import { PlacesAutocomplete, Button } from '../../components';
import { useAdminContext } from './Context';

const LeaderSidebar = () => {
  const { state, dispatch } = useAdminContext();

  return (
    <SidebarWrapper>
      <SidebarListHead>
        <SidebarListHeadTitle>בקשות בעלות</SidebarListHeadTitle>
      </SidebarListHead>
      <SidebarList>
        {['one', 'two'].map((request) => (
          <Card onClick={() => {}} key={request}>
            {request}
            {/* <div>
              <strong>שם המקום</strong>: {protest.displayName ?? 'אין'}
            </div>
            <div>
              <strong>כתובת</strong>: {protest.streetAddress ?? 'אין'}
            </div>
            <div>
              <strong>שעת מפגש</strong>: {protest.meeting_time ?? 'אין'}
            </div> */}
          </Card>
        ))}
      </SidebarList>
    </SidebarWrapper>
  );
};

export default LeaderSidebar;
