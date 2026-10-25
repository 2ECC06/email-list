import { getListFromStorage, userCountObj } from "./utilities.js";

const form = document.querySelector("form");
const addUserBtn = document.querySelector("#add-user-btn");

const userListSection = document.querySelector("#user-list-section");
const userListElem = document.querySelector("#user-list");

const nameInputElem = document.querySelector("#name-input");
const emailInputElem = document.querySelector("#email-input");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (findDuplicate()) {
        alert("Please enter a different name or email");
        return;
    } else {
        storeInfo();
        incrementCount();
        displayUser();
        clearInput();
    }

    //checks if user has typed in name or email previously
    function findDuplicate() {
        const listInLocalStorage = getListFromStorage();

        if (listInLocalStorage.length > 0) {
            for (const obj of listInLocalStorage) {
                const { name, email } = obj;

                if (
                    name === nameInputElem.value ||
                    email === emailInputElem.value
                ) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    function storeInfo() {
        const obj = {};
        let listInLocalStorage = getListFromStorage();

        //populates array that will be stored in local storage
        if (nameInputElem.value && emailInputElem.value) {
            obj.name = nameInputElem.value.trim();
            obj.email = emailInputElem.value.trim();

            listInLocalStorage = [...listInLocalStorage, obj];
        }

        if (listInLocalStorage.length > 0) {
            localStorage.setItem("todoArr", JSON.stringify(listInLocalStorage));
        }
    }

    function incrementCount() {
        const userCountElem = document.querySelector("#user-count");
        const userCountText = document.querySelector("#user-count-text");

        const updatedCount = ++userCountObj.value;

        //store count in local storage and update it on the page
        localStorage.setItem("userCount", updatedCount);
        userCountElem.textContent = updatedCount;

        //update the count text
        if (updatedCount === 1) {
            userCountText.textContent = "User";
        } else {
            userCountText.textContent = "Users";
        }
    }

    function displayUser() {
        const getLastUser = () => userListElem.lastElementChild;

        //display the markup which has 1 info div by default
        if (getListFromStorage().length === 1) {
            userListElem.classList.remove("display-none");
        } else {
            const lastUserClone = getLastUser().cloneNode(true);
            userListElem.appendChild(lastUserClone);
        }

        //update the last name and email on the page
        getLastUser().querySelector(".name").textContent = nameInputElem.value;
        getLastUser().querySelector(".email").textContent =
            emailInputElem.value;
    }

    function clearInput() {
        nameInputElem.value = "";
        emailInputElem.value = "";
    }
});
