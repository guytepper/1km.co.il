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
    return this.nearbyProtests.filter((p) => p.distance < 2000).sort((p1, p2) => p1.distance - p2.distance) || [];
  }

  get farProtests() {
    return this.nearbyProtests.filter((p) => p.distance >= 2000).sort((p1, p2) => p1.distance - p2.distance);
  }

  async fetchProtests({ onlyMarkers, position }) {
    this.state = 'pending';

    try {
      const protests = await fetchNearbyProtests(position || this.rootStore.userCoordinates);
      if (!onlyMarkers) {
        runInAction(() => {
          this.nearbyProtests = protests;
        });
      }

      this.rootStore.mapStore.updateMarkers(protests);
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
