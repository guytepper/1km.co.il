import { makeAutoObservable } from 'mobx';

class RootStore {
  userCoordinates = [];
  counter = 1;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Updates the current user coordinates.
   * @param {array} coordinates - Array of [lat, lng]
   */
  updateCoordinates(coordinates) {
    this.userCoordinates = coordinates;
  }
}

export default RootStore;
