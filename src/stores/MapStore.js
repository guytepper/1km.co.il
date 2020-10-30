import { makeAutoObservable } from 'mobx';

class MapStore {
  rootStore = null;
  mapPosition = [];
  markers = [];
  mapPositionHistory = [];
  hoveredProtestId = null;

  constructor(rootStore) {
    makeAutoObservable(this, { rootStore: false });
    this.rootStore = rootStore;
  }

  addPositionHistory(position) {
    this.mapPositionHistory.push(position);
  }

  setMapPosition(position) {
    this.mapPosition = position;
    this.addPositionHistory(position);
  }

  setHoveredProtestId(protestId) {
    this.hoveredProtestId = protestId;
  }

  updateMarkers(protests) {
    // Filter duplicate markers
    const filteredMarkers = protests.filter((a) => !this.markers.find((b) => b.id === a.id));
    const updatedMarkers = [...this.markers, ...filteredMarkers];
    this.markers = updatedMarkers;
  }
}

export default MapStore;
