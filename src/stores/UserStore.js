import { makeAutoObservable } from 'mobx';
import { auth } from '../firebase';

class UserStore {
  rootStore = null;
  user = null;
  userCurrentProtest = null;

  constructor(rootStore) {
    makeAutoObservable(this, { rootStore: false });
    this.rootStore = rootStore;
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  setUserProtest = (protestId) => {
    this.userCurrentProtest = protestId;
  };
}

export default UserStore;
