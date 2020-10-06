export const getUserCoordinatesFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('user_coordinates'));
}

export const setUserCoordinatesToLocalStorage = (coords) => {
    localStorage.setItem('user_coordinates', JSON.stringify(coords));
}