import React, { useReducer, useEffect } from 'react';
import LeaderSidebar from './LeaderSidebar';
import { fetchProtest, assignRoleOnProtest } from '../../api';
import { Button, ProtestCard } from '../../components';
import { FormWrapper, LeaderPhoto, Field, LeaderCard } from './components';
import { useParams, useHistory } from 'react-router-dom';

const initialState = {
  currentLeaderRequest: undefined,
  leaderRequests: [],
  protestData: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setCurrentLeaderRequest':
      return { ...state, currentLeaderRequest: action.payload.currentLeaderRequest };
    case 'setLeaderRequests':
      return { ...state, leaderRequests: action.payload.leaderRequests };
    case 'setProtestData':
      return { ...state, protestData: action.payload.protestData };
    case 'setInitialData':
      return { ...state, currentLeaderRequest: action.payload.currentLeaderRequest, protestData: action.payload.protestData };
    default:
      return state;
  }
};

const LeaderAdmin = ({ user }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { leaderId } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (leaderId) {
      const currentLeaderRequest = state.leaderRequests.find((request) => request.id === leaderId);
      if (!currentLeaderRequest) return;
      const fetchProtestData = async () => {
        const protestData = await fetchProtest(currentLeaderRequest.protestId);
        dispatch({ type: 'setInitialData', payload: { protestData, currentLeaderRequest } });
      };
      fetchProtestData();
    }
  }, [leaderId, state.leaderRequests, state.currentLeaderRequest]);

  const handleStatusChange = (status) => async () => {
    const {
      protestId,
      id: requestId,
      user: { uid: userId },
    } = state.currentLeaderRequest;
    try {
      await assignRoleOnProtest({ userId, protestId, requestId, status, adminId: user.uid });
      const filteredLeaderRequests = state.leaderRequests.filter((request) => request.id !== requestId);
      dispatch({
        type: 'setLeaderRequests',
        payload: { leaderRequests: filteredLeaderRequests },
      });
      dispatch({ type: 'setInitialData', payload: { protestData: {}, currentLeaderRequest: undefined } });
      alert('סטטוס עודכן בהצלחה!');
      history.replace('/admin/leader-requests');
    } catch (err) {
      console.err(err);
      alert('בעיה בשינוי הסטטוס');
    }
  };

  return (
    <>
      <LeaderSidebar state={state} dispatch={dispatch} />
      <FormWrapper>
        {state.currentLeaderRequest ? (
          <LeaderCard>
            <LeaderPhoto
              style={{ width: '120px', height: '120px' }}
              src={state.currentLeaderRequest.user.pictureUrl || '/anonymousPofile.png'}
            />
            <div>
              <Field name="שם" value={state.currentLeaderRequest.user.displayName} />
              <Field name="מספר טלפון" value={state.currentLeaderRequest.user.phoneNumber} />
              <Field name="אימייל" value={state.currentLeaderRequest.user.email} />
            </div>
            <ProtestCard
              protestInfo={state.protestData}
              showAction={false}
              style={{ boxShadow: '0 1px 10px 1px rgba(80, 80, 82, 0.25)' }}
            />
            <Button onClick={handleStatusChange('approved')} color="#1ED96E" disabled={!state.currentLeaderRequest}>
              אישור בקשה
            </Button>
            <Button onClick={handleStatusChange('rejected')} color="tomato" disabled={!state.currentLeaderRequest}>
              דחיית בקשה
            </Button>
          </LeaderCard>
        ) : (
          <div style={{ alignSelf: 'center' }}>יש לבחור בקשה</div>
        )}
      </FormWrapper>
    </>
  );
};

export default LeaderAdmin;
