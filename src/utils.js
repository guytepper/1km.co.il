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

export function pointWithinRadius(point1, point2, radius) {
  return isPointWithinRadius(
    { latitude: point1[0], longitude: point1[1] },
    { latitude: point2[0], longitude: point2[1] },
    radius
  );
}
