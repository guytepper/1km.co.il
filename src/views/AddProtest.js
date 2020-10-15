import React, { useRef } from 'react';
import { createProtest, makeUserProtestLeader } from '../api';
import { ProtestForm } from '../components';

export default function AddProtest({ initialCoords, user }) {
  const protestId = useRef();
  return (
    <ProtestForm
      initialCoords={initialCoords}
      submitCallback={async (params) => {
        const result = await createProtest(params);
        // Save id for later use
        protestId.current = result?.id;

        return result;
      }}
      afterSubmitCallback={() => {
        makeUserProtestLeader(protestId.current, user.uid);
      }}
    />
  );
}
