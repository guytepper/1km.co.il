import React from 'react';
import { Link, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { Button, ProtestForm } from '../../components';
import { signInWithGoogle } from '../../firebase';
import { AdminWrapper, FormWrapper, AdminNavigation, LeaderPhoto, CardField } from './components';
import { useAdminContext } from './Context';
import { archivePendingProtest, submitProtest, updateProtest } from './utils';
import ProtestSidebar from './ProtestSidebar';
import LeaderSidebar from './LeaderSidebar';

const Admin = () => {
  const { state, dispatch } = useAdminContext();
  const history = useHistory();
  const location = useLocation();

  if (['/admin/', '/admin'].includes(location.pathname)) history.replace('/admin/protest-requests');

  return (
    <AdminWrapper>
      {state.currentUser === undefined ? (
        <div>טוען...</div>
      ) : state.currentUser ? (
        <>
          <Switch>
            <Route path="/admin/protest-requests">
              <ProtestSidebar />
              <FormWrapper>
                <ProtestForm
                  initialCoords={state.currentProtest?.coordinates ?? {}}
                  submitCallback={(params) => {
                    if (state.protestFilter === 'pending') {
                      return submitProtest({
                        params,
                        protestId: state.currentProtest.id,
                        submitCallback: () => history.go(0),
                      });
                    } else {
                      return updateProtest({
                        params,
                        protestId: state.currentProtest.id,
                        updateCallback: () => history.go(0),
                      });
                    }
                  }}
                  defaultValues={state.currentProtest}
                  editMode={state.protestFilter}
                />
                <Button
                  onClick={() => archivePendingProtest(state.currentProtest.id, () => history.go(0))}
                  color="tomato"
                  disabled={!state.currentProtest}
                >
                  מחיקת הפגנה
                </Button>
              </FormWrapper>
            </Route>
            <Route path="/admin/leader-requests">
              <LeaderSidebar />
              {state.currentLeaderRequest ? (
                <FormWrapper>
                  <LeaderPhoto style={{ width: '120px', height: '120px' }} src={state.currentLeaderRequest.user.picture_url} />
                  <CardField name="שם" value={state.currentLeaderRequest.user.displayName} />
                  <CardField name="מספר טלפון" value={state.currentLeaderRequest.user.phoneNumber} />
                  <CardField name="אימייל" value={state.currentLeaderRequest.user.email} />
                </FormWrapper>
              ) : null}
            </Route>
          </Switch>
          {['/admin/leader-requests/', '/admin/leader-requests'].includes(location.pathname) ? (
            <AdminNavigation to="/admin/protest-requests">
              <Button style={{ width: '140px', height: '35px', fontSize: '14px' }}>אישור הפגנות</Button>
            </AdminNavigation>
          ) : (
            <AdminNavigation to="/admin/leader-requests" style={{ height: 'min-content' }}>
              <Button style={{ width: '140px', height: '35px', fontSize: '14px' }}>אישור מובילים</Button>
            </AdminNavigation>
          )}
        </>
      ) : (
        <Button onClick={signInWithGoogle}>התחבר למערכת</Button>
      )}
    </AdminWrapper>
  );
};

export default Admin;
