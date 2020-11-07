import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default function ProtectedRoute({ children, authorized, ...props }) {
  return <Route {...props}>{authorized ? children : <Redirect to={`/sign-up?returnUrl=${props.path}`} />}</Route>;
}
