import React from 'react';
import LeaderSidebar from './LeaderSidebar';
import { fetchProtest } from '../../api';
import { Button } from '../../components';
import { useAdminContext } from './Context';
import { FormWrapper, LeaderPhoto, Field } from './components';

const LeaderAdmin = () => {
  const { state, dispatch } = useAdminContext();

//   useEffect(() => {

//   }, [state.currentLeaderRequest]);

  return (
    <>
      <LeaderSidebar />
      {state.currentLeaderRequest ? (
        <FormWrapper>
          <LeaderPhoto style={{ width: '120px', height: '120px' }} src={state.currentLeaderRequest.user.picture_url} />
          <Field name="שם" value={state.currentLeaderRequest.user.displayName} />
          <Field name="מספר טלפון" value={state.currentLeaderRequest.user.phoneNumber} />
          <Field name="אימייל" value={state.currentLeaderRequest.user.email} />
          <Field name="protestId" value={state.currentLeaderRequest.user.email} />
          <Button onClick={() => alert(`הבקשה אושרה בהצלחה!`)} color="#1ED96E" disabled={!state.currentLeaderRequest}>
            אישור בקשה
          </Button>
        </FormWrapper>
      ) : null}
    </>
  );
};

export default LeaderAdmin;
