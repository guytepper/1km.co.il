import React, { useEffect, useState } from 'react';
import {
  Card,
  ProtestsList,
  ProtestsListHead,
  ProtestsListHeadTitle,
  ProtestsListHeadFilters,
  ProtestsListHeadFilter,
  ProtestSidebarWrapper,
} from './components';
import { PlacesAutocomplete } from '../../components';
import { useAdminContext } from './Context';
import useProtests from './useProtests';
import getDistance from 'geolib/es/getDistance';

const ProtestSidebar = () => {
  const { dispatch } = useAdminContext();
  const [protestFilter, setProtestFilter] = useState('pending');
  const { pendingProtests, approvedProtests } = useProtests();
  const [coordinates, setCoordinates] = useState(null);
  const [protests, setProtests] = useState([]);

  useEffect(() => {
    // if (protestFilter === 'approved' && !coordinates) {
    //   setProtests([]);
    //   return;
    // }

    let filteredProtests = protestFilter === 'pending' ? pendingProtests : approvedProtests;

    if (coordinates?.length === 2) {
      filteredProtests = filteredProtests
        .filter((p) => getDistance(coordinates, p.latlng) <= 2000)
        .sort((p1, p2) => getDistance(coordinates, p1.latlng) - getDistance(coordinates, p2.latlng));
    }
    setProtests(filteredProtests);
  }, [protestFilter, pendingProtests, approvedProtests, coordinates]);

  return (
    <ProtestSidebarWrapper>
      <ProtestsListHead>
        <ProtestsListHeadTitle>הפגנות</ProtestsListHeadTitle>
        <PlacesAutocomplete setManualAddress={setCoordinates} />
        <ProtestsListHeadFilters>
          <ProtestsListHeadFilter>
            <input
              type="radio"
              id="protest-filter-pending"
              name="protest-filter"
              value="pending"
              checked={protestFilter === 'pending'}
              onChange={() => setProtestFilter('pending')}
            />
            <label htmlFor="protest-filter-pending">מחכה לאישור</label>
          </ProtestsListHeadFilter>
          <ProtestsListHeadFilter>
            <input
              type="radio"
              id="protest-filter-approved"
              name="protest-filter"
              value="approved"
              checked={protestFilter === 'approved'}
              onChange={() => setProtestFilter('approved')}
            />
            <label htmlFor="protest-filter-approved">מאושר</label>
          </ProtestsListHeadFilter>
        </ProtestsListHeadFilters>
      </ProtestsListHead>
      <ProtestsList>
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
      </ProtestsList>
    </ProtestSidebarWrapper>
  );
};

export default ProtestSidebar;
