import { makeAutoObservable, runInAction } from 'mobx';
import { auth } from '../firebase';
import { setLocalStorage, getLocalStorage } from '../localStorage';
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

    this.checkCache();
  }

  checkCache() {
    const userProtest = getLocalStorage('1km_current_protest');
    if (userProtest) {
      runInAction(() => {
        this.userCurrentProtest = userProtest;
      });
    }
  }

  setUserProtestById = async (protestId) => {
    let protest = null;
    if (this.rootStore.protestStore.nearbyProtests.length > 0) {
      protest = this.rootStore.protestStore.nearbyProtests.find((p) => p.id === protestId);
    }

    if (!protest) {
      protest = await fetchProtest(protestId);
    }

    if (protest) {
      this.userCurrentProtest = protest;
      setLocalStorage('1km_current_protest', protest);
    } else {
      console.error('An erorr occured: Could not find protest.');
    }
  };

  setUserProtest = (protest) => {
    this.userCurrentProtest = protest;
    setLocalStorage('1km_current_protest', protest);
  };

  setUserName = (firstName = '', lastName = '') => {
    this.user.firstName = firstName;
    this.user.lastName = lastName;
  };

  setUserPicture = (pictureUrl = '') => {
    this.user.pictureUrl = pictureUrl;
  };
}

export default UserStore;
