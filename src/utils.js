import isPointWithinRadius from 'geolib/es/isPointWithinRadius';

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (event) => {
        resolve([event.coords.latitude, event.coords.longitude]);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

export function validateLatLng(coords) {
  if (coords.length !== 2) return false;
  const [latitude, longitude] = coords;
  // Check latitude value
  if (!Number.isFinite(latitude) || latitude > 90 || latitude < -90) return false;

  // Check longitude value
  if (!Number.isFinite(longitude) || longitude > 180 || longitude < -180) return false;

  return true;
}

export function doUserCoordinatesEqualMapPosition(userCoordinates, mapPosition) {
  return userCoordinates[0] === mapPosition[0] && userCoordinates[1] === mapPosition[1];
}

export function pointWithinRadius(point1, point2, radius) {
  return isPointWithinRadius(
    { latitude: point1[0], longitude: point1[1] },
    { latitude: point2[0], longitude: point2[1] },
    radius
  );
}
