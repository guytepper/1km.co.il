export const getLocalStorage = (field) => {
  return JSON.parse(localStorage.getItem(field));
};

export const setLocalStorage = (field, value) => {
  localStorage.setItem(field, JSON.stringify(value));
};
