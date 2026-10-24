//takes in a key, and returns a js value
export const getFromStorage = (string) =>
    JSON.parse(localStorage.getItem(string));
