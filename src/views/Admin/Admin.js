import React from 'react';
import { Link, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { Button, ProtestForm } from '../../components';
import { signInWithGoogle } from '../../firebase';
import { AdminWrapper, ProtestFormWrapper, AdminNavigation } from './components';
import { useAdminContext } from './Context';
import { archiveProtest } from './utils';
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
              <ProtestFormWrapper>
                <ProtestForm
                  initialCoords={state.currentProtest?.coordinates ?? {}}
                  submitCallback={() => {}}
                  defaultValues={state.currentProtest}
                  editMode={state.protestFilter}
                />
                <Button
                  onClick={() => archiveProtest(state.currentProtest.id, () => history.go(0))}
                  color="tomato"
                  disabled={!state.currentProtest}
                >
                  מחיקת הפגנה
                </Button>
              </ProtestFormWrapper>
            </Route>
            <Route path="/admin/leader-requests">
              <LeaderSidebar />
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
