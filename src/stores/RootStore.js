import { makeAutoObservable } from 'mobx';
import { setLocalStorage, getLocalStorage } from '../localStorage';

class RootStore {
  userCoordinates = [];
  counter = 1;

  constructor() {
    makeAutoObservable(this);
    this.checkCache();
  }

  checkCache() {
    const cachedCoordinates = getLocalStorage('1km_user_coordinates');
    if (cachedCoordinates) {
      this.setCoordinates(cachedCoordinates);
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
