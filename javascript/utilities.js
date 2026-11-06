//takes in a key, and returns a js value
export const getListFromStorage = () =>
    JSON.parse(localStorage.getItem("userInfo")) ?? [];

export const storeArrInLocalStorage = (arr) => {
    if (arr.length === 0) {
        localStorage.removeItem("userInfo");
    } else {
        localStorage.setItem("userInfo", JSON.stringify(arr));
    }
};

export const storeCountInLocalStorage = (count) => {
    if (count === 0) {
        localStorage.removeItem("userCount");
    } else {
        localStorage.setItem("userCount", JSON.stringify(count));
    }
};

export const storedCountObj = {
    value: Number(localStorage.getItem("userCount")) || 0,
};
export const getLastUser = () =>
    document.querySelector("#user-list").lastElementChild;

export function updateUserText(count) {
    if (count === 1) {
        document.querySelector("#user-count-text").textContent = "User";
    } else {
        document.querySelector("#user-count-text").textContent = "Users";
    }
}

export const capitaliseFirst = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);
