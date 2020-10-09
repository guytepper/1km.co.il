import React, { useEffect, useState } from 'react';
import {
  Card,
  SidebarList,
  SidebarListHead,
  SidebarListHeadTitle,
  SidebarListHeadFilters,
  SidebarListHeadFilter,
  SidebarWrapper,
} from './components';
import { PlacesAutocomplete, Button } from '../../components';
import { useAdminContext } from './Context';
import { fetchPendingProtests, getNearProtests } from './utils';
import { fetchNearbyProtests } from '../../api';

const ProtestSidebar = () => {
  const { state, dispatch } = useAdminContext();
  // const [protestFilter, setProtestFilter] = useState('pending');
  const [coordinates, setCoordinates] = useState(null);
  const [pendingProtests, setPendingProtests] = useState([]);
  const [approvedProtests, setApprovedProtests] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (state.protestFilter === 'pending') {
        if (pendingProtests.length === 0) {
          setPendingProtests(await fetchPendingProtests());
        }
      } else if (!coordinates) {
        if (approvedProtests.length > 0) {
          setApprovedProtests([]);
        }
      } else {
        if (approvedProtests.length === 0) {
          setApprovedProtests(await fetchNearbyProtests(coordinates));
        }
      }
    }
    fetchData();
  }, [state.protestFilter, pendingProtests, approvedProtests, coordinates]);

  const protests = state.protestFilter === 'pending' ? pendingProtests : approvedProtests;

  return (
    <SidebarWrapper>
      <SidebarListHead>
        <SidebarListHeadTitle>הפגנות</SidebarListHeadTitle>
        <PlacesAutocomplete setManualAddress={setCoordinates} />
        <SidebarListHeadFilters>
          <SidebarListHeadFilter>
            <Button
              style={{ width: '120px', height: '30px', fontSize: '14px', opacity: state.protestFilter === 'pending' ? 0.5 : 1 }}
              onClick={() => dispatch({ type: 'setProtestFilter', payload: { protestFilter: 'pending' } })}
            >
              מחכה לאישור
            </Button>
          </SidebarListHeadFilter>
          <SidebarListHeadFilter>
            <Button
              style={{ width: '120px', height: '30px', fontSize: '14px', opacity: state.protestFilter === 'approved' ? 0.5 : 1 }}
              onClick={() => dispatch({ type: 'setProtestFilter', payload: { protestFilter: 'approved' } })}
            >
              מאושר
            </Button>
          </SidebarListHeadFilter>
        </SidebarListHeadFilters>
      </SidebarListHead>
      <SidebarList>
        {protests.map((protest) => (
          <Card
            onClick={() => {
              dispatch({ type: 'setCurrentProtest', payload: { currentProtest: protest } });
            }}
            key={protest.id}
          >
            <div>
              <strong>שם המקום</strong>: {protest.displayName ?? 'אין'}
            </div>
            <div>
              <strong>כתובת</strong>: {protest.streetAddress ?? 'אין'}
            </div>
            <div>
              <strong>שעת מפגש</strong>: {protest.meeting_time ?? 'אין'}
            </div>
          </Card>
        ))}
      </SidebarList>
    </SidebarWrapper>
  );
};

export default ProtestSidebar;
