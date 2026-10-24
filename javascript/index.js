import { getFromStorage } from "./utilities.js";

const form = document.querySelector("form");
const addUserBtn = document.querySelector("#add-user-btn");
const nameInputElem = document.querySelector("#name-input");
const emailInputElem = document.querySelector("#email-input");

let arrInLocalStorage = getFromStorage("todoArr") ?? [];

form.addEventListener("submit", (e) => {
    e.preventDefault();

    storeInfo();
    clearInput();

    function storeInfo() {
        const obj = {};

        //alerts user if they've typed in the name or email previously
        if (arrInLocalStorage) {
            for (const obj of arrInLocalStorage) {
                const { name, email } = obj;

                if (
                    name === nameInputElem.value ||
                    email === emailInputElem.value
                ) {
                    alert("Please enter a different name or email");
                    return;
                }
            }
        }

        //populates array that will be stored in local storage
        if (nameInputElem.value && emailInputElem.value) {
            obj.name = nameInputElem.value;
            obj.email = emailInputElem.value;

            arrInLocalStorage = [...arrInLocalStorage, obj];
        }

        if (arrInLocalStorage.length > 0) {
            localStorage.setItem("todoArr", JSON.stringify(arrInLocalStorage));
        }
    }

    function clearInput() {
        nameInputElem.value = "";
        emailInputElem.value = "";
    }
});

/*
GIOTAP

GOAL: When user clicks on “add user”, display name and email on screen


*/
