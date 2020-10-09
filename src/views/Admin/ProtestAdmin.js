import React, { useReducer } from 'react';
import { Button, ProtestForm } from '../../components';
import { FormWrapper } from './components';
import { archiveProtest, submitProtest, updateProtest } from './utils';
import ProtestSidebar from './ProtestSidebar';

const initialState = {
  currentProtest: undefined,
  pendingProtests: [],
  approvedProtests: [],
  protestFilter: 'pending',
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

const ProtestAdmin = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <ProtestSidebar state={state} dispatch={dispatch} />
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
