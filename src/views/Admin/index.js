/**
 * This is an admin dashboard for approving protests.
 * It was made quickly to deal with the mass pending protests amounts, so it's quiet a mess right now.
 * Once we'll deal with the work overload we can work on improving it.
 */

import React from 'react';
import { AdminContextProvider } from './Context';
import Admin from './Admin';

function AdminWrapper() {
  return (
    <AdminContextProvider>
      <Admin />
    </AdminContextProvider>
  );
}

export default AdminWrapper;
