import {
    capitaliseFirst,
    getLastUser,
    getListFromStorage,
    storeArrInLocalStorage,
    updateCountText,
    userCountObj,
} from "./utilities.js";

const addUserForm = document.querySelector("#add-user-form");

const updateUserForm = document.querySelector("#update-form");
const addUserBtn = document.querySelector("#add-user-btn");

const updateModal = document.querySelector("#update-modal");
const updateUserBtn = document.querySelector("#update-user-btn");
const closeBtn = document.querySelector("#close-btn");

const userCountElem = document.querySelector("#user-count");

const userListSection = document.querySelector("#user-list-section");
const userListElem = document.querySelector("#user-list");

const nameInputElem = document.querySelector("#name-input");
const emailInputElem = document.querySelector("#email-input");

const modalNameInput = document.querySelector("#modal-name-input");
const modalEmailInput = document.querySelector("#modal-email-input");

//CREATE NEW USER
addUserForm.addEventListener("submit", (e) => {
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
            obj.id = String(Math.floor(Math.random() * 100 + 1));
            obj.name = capitaliseFirst(nameInputElem.value.trim());
            obj.email = emailInputElem.value.trim();

            listInLocalStorage = [...listInLocalStorage, obj];
        }

        if (listInLocalStorage.length > 0) {
            storeArrInLocalStorage(listInLocalStorage);
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

        const { id, name, email } = getListFromStorage().at(-1);

        //update the id, name and email on the page
        getLastUser().dataset.userId = id;
        getLastUser().querySelector(".name").textContent = name;
        getLastUser().querySelector(".email").textContent = email;
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

    function displayList() {
        const listInLocalStorage = getListFromStorage();

        if (getListFromStorage().length === 1) {
            const { id, name, email } = listInLocalStorage[0];

            userListElem.classList.remove("display-none");

            getLastUser().dataset.userId = id;
            getLastUser().querySelector(".name").textContent = name;
            getLastUser().querySelector(".email").textContent = email;
        }

        if (getListFromStorage().length > 1) {
            const listOfElements = listInLocalStorage.map((obj) => {
                const { id, name, email } = obj;

                return `
            <li data-user-id=${id}>
                <article>
                    <div>
                        <p class="name">${name}</p>
                        <p class="email">${email}</p>
                    </div>

                    <div>
                        <button type="button" class="edit-btn">Edit</button>
                        <button type="button" class="edit-btn">Delete</button>
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

//UPDATE USER
document.addEventListener("click", (e) => {
    if (e.target.className === "edit-btn") {
        updateModal.showModal();

        const listInLocalStorage = getListFromStorage();
        const userId = e.target.closest("li").dataset.userId;

        const obj = listInLocalStorage.find((obj) => obj.id === userId);

        const { name, email } = obj;

        //populate modal inputs
        modalNameInput.value = name;
        modalEmailInput.value = email;

        updateUserForm.addEventListener("submit", (e) => {
            e.preventDefault();

            if (modalNameInput.value.toLowerCase().trim() === name) {
                alert("This name is already in the list!");
                return;
            }

            if (modalEmailInput.value.toLowerCase().trim() === email) {
                alert("This email is already in the list!");
                return;
            }

            updateLocalStorage();
            updateHTML();
            updateModal.close();

            function updateLocalStorage() {
                for (let obj of listInLocalStorage) {
                    if (obj.id === userId) {
                        obj.name = capitaliseFirst(modalNameInput.value.trim());
                        obj.email = modalEmailInput.value.trim();
                        break;
                    }
                }

                storeArrInLocalStorage(listInLocalStorage);
            }

            function updateHTML() {
                const listItems = document.querySelectorAll("li");

                const correctLiElem = [...listItems].find(
                    (li) => userId === li.dataset.userId,
                );

                correctLiElem.querySelector(".name").textContent =
                    modalNameInput.value;
                correctLiElem.querySelector(".email").textContent =
                    modalEmailInput.value;
            }
        });
    }
});

closeBtn.addEventListener("click", (e) => {
    updateModal.close();
});
