import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { useAuth } from '../../hooks';

const initialState = {
  currentUser: undefined,
  currentProtest: undefined,
};

export const Store = createContext(initialState);

const reducer = (state, action) => {
  switch (action.type) {
    case 'setCurrentUser':
      return { ...state, currentUser: action.payload.currentUser };
    case 'setCurrentProtest':
      return { ...state, currentProtest: action.payload.currentProtest };
    default:
      return state;
  }
};

export const AdminContextProvider = ({ children }) => {
  const authUser = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    dispatch({ type: 'setCurrentUser', payload: { currentUser: authUser } });
  }, [authUser]);

  return <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>;
};

export const useAdminContext = () => {
  const context = useContext(Store);
  if (!context) {
    throw new Error("Can't use this context outside of the Admin view");
  }
  return context;
};
