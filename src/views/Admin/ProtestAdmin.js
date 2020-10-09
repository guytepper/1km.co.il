import React from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { Button, ProtestForm } from '../../components';
import { signInWithGoogle } from '../../firebase';
import { AdminWrapper, FormWrapper, AdminNavigation, LeaderPhoto, Field } from './components';
import { useAdminContext } from './Context';
import { archiveProtest, submitProtest, updateProtest } from './utils';
import ProtestSidebar from './ProtestSidebar';
import LeaderAdmin from './LeaderAdmin';
import LeaderSidebar from './LeaderSidebar';

const ProtestAdmin = () => {
  const { state, dispatch } = useAdminContext();

  return (
    <>
      <ProtestSidebar />
      <FormWrapper>
        <ProtestForm
          initialCoords={state.currentProtest?.coordinates ?? {}}
          submitCallback={(params) => {
            if (state.protestFilter === 'pending') {
              return submitProtest({
                params,
                protestId: state.currentProtest.id,
                submitCallback: () => {
                  dispatch({
                    type: 'setProtests',
                    payload: {
                      pendingProtests: state.pendingProtests.filter((protest) => protest.id !== state.currentProtest.id),
                      currentProtest: state.pendingProtests.filter((protest) => protest.id !== state.currentProtest.id)[0],
                    },
                  });
                  alert(`ההפגנה נוצרה בהצלחה!`);
                },
              });
            } else {
              return updateProtest({
                params,
                protestId: state.currentProtest.id,
                updateCallback: (updated) => {
                  dispatch({
                    type: 'setProtests',
                    payload: {
                      approvedProtests: state.approvedProtests.map((protest) => (protest.id === updated.id ? updated : protest)),
                    },
                  });
                  alert(`ההפגנה עודכנה בהצלחה!`);
                },
              });
            }
          }}
          defaultValues={state.currentProtest}
          editMode={state.protestFilter}
        />
        <Button
          onClick={() =>
            archiveProtest({
              protestId: state.currentProtest.id,
              type: state.protestFilter,
              archiveCallback: () => {
                dispatch({
                  type: 'setProtests',
                  payload: {
                    [`${state.protestFilter}Protests`]: state[`${state.protestFilter}Protests`].filter(
                      (protest) => protest.id !== state.currentProtest.id
                    ),
                    currentProtest: state[`${state.protestFilter}Protests`].filter(
                      (protest) => protest.id !== state.currentProtest.id
                    )[0],
                  },
                });

                alert(`ההפגנה נמחקה בהצלחה!`);
              },
            })
          }
          color="tomato"
          disabled={!state.currentProtest}
        >
          מחיקת הפגנה
        </Button>
      </FormWrapper>
    </>
  );
};

export default ProtestAdmin;
