import React, { useEffect, useState } from 'react';
import {
  LeaderCard,
  SidebarList,
  SidebarListHead,
  SidebarListHeadTitle,
  SidebarWrapper,
  LeaderPhoto,
  CardField,
} from './components';
import { PlacesAutocomplete, Button } from '../../components';
import { useAdminContext } from './Context';
import { assignRoleOnProtest, getProtestById, listPendingRequests } from '../../api';

const LeaderSidebar = () => {
  const { state, dispatch } = useAdminContext();
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      setPendingRequests(await listPendingRequests());
    };
    fetchPendingRequests();
  }, []);

  return (
    <SidebarWrapper>
      <SidebarListHead>
        <SidebarListHeadTitle>בקשות בעלות</SidebarListHeadTitle>
      </SidebarListHead>
      <SidebarList>
        {pendingRequests.map((request) => (
          <LeaderCard
            onClick={() => dispatch({ type: 'setCurrentLeaderRequest', payload: { currentLeaderRequest: request } })}
            key={request.id}
          >
            <div style={{ position: 'absolute', top: '5px', left: '5px', fontSize: '10px' }}>
              {new Date(request.created_at.seconds * 1000).toLocaleTimeString('he-IL')}{' '}
              {new Date(request.created_at.seconds * 1000).toLocaleDateString('he-IL')}
            </div>
            <LeaderPhoto src={request.user.picture_url} />
            <div>
              <CardField name="שם" value={request.user.displayName} />
              <CardField name="מספר טלפון" value={request.user.phoneNumber} />
              <CardField name="אימייל" value={request.user.email} />
            </div>
          </LeaderCard>
        ))}
      </SidebarList>
    </SidebarWrapper>
  );
};

export default LeaderSidebar;
