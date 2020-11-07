import { makeAutoObservable, runInAction } from 'mobx';
import { realtimeDB } from '../firebase';

class LiveStore {
  rootStore = null;
  entries = [];

  constructor(rootStore) {
    makeAutoObservable(this, { rootStore: false });
    this.rootStore = rootStore;
  }

  fetchEntries({ offset }) {
    const livePictures = realtimeDB.ref('live_feed').orderByChild('createdAt').limitToLast(10);

    livePictures.once('value', (dataSnapshot) => {
      runInAction(() => {
        this.entries = Object.values(dataSnapshot.val()).reverse();
      });
    });
  }
}

export default LiveStore;
