import {
    capitaliseFirst,
    getLastUser,
    getListFromStorage,
    hideLastElem,
    storeArrInLocalStorage,
    storeCountInLocalStorage,
    storedCountObj,
    updateUserText,
} from "./utilities.js";

const modalNameInput = document.querySelector("#modal-name-input");
const modalEmailInput = document.querySelector("#modal-email-input");

const addUserForm = document.querySelector("#add-user-form");

const userCountElem = document.querySelector("#user-count");

const updateUserForm = document.querySelector("#update-form");

const userListElem = document.querySelector("#user-list");

const updateModal = document.querySelector("#update-modal");
const closeBtn = document.querySelector("#close-btn");

const nameInputElem = document.querySelector("#name-input");
const emailInputElem = document.querySelector("#email-input");

const deleteAllBtn = document.querySelector("#delete-all-btn");

//CREATE NEW USER
addUserForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (duplicateFound()) {
        alert("Please enter a different name or email");
        return;
    } else {
        storeInfo();
        incrementCount();
        displayUser();
        clearInput();
    }

    //checks if user has typed in name or email previously
    function duplicateFound() {
        const listInLocalStorage = getListFromStorage();

        if (listInLocalStorage.length > 0) {
            for (const obj of listInLocalStorage) {
                const { name, email } = obj;

                return name === capitaliseFirst(nameInputElem.value) ||
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
            obj.id = String(Math.floor(Math.random() * 101 + 10));
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

        const updatedCount = storedCountObj.getUserCount() + 1;

        //store count in local storage and update it on the page
        storeCountInLocalStorage(updatedCount);
        userCountElem.textContent = updatedCount;

        //update the count text
        updateUserText(updatedCount);
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
        const storedCount = storedCountObj.getUserCount();

        //update the count and count text
        userCountElem.textContent = storedCount;
        updateUserText(storedCount);
    }

    function displayList() {
        const listInLocalStorage = getListFromStorage();

        if (listInLocalStorage.length === 1) {
            const { id, name, email } = listInLocalStorage[0];

            userListElem.classList.remove("display-none");

            getLastUser().dataset.userId = id;
            getLastUser().querySelector(".name").textContent = name;
            getLastUser().querySelector(".email").textContent = email;
        }

        if (listInLocalStorage.length > 1) {
            const listOfElements = listInLocalStorage.map((obj) => {
                const { id, name, email } = obj;

                return `
            <li data-user-id=${id} class="list-item">
                <article class="cont">
                    <div class="user-info">
                        <p class="name">${name}</p>
                        <p class="email">${email}</p>
                    </div>

                    <div id="edit-and-delete">
                        <button type="button" class="edit-btn">Edit</button>
                        <button type="button" class="delete-btn">Delete</button>
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
        const objToUpdate = listInLocalStorage.find((obj) => obj.id === userId);
        const { name, email } = objToUpdate;

        updateModal.showModal();
        populateInputs();

        function populateInputs() {
            //populate modal inputs
            modalNameInput.value = name;
            modalEmailInput.value = email;
        }

        updateUserForm.addEventListener("submit", (e) => {
            e.preventDefault();

            let nameChanged = false;
            let emailChanged = false;

            if (capitaliseFirst(modalNameInput.value.trim()) !== name) {
                nameChanged = true;
            }

            if (modalEmailInput.value.trim() !== email) {
                emailChanged = true;
            }

            if (!nameChanged && !emailChanged) {
                updateModal.close();
                return;
            }

            updateLocalStorage();
            updateHTML();
            updateModal.close();

            function updateLocalStorage() {
                if (nameChanged)
                    objToUpdate.name = capitaliseFirst(
                        modalNameInput.value.trim(),
                    );

                if (emailChanged)
                    objToUpdate.email = modalEmailInput.value.trim();

                storeArrInLocalStorage(listInLocalStorage);
            }

            function updateHTML() {
                const listElements = document.querySelectorAll("li");

                const correctLiElem = [...listElements].find(
                    (li) => li.dataset.userId === userId,
                );

                const { name, email } = listInLocalStorage.find(
                    (obj) => obj.id === userId,
                );

                correctLiElem.querySelector(".name").textContent = name;
                correctLiElem.querySelector(".email").textContent = email;
            }
        });
    }
});

closeBtn.addEventListener("click", (e) => {
    updateModal.close();
});

//DELETE USER
document.addEventListener("click", (e) => {
    if (e.target.className === "delete-btn") {
        const idOfSelectedElem = e.target.closest("li").dataset.userId;

        if (confirm("Delete this user?")) {
            decrementCount();
            removeUser(idOfSelectedElem);
        }
    }

    function decrementCount() {
        //decrement 1 in local storage
        const countMinus1 = storedCountObj.getUserCount() - 1;

        //store count in local storage and update it on the page
        storeCountInLocalStorage(countMinus1);
        userCountElem.textContent = countMinus1;

        //update the "users" count text
        updateUserText(countMinus1);
    }

    function removeUser(userId) {
        //remove item from local storage
        const oldArr = getListFromStorage();
        const newArr = oldArr.filter((obj) => obj.id !== userId);
        storeArrInLocalStorage(newArr);

        const listElements = document.querySelectorAll("li");

        //if there's only 1 element remaining on the page, don't delete it from the HTML. Rather, clear it's info and hide the list
        if (listElements.length === 1) {
            hideLastElem();
        } else {
            //remove item from HTML
            const elementToDelete = e.target.closest("li");
            elementToDelete.remove();
        }
    }
});

deleteAllBtn.addEventListener("click", (e) => {
    if (getListFromStorage().length > 0) {
        if (confirm("This action will delete ALL users")) {
            const listElements = document.querySelectorAll("li");

            storeArrInLocalStorage([]);
            updateCount();
            updateHTML();

            function updateCount() {
                userCountElem.textContent = 0;
                storeCountInLocalStorage(0);

                if (getListFromStorage().length === 1) {
                    //ensures that the user text is changed from "1 user" to "0 users"
                    updateUserText(0);
                }
            }

            function updateHTML() {
                //delete all elements on the page excluding the first 1
                listElements.forEach((liElem, index) => {
                    if (index > 0) liElem.remove();
                });

                hideLastElem();
            }
        }
    } else {
        alert("There are no users to delete!!!");
    }
});
