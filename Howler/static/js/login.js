/**
 * Functioanlity for login page
 * @author Heath Dyer
 */

import AuthClient from "./clients/AuthClient.js";

const submit = document.querySelector("#submit");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const errorMessage = document.querySelector("#error-message");

// Get user from auth
AuthClient.current()
.then((user) => {
    window.location.href = `./`;
})

/** Submit button */
submit.addEventListener("click", (event) => {
    event.preventDefault();
    AuthClient.login(username.value, password.value)
    .then((response) => {
        console.log("login successful");
        window.location.href = "./";
    })
    .catch((error) => {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove("d-none");
        console.log(error.message);
    });
});