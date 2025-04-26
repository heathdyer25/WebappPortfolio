/**
 * Functioanlity for main page
 * @author Heath Dyer
 */

import AuthClient from "./clients/AuthClient.js";
import HowlsClient from "./clients/HowlsClient.js";
import UsersClient from "./clients/UsersClient.js";

// Get user from auth
const user = await AuthClient.current()
.then((user) => {
    return user;
})
.catch((error) => {
    console.log(error.message);
    window.location.href = `./login`;
}); 

//set user profile img and user profile link in header
const headerContainer = document.querySelector("#header-profile");
const headerUsername = document.querySelector("#header-username");
const headerImg = document.querySelector("#header-profile-img");
headerUsername.textContent = `@${user.username}`
headerImg.src = user.avatar;
headerContainer.addEventListener("click", event => {
    window.location.href = `${user.username}`;
});
const profileBtn = document.querySelector("#logout-btn");
profileBtn.addEventListener("click", event => {
    AuthClient.logout().then(res => {
        window.location.reload();
    })
})

//user can post howl
const postHowl = document.querySelector("#post-howl");
const howlArea = document.querySelector("#howl");
const errorMessage = document.querySelector("#error-message");
const successMessage = document.querySelector("#success-message");
postHowl.addEventListener("click", event => {
    HowlsClient.postHowl(howlArea.value).then(howl => {
        howlArea.value = "";
        successMessage.textContent = "Howl posted successfully.";
        populateHowls();
        errorMessage.classList.add("d-none");
        successMessage.classList.remove("d-none");
    })
    .catch(error => {
        errorMessage.textContent = error.message;
        successMessage.classList.add("d-none");
        errorMessage.classList.remove("d-none");
    })
});

async function populateHowls() {
    //get howls
    const followHowls = await HowlsClient.getFollowingHowls()
    .then((howls) => {
        return howls;
    })
    .catch((error) => {
        console.log(error.message);
        return null;
    }); 

    //get howls from user
    const userHowls = await HowlsClient.getHowlsFromUser(user.id)
    .then((userHowls) => {
        return userHowls;
    })
    .catch((error) => {
        console.log(error.message);
        return null;
    }); 

    //combine and sort howls
    const howls = [...followHowls, ...userHowls].sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

    //populate howls
    const howlsList = document.querySelector("#howls-list"); 
    howlsList.innerHTML = "";
    const howlTemplate = document.querySelector("#howlTemplate");

    // Fetch user data for all howls in parallel
    Promise.all(howls.map(async (howl) => {
        try {
            const user = await UsersClient.getUserById(howl.userId);
            return { ...howl, user };
        } catch (error) {
            console.log(error.message);
            return null;
        }
    })).then(howlsWithUsers => {
        // Filter out failed requests
        howlsWithUsers.filter(howl => howl !== null).forEach(howl => {
            const clonedHowl = howlTemplate.content.cloneNode(true); 
            clonedHowl.querySelector(".first-name").textContent = howl.user.first_name;
            clonedHowl.querySelector(".last-name").textContent = howl.user.last_name;
            clonedHowl.querySelector(".howl-username").textContent = `@${howl.user.username}`;
            clonedHowl.querySelector(".howl-profile").src = howl.user.avatar;
            clonedHowl.querySelector(".howl-date").textContent = new Date(howl.datetime).toLocaleString();
            clonedHowl.querySelector(".howl-content").textContent = howl.text;
            clonedHowl.querySelector(".howl-header").addEventListener("click", () => {
                window.location.href = `${howl.user.username}`;
            });
            howlsList.appendChild(clonedHowl);
        });
    });
}

populateHowls();