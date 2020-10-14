import { makeObservable, observable, computed, action, set } from 'mobx';
import { sortBy } from '../utils';

class ProtestStore {
  protests = {};

  constructor() {
    makeObservable(this, {
      protests: observable,
      setProtests: action,
      protestsByDistance: computed,
      protestArray: computed,
    });
  }

  setProtests(protests) {
    set(this.protests, protests);
  }

  get protestArray() {
    return Object.values(this.protests);
  }

  get protestsByDistance() {
    const byDistance = this.protestArray.reduce(
      (result, protest) => {
        if (protest.distance <= 1000) {
          result.close.push(protest);
        } else {
          result.far.push(protest);
        }
        return result;
      },
      { close: [], far: [] }
    );

    return {
      close: sortBy(byDistance.close, 'distance'),
      far: sortBy(byDistance.far, 'distance'),
    };
  }
}

export const protestStore = new ProtestStore();
