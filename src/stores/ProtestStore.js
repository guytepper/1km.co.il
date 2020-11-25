import { runInAction, makeAutoObservable } from 'mobx';
import { fetchNearbyProtests } from '../api';

class ProtestStore {
  rootStore = null;
  nearbyProtests = [];
  state = 'pending';

  constructor(rootStore) {
    makeAutoObservable(this, { rootStore: false });
    this.rootStore = rootStore;
  }

  get closeProtests() {
    if (this.nearbyProtests.length > 0) {
      const closeList = this.nearbyProtests.filter((p) => p.distance < 2000).sort((p1, p2) => p1.distance - p2.distance);
      return closeList;

      // The following code will be used in times when need to push a protest up in the list
      // For example, during marches, we want the protest to be the first available even if
      // the protest location is not the closest to the user.

      // const marchProtest = this.nearbyProtests.find((p) => p.id === 'eoLv9Kb4x3sFBcAkcdMh');
      // if (marchProtest) {
      //   closeList.splice(closeList.indexOf(marchProtest), 1);
      //   closeList.unshift(marchProtest);
      // }
      // return closeList;
    }

    return [];
  }

  get farProtests() {
    if (this.nearbyProtests.length > 0) {
      return this.nearbyProtests.filter((p) => p.distance >= 2000).sort((p1, p2) => p1.distance - p2.distance);
    }
    return [];
  }

  async fetchProtests({ onlyMarkers, position }) {
    this.state = 'pending';

    try {
      const coordinates = position || this.rootStore.userCoordinates;
      if (coordinates?.length === 2) {
        const protests = await fetchNearbyProtests(coordinates);
        if (!onlyMarkers) {
          runInAction(() => {
            this.nearbyProtests = protests;
          });
        }

        this.rootStore.mapStore.updateMarkers(protests);
      }

      runInAction(() => {
        this.state = 'done';
      });
    } catch (e) {
      console.error(e);
      this.state = 'error';
    }
  }
}

export default ProtestStore;
