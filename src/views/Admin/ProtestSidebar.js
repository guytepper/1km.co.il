import React, { useEffect, useState } from 'react';
import {
  Card,
  SidebarList,
  SidebarListHead,
  SidebarListHeadTitle,
  SidebarListHeadFilters,
  SidebarListHeadFilter,
  SidebarWrapper,
  Field,
} from './components';
import { PlacesAutocomplete } from '../../components';
import { fetchPendingProtests } from './AdminService';
import { fetchNearbyProtests } from '../../api';
import { dateToDayOfWeek, formatDate, getUpcomingDate } from '../../utils';

function getFormattedDate(date) {
  if (!date) {
    return null;
  }

  return `יום ${dateToDayOfWeek(date.date)} ${formatDate(date.date)} - ${date.time}`;
}

const ProtestSidebar = ({ state, dispatch }) => {
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    async function fetchData() {
      let payload = {};
      if (state.protestFilter === 'pending') {
        if (state.pendingProtests.length === 0) {
          const pendingProtests = await fetchPendingProtests();
          payload = { pendingProtests };
        }
      } else if (!coordinates) {
        if (state.approvedProtests.length > 0) {
          payload = { approvedProtests: [] };
        }
      } else {
        if (state.approvedProtests.length === 0) {
          const approvedProtests = await fetchNearbyProtests(coordinates);
          payload = { approvedProtests };
        }
      }
      dispatch({ type: 'setProtests', payload });
    }
    fetchData();
  }, [state.protestFilter, state.pendingProtests, state.approvedProtests, coordinates, dispatch]);

  const protests = state.protestFilter === 'pending' ? state.pendingProtests : state.approvedProtests;

  return (
    <SidebarWrapper>
      <SidebarListHead>
        <SidebarListHeadTitle>הפגנות</SidebarListHeadTitle>
        <PlacesAutocomplete setManualAddress={setCoordinates} />
        <SidebarListHeadFilters>
          <SidebarListHeadFilter
            style={{ width: '120px', height: '30px', fontSize: '14px', opacity: state.protestFilter === 'approved' ? 1 : 0.5 }}
            onClick={() => dispatch({ type: 'setProtestFilter', payload: { protestFilter: 'approved' } })}
          >
            מאושר
          </SidebarListHeadFilter>

          <SidebarListHeadFilter
            style={{ width: '120px', height: '30px', fontSize: '14px', opacity: state.protestFilter === 'pending' ? 1 : 0.5 }}
            onClick={() => dispatch({ type: 'setProtestFilter', payload: { protestFilter: 'pending' } })}
          >
            מחכה לאישור
          </SidebarListHeadFilter>
        </SidebarListHeadFilters>
      </SidebarListHead>
      <SidebarList>
        {protests.map((protest) => {
          const upcomingDate = getUpcomingDate(protest.dateTimeList);
          const formattedDate = getFormattedDate(upcomingDate);
          return (
            <Card
              active={protest.id === state.currentProtest?.id}
              onClick={() => {
                dispatch({ type: 'setCurrentProtest', payload: { currentProtest: protest } });
              }}
              key={protest.id}
            >
              <Field name="שם המקום" value={protest.displayName} />
              <Field name="כתובת" value={protest.streetAddress} />
              <Field name={formattedDate ? 'תאריך' : 'שעת מפגש'} value={formattedDate ?? protest.meeting_time} />
            </Card>
          );
        })}
      </SidebarList>
    </SidebarWrapper>
  );
};

export default ProtestSidebar;
