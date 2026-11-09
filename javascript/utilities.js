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

export const storeCountInLocalStorage = (userCount) => {
    if (userCount === 0) {
        localStorage.removeItem("userCount");
    } else {
        localStorage.setItem("userCount", JSON.stringify(userCount));
    }
};

export const storedCountObj = {
    getUserCount: () => Number(localStorage.getItem("userCount") || 0),
};
export const getLastUser = () =>
    document.querySelector("#user-list").lastElementChild;

export function updateUserText(userCount) {
    if (userCount === 1) {
        document.querySelector("#user-count-text").textContent = "user";
    } else {
        document.querySelector("#user-count-text").textContent = "users";
    }
}

export const capitaliseFirst = (string) => {
    const firstCharacter = string.charAt(0);

    //? The second condition is to prevent false positives, because symbols like @, £, $, etc don't have a lower case value. So "string !== string.toLowerCase()" will always be false
    const firstCharacterIsUpperCase =
        firstCharacter === firstCharacter.toUpperCase() &&
        firstCharacter !== firstCharacter.toLowerCase();

    if (!firstCharacterIsUpperCase) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
        return string;
    }
};

//resets the HTML to the default state when there's only 1 list element left on the page
export function hideLastElem() {
    const lastItem = document.querySelector("li");

    //remove data
    lastItem.removeAttribute("data-user-id");
    lastItem.querySelector(".name").textContent = "";
    lastItem.querySelector(".email").textContent = "";

    //hide list
    const userListElem = document.querySelector("#user-list");
    userListElem.classList.add("display-none");
}
