/**
 * Functioanlity for login page
 * @author Heath Dyer
 */

import AuthClient from "./clients/AuthClient.js";

const submit = document.querySelector("#submit");
const firstname = document.querySelector("#firstname")
const lastname = document.querySelector("#lastname");;
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const errorMessage = document.querySelector("#error-message");
const successMessage = document.querySelector("#success-message");

// Get user from auth
AuthClient.current()
.then((user) => {
    window.location.href = `./`;
})

/** Submit button */
submit.addEventListener("click", (event) => {
    event.preventDefault();
    const user = {
        "first_name": firstname.value,
        "last_name": lastname.value,
        "username": username.value,
        "password": password.value,
    }
    AuthClient.register(user)
    .then((response) => {
        console.log(response);
        successMessage.textContent = "User account succesfully created.";
        errorMessage.classList.add("d-none");
        successMessage.classList.remove("d-none");
    })
    .catch((error) => {
        errorMessage.textContent = error.message;
        successMessage.classList.add("d-none");
        errorMessage.classList.remove("d-none");
        console.log(error.message);
    });
});