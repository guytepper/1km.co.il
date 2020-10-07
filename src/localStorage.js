export const getUserCoordinatesFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('ONE_KM_user_coordinates'));
};

export const setUserCoordinatesToLocalStorage = (coords) => {
  localStorage.setItem('ONE_KM_user_coordinates', JSON.stringify(coords));
};
