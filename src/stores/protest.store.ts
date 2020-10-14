import { makeObservable, observable, computed, action, set } from 'mobx';

class ProtestStore {
  protests = {};

  constructor() {
    makeObservable(this,{
      protests: observable,
      setProtests: action,
      protestsByDistance: computed,
    });
  }

  setProtests(protests) {
    set(this.protests, protests)
  }
}

export const protestStore = new ProtestStore();
