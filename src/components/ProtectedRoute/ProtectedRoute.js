import React from 'react';
import { Route } from 'react-router-dom';
import { isAdmin } from '../../utils';

export default function ProtectedRoute({ children, user, ...props }) {
  return <Route {...props}>{isAdmin(user) ? children : null}</Route>;
}
