import React from 'react';
import { createPendingProtest } from '../api';
import { ProtestForm } from '../components';

export default function AddProtest({ initialCoords }) {
  return <ProtestForm initialCoords={initialCoords} submitCallback={createPendingProtest} />;
}
