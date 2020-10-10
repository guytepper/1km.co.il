import isPointWithinRadius from 'geolib/es/isPointWithinRadius';
import getDistance from 'geolib/es/getDistance';

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
  if (!coords || coords.length !== 2) return false;
  const [latitude, longitude] = coords;
  // Check latitude value
  if (!Number.isFinite(latitude) || latitude > 90 || latitude < -90) return false;

  // Check longitude value
  if (!Number.isFinite(longitude) || longitude > 180 || longitude < -180) return false;

  return true;
}

export function pointWithinRadius(point1, point2, radius) {
  return isPointWithinRadius(
    { latitude: point1[0], longitude: point1[1] },
    { latitude: point2[0], longitude: point2[1] },
    radius
  );
}

/**
 * Calculate distance between 2 points.
 * @param {array} pointA - array of [lat, lng]
 * @param {array} pointB - array of [lat, lng]
 * @returns The distance in meters as a numeric value.
 */
export function calculateDistance(pointA, pointB) {
  return getDistance(pointA, pointB);
}

export function formatDistance(distance) {
  if (distance > 1000) {
    return `${(distance / 1000).toFixed(1)} ק"מ ממיקומך`;
  } else {
    return `${distance} מטר ממיקומך`;
  }
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

export function dateToDayOfWeek(dateStr) {
  const daysOfWeek = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const date = new Date(dateStr);

  return daysOfWeek[date.getDay()];
}

export function sortDateTimeList(dateTimeList) {
  if (!dateTimeList) {
    return null;
  }
  return dateTimeList.sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function getUpcomingDate(dateTimeList) {
  if (!dateTimeList) {
    return null;
  }
  return sortDateTimeList(dateTimeList).filter((dateTimeList) => new Date(dateTimeList.date) >= new Date())[0];
}

export const isLeader = (user, protest) => protest?.roles?.leader?.includes(user?.uid);
export const isAdmin = (user) => user?.admin === true;
export const isVisitor = (user) => user === 'visitor';
export const isAuthenticated = (user) => user?.uid;
