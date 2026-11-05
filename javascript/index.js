import {
    getLastUser,
    getListFromStorage,
    updateCountText,
    userCountObj,
} from "./utilities.js";

const form = document.querySelector("form");
const addUserBtn = document.querySelector("#add-user-btn");

const userCountElem = document.querySelector("#user-count");

const userListSection = document.querySelector("#user-list-section");
const userListElem = document.querySelector("#user-list");

const nameInputElem = document.querySelector("#name-input");
const emailInputElem = document.querySelector("#email-input");

//CREATE NEW USER
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

                return name === nameInputElem.value ||
                    email === emailInputElem.value
                    ? true
                    : false;
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
        const userCountText = document.querySelector("#user-count-text");

        const updatedCount = ++userCountObj.value;

        //store count in local storage and update it on the page
        localStorage.setItem("userCount", updatedCount);
        userCountElem.textContent = updatedCount;

        //update the count text
        updateCountText(updatedCount);
    }

    function displayUser() {
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

//DISPLAY USERS IN LOCAL STORAGE
document.addEventListener("DOMContentLoaded", (e) => {
    displayCount();
    displayList();

    function displayCount() {
        const storedCount = userCountObj.value;

        //update the count and count text
        userCountElem.textContent = storedCount;
        updateCountText(storedCount);
    }

    function displayList(params) {
        const listInLocalStorage = getListFromStorage();

        if (getListFromStorage().length === 1) {
            const { name, email } = listInLocalStorage[0];

            userListElem.classList.remove("display-none");

            getLastUser().querySelector(".name").textContent = name;
            getLastUser().querySelector(".email").textContent = email;
        }

        if (getListFromStorage().length > 1) {
            const listOfElements = listInLocalStorage.map((obj) => {
                const { name, email } = obj;

                return `
            <li>
                <article>
                    <div>
                        <p class="name">${name}</p>
                        <p class="email">${email}</p>
                    </div>

                    <div>
                        <button type="button">Edit</button>
                        <button type="button">Delete</button>
                    </div>
                </article>
            </li>
            `;
            });

            userListElem.innerHTML = listOfElements.join("");
            userListElem.classList.remove("display-none");
        }
    }
});
