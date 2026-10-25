//takes in a key, and returns a js value
export const getListFromStorage = () =>
    JSON.parse(localStorage.getItem("todoArr")) ?? [];

export const userCountObj = {
    value: Number(localStorage.getItem("count")) || 0,
};
