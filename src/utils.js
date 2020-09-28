import isPointWithinRadius from 'geolib/es/isPointWithinRadius';

export function pointWithinRadius(point1, point2, radius) {
  console.log(point1, point2);
  return isPointWithinRadius(
    { latitude: point1[0], longitude: point1[1] },
    { latitude: point2[0], longitude: point2[1] },
    radius
  );
}
