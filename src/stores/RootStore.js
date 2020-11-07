import { makeAutoObservable, runInAction } from 'mobx';
import { setLocalStorage, getLocalStorage } from '../localStorage';
import ProtestStore from './ProtestStore';
import MapStore from './MapStore';
import LiveStore from './LiveStore';
import userStore from './UserStore';

class RootStore {
  userCoordinates = [];
  currentPageTitle = 'קילומטר אחד';

  constructor() {
    makeAutoObservable(this);
    this.userStore = new userStore(this);
    this.protestStore = new ProtestStore(this);
    this.mapStore = new MapStore(this);
    this.liveStore = new LiveStore(this);
    this.checkCache();
  }

  checkCache() {
    const cachedCoordinates = getLocalStorage('1km_user_coordinates');
    if (cachedCoordinates) {
      runInAction(() => {
        this.userCoordinates = cachedCoordinates;
      });
    }
  }

  /**
   * Updates the current user coordinates.
   * @param {array} coordinates - Array of [lat, lng]
   */
  setCoordinates = (coordinates) => {
    setLocalStorage('1km_user_coordinates', coordinates);
    this.userCoordinates = coordinates;
  };

  setCurrentPageTitle(title) {
    let pageTitle = title;
    const hyphenIndex = title.indexOf(' -');

    if (hyphenIndex > 0) {
      pageTitle = title.substr(0, hyphenIndex);
    }

    this.currentPageTitle = pageTitle;
  }
}

export default RootStore;
