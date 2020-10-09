import React, { useEffect, useState } from 'react';
import { LeaderCard, SidebarList, SidebarListHead, SidebarListHeadTitle, SidebarWrapper, LeaderPhoto, Field } from './components';
import { useAdminContext } from './Context';
import { assignRoleOnProtest, getProtestById, listLeaderRequests } from '../../api';

const LeaderSidebar = () => {
  const { state, dispatch } = useAdminContext();

  useEffect(() => {
    const fetchLeaderRequests = async () => {
      dispatch({ type: 'setLeaderRequests', payload: { leaderRequests: await listLeaderRequests() } });
    };
    fetchLeaderRequests();
  }, [dispatch, listLeaderRequests]);

  return (
    <SidebarWrapper>
      <SidebarListHead>
        <SidebarListHeadTitle>בקשות הובלה</SidebarListHeadTitle>
      </SidebarListHead>
      <SidebarList>
        {state.leaderRequests.map((request) => (
          <LeaderCard
            active={request.id === state.currentLeaderRequest?.id}
            onClick={() => dispatch({ type: 'setCurrentLeaderRequest', payload: { currentLeaderRequest: request } })}
            key={request.id}
          >
            <div style={{ position: 'absolute', top: '5px', left: '5px', fontSize: '10px' }}>
              {new Date(request.created_at.seconds * 1000).toLocaleTimeString('he-IL')}{' '}
              {new Date(request.created_at.seconds * 1000).toLocaleDateString('he-IL')}
            </div>
            <LeaderPhoto src={request.user.picture_url} />
            <div>
              <Field name="שם" value={request.user.displayName} />
              <Field name="מספר טלפון" value={request.user.phoneNumber} />
              <Field name="אימייל" value={request.user.email} />
            </div>
          </LeaderCard>
        ))}
      </SidebarList>
    </SidebarWrapper>
  );
};

export default LeaderSidebar;
