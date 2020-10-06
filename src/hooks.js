import { useEffect, useState } from 'react';
import firebase from './firebase';

export function useAuth() {
  const [user, setUser] = useState(undefined);
  // const fireUser = firebase.auth().currentUser;

  useEffect(() => {
    const unsub = firebase.auth().onAuthStateChanged((user) => {
      user ? setUser(user) : setUser(null);
    });
    return () => {
      unsub();
    };
  });
  return user;
}
