import React from 'react';
import { Link, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { Button, ProtestForm } from '../../components';
import { signInWithGoogle } from '../../firebase';
import { AdminWrapper, FormWrapper, AdminNavigation, LeaderPhoto, Field } from './components';
import { useAdminContext } from './Context';
import { archiveProtest, submitProtest, updateProtest } from './utils';
import ProtestSidebar from './ProtestSidebar';
import LeaderSidebar from './LeaderSidebar';

const Admin = () => {
  const { state, dispatch } = useAdminContext();
  const history = useHistory();
  const location = useLocation();

  if (['/admin/', '/admin'].includes(location.pathname)) history.replace('/admin/protest-requests');

  return (
    <AdminWrapper>
      {state.currentUser === undefined ? (
        <div>טוען...</div>
      ) : state.currentUser ? (
        <>
          <Switch>
            <Route path="/admin/protest-requests">
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
                              currentProtest: state.pendingProtests.filter(
                                (protest) => protest.id !== state.currentProtest.id
                              )[0],
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
                              approvedProtests: state.approvedProtests.map((protest) =>
                                protest.id === updated.id ? updated : protest
                              ),
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
            </Route>
            <Route path="/admin/leader-requests">
              <LeaderSidebar />
              {state.currentLeaderRequest ? (
                <FormWrapper>
                  <LeaderPhoto style={{ width: '120px', height: '120px' }} src={state.currentLeaderRequest.user.picture_url} />
                  <Field name="שם" value={state.currentLeaderRequest.user.displayName} />
                  <Field name="מספר טלפון" value={state.currentLeaderRequest.user.phoneNumber} />
                  <Field name="אימייל" value={state.currentLeaderRequest.user.email} />
                  <Button onClick={() => alert(`הבקשה אושרה בהצלחה!`)} color="#1ED96E" disabled={!state.currentLeaderRequest}>
                    אישור בקשה
                  </Button>
                </FormWrapper>
              ) : null}
            </Route>
          </Switch>
          {['/admin/leader-requests/', '/admin/leader-requests'].includes(location.pathname) ? (
            <AdminNavigation to="/admin/protest-requests">
              <Button style={{ width: '140px', height: '35px', fontSize: '14px' }}>אישור הפגנות</Button>
            </AdminNavigation>
          ) : (
            <AdminNavigation to="/admin/leader-requests" style={{ height: 'min-content' }}>
              <Button style={{ width: '140px', height: '35px', fontSize: '14px' }}>אישור מובילים</Button>
            </AdminNavigation>
          )}
        </>
      ) : (
        <Button onClick={signInWithGoogle}>התחבר למערכת</Button>
      )}
    </AdminWrapper>
  );
};

export default Admin;
