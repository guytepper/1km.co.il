import { makeAutoObservable } from 'mobx';
import { auth } from '../firebase';
import { getFullUserData, fetchProtest } from '../api';

class UserStore {
  rootStore = null;
  user = null;
  userCurrentProtest = null;

  constructor(rootStore) {
    makeAutoObservable(this, { rootStore: false });
    this.rootStore = rootStore;

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        let userData = await getFullUserData(user.uid);
        // On initial user creation getFullUserData returns underfined - so we update the user with partial details.
        // https://github.com/guytepper/1km.co.il/pull/114
        if (userData === undefined) {
          userData = { uid: user.uid, email: user.email };
        }
        this.user = userData;
      }
    });
  }

  setUserProtest = (protestId) => {
    this.userCurrentProtest = protestId;
  };
}

export default UserStore;
