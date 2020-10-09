import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { useAuth } from '../../hooks';

const initialState = {
  currentUser: undefined,
  currentProtest: undefined,
  pendingProtests: [],
  approvedProtests: [],
  protestFilter: 'pending',
  currentLeaderRequest: undefined,
  leaderRequests: [],
};

export const Store = createContext(initialState);

const reducer = (state, action) => {
  switch (action.type) {
    case 'setCurrentUser':
      return { ...state, currentUser: action.payload.currentUser };
    case 'setCurrentProtest':
      return { ...state, currentProtest: action.payload.currentProtest };
    case 'setProtests':
      return {
        ...state,
        pendingProtests: action.payload.pendingProtests ?? state.pendingProtests,
        approvedProtests: action.payload.approvedProtests ?? state.approvedProtests,
        currentProtest: action.payload.currentProtest ?? state.currentProtest,
      };
    case 'setCurrentLeaderRequest':
      return { ...state, currentLeaderRequest: action.payload.currentLeaderRequest };
    case 'setLeaderRequests':
      return { ...state, leaderRequests: action.payload.LeaderRequests };
    case 'setProtestFilter': {
      return { ...state, protestFilter: action.payload.protestFilter, currentProtest: undefined };
    }
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
