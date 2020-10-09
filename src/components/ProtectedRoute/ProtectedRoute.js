import React from 'react';
import { Route } from 'react-router-dom';

export default function ProtectedRoute({ children, authorized, ...props }) {
  return <Route {...props}>{authorized ? children : null}</Route>;
}
