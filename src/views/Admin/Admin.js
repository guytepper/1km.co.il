import React from 'react';
import { Button } from '../../components';
import { signInWithGoogle } from '../../firebase';
import { AdminWrapper } from './components';
import { useAdminContext } from './Context';
import ProtestSidebar from './ProtestSidebar';

const Admin = () => {
  const { state, dispatch } = useAdminContext();

  return (
    <AdminWrapper>
      {state.currentUser === undefined ? (
        <div>טוען...</div>
      ) : state.currentUser ? (
        <>
          <ProtestSidebar />
          {JSON.stringify(state.currentProtest, null, 2)}
        </>
      ) : (
        <Button onClick={signInWithGoogle}>התחבר למערכת</Button>
      )}
    </AdminWrapper>
  );
};

export default Admin;
