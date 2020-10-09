import React from 'react';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { Button } from '../../components';
import { signInWithGoogle } from '../../firebase';
import { AdminWrapper, AdminNavigation } from './components';
import LeaderAdmin from './LeaderAdmin';
import ProtestAdmin from './ProtestAdmin';
import { handleSignIn } from '../../api';
import { isAdmin } from '../../utils';

const Admin = ({ user }) => {
  const history = useHistory();
  const location = useLocation();

  return (
    <AdminWrapper>
      {user === undefined ? (
        <div>טוען...</div>
      ) : user ? (
        <>
          <Switch>
            {!isAdmin(user) && <Redirect to="/" />}
            <Route exact path="/admin">
              <Redirect to="/admin/protest-requests" />
            </Route>
            <Route path="/admin/protest-requests">
              <ProtestAdmin />
            </Route>
            <Route path="/admin/leader-requests/:leaderId?">
              <LeaderAdmin />
            </Route>
          </Switch>
          {['/admin/protest-requests/', '/admin/protest-requests'].includes(location.pathname) ? (
            <AdminNavigation to="/admin/leader-requests" style={{ height: 'min-content' }}>
              <Button style={{ width: '140px', height: '35px', fontSize: '14px' }}>אישור מובילים</Button>
            </AdminNavigation>
          ) : (
            <AdminNavigation to="/admin/protest-requests">
              <Button style={{ width: '140px', height: '35px', fontSize: '14px' }}>אישור הפגנות</Button>
            </AdminNavigation>
          )}
        </>
      ) : (
        <Button onClick={handleSignIn}>התחבר למערכת</Button>
      )}
    </AdminWrapper>
  );
};

export default Admin;
