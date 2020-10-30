import React, { useEffect } from 'react';
import {
  LeaderSidebarCard,
  SidebarList,
  SidebarListHead,
  SidebarListHeadTitle,
  SidebarWrapper,
  LeaderPhoto,
  Field,
} from './components';
import { listLeaderRequests } from '../../api';
import { useHistory } from 'react-router-dom';

const LeaderSidebar = ({ state, dispatch }) => {
  const history = useHistory();
  useEffect(() => {
    const fetchLeaderRequests = async () => {
      const leaderRequests = await listLeaderRequests();
      dispatch({ type: 'setLeaderRequests', payload: { leaderRequests } });
    };
    fetchLeaderRequests();
  }, [dispatch]);

  return (
    <SidebarWrapper>
      <SidebarListHead>
        <SidebarListHeadTitle>בקשות הובלה</SidebarListHeadTitle>
      </SidebarListHead>
      <SidebarList>
        {state.leaderRequests.map((request) => (
          <LeaderSidebarCard
            active={request.id === state.currentLeaderRequest?.id}
            onClick={() => history.push(`/admin/leader-requests/${request.id}`)}
            key={request.id}
          >
            <div style={{ position: 'absolute', top: '5px', left: '5px', fontSize: '10px' }}>
              {new Date(request.created_at.seconds * 1000).toLocaleTimeString('he-IL')}{' '}
              {new Date(request.created_at.seconds * 1000).toLocaleDateString('he-IL')}
            </div>
            <LeaderPhoto src={request.user.pictureUrl || '/anonymousPofile.png'} />
            <div>
              <Field name="שם" value={request.user.displayName} />
              <Field name="מספר טלפון" value={request.user.phoneNumber} />
              <Field name="אימייל" value={request.user.email} />
            </div>
          </LeaderSidebarCard>
        ))}
      </SidebarList>
    </SidebarWrapper>
  );
};

export default LeaderSidebar;
