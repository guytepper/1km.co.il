import { makeAutoObservable, runInAction } from 'mobx';
import { setLocalStorage, getLocalStorage } from '../localStorage';
import ProtestStore from './ProtestStore';
import MapStore from './MapStore';
import userStore from './UserStore';

class RootStore {
  userCoordinates = [];

  constructor() {
    makeAutoObservable(this);
    this.userStore = new userStore(this);
    this.protestStore = new ProtestStore(this);
    this.mapStore = new MapStore(this);
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
  setCoordinates(coordinates) {
    setLocalStorage('1km_user_coordinates', coordinates);
    this.userCoordinates = coordinates;
  }
}

export default RootStore;
