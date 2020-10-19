import React, { useReducer } from 'react';
import { Button, ProtestForm } from '../../components';
import { FormWrapper } from './components';
import { archiveProtest, submitProtest, updateProtest } from './AdminService';
import ProtestSidebar from './ProtestSidebar';
import { isAdmin } from '../../utils';

const initialState = {
  currentProtest: undefined,
  pendingProtests: [],
  approvedProtests: [],
  protestFilter: 'approved',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setCurrentProtest':
      return { ...state, currentProtest: action.payload.currentProtest };
    case 'setProtests':
      return {
        ...state,
        pendingProtests: action.payload.pendingProtests ?? state.pendingProtests,
        approvedProtests: action.payload.approvedProtests ?? state.approvedProtests,
        currentProtest: action.payload.currentProtest ?? state.currentProtest,
      };
    case 'setProtestFilter': {
      return { ...state, protestFilter: action.payload.protestFilter, currentProtest: undefined };
    }
    default:
      return state;
  }
};

const ProtestAdmin = ({ user }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <ProtestSidebar state={state} dispatch={dispatch} />
      <FormWrapper>
        <ProtestForm
          initialCoords={state.currentProtest?.coordinates ?? {}}
          submitCallback={(params) => {
            // If the protest already exists in the `protests` collection, we just need to archive the pending one.
            if (params.protestRef) {
              // First, update the published protest in case it was changed.
              const updateAndArchive = new Promise((resolve, reject) => {
                updateProtest({
                  params,
                  protestId: params.protestRef,
                }).then(() => {
                  archiveProtest({
                    protestId: state.currentProtest.id,
                    type: 'pending',
                    archiveCallback: () => {
                      dispatch({
                        type: 'setProtests',
                        payload: {
                          pendingProtests: state.pendingProtests.filter((protest) => protest.id !== state.currentProtest.id),
                          currentProtest: state.pendingProtests.filter((protest) => protest.id !== state.currentProtest.id)[0],
                        },
                      });
                    },
                  })
                    .then((protest) => resolve(protest))
                    .catch((err) => reject(err));
                });
              });
              return updateAndArchive;
            }
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
          isAdmin={isAdmin(user)}
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
