import React from 'react';
import { createProtest } from '../api';
import { ProtestForm } from '../components';

export default function AddProtest({ initialCoords, user }) {
  return (
    <ProtestForm
      initialCoords={initialCoords}
      submitCallback={async (params) => {
        const result = await createProtest({ ...params, user });
        return result;
      }}
    />
  );
}
