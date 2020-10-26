import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores';
import { createProtest } from '../api';
import { ProtestForm } from '../components';

function AddProtest({ user }) {
  const store = useStore();

  return (
    <ProtestForm
      initialCoords={store.userCoordinates}
      submitCallback={async (params) => {
        const result = await createProtest({ ...params, user });
        return result;
      }}
    />
  );
}

export default observer(AddProtest);
