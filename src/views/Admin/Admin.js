import React from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { Button } from '../../components';
import { signInWithGoogle } from '../../firebase';
import { AdminWrapper, AdminNavigation } from './components';
import { useAdminContext } from './Context';
import LeaderAdmin from './LeaderAdmin';
import ProtestAdmin from './ProtestAdmin';

const Admin = () => {
  const { state, dispatch } = useAdminContext();
  const history = useHistory();
  const location = useLocation();

  if (['/admin/', '/admin'].includes(location.pathname)) {
    history.replace('/admin/protest-requests');
  }

  return (
    <AdminWrapper>
      {state.currentUser === undefined ? (
        <div>טוען...</div>
      ) : state.currentUser ? (
        <>
          <Switch>
            <Route path="/admin/protest-requests">
              <ProtestAdmin />
            </Route>
            <Route path="/admin/leader-requests">
              <LeaderAdmin />
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
