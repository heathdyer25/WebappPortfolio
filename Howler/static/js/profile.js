/**
 * Functioanlity for profile page
 * @author Heath Dyer
 */

import AuthClient from "./clients/AuthClient.js";
import HowlsClient from "./clients/HowlsClient.js";
import UsersClient from "./clients/UsersClient.js";
import FollowsClient from "./clients/FollowsClient.js";

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

//get whos profile im on
const pathSegments = window.location.pathname.split('/');
const username = pathSegments[pathSegments.length - 1];

if (!username) {
    console.log("couldn't find username from url");
}
else {
    //get user
    const profileUser =  await UsersClient.getUserByUsername(username)
    .then((user) => {
        return user;
    })
    .catch((error) => {
        console.log(error.message);
        return null;
    }); 

    //set user profile info
    const profileFirstName = document.querySelector("#profile-first-name");
    const profileLastName = document.querySelector("#profile-last-name");
    const profileUsername = document.querySelector("#profile-username");
    const profileImg = document.querySelector("#profile-img");
    profileFirstName.textContent = profileUser.first_name;
    profileLastName.textContent = profileUser.last_name;
    profileUsername.textContent = `@${profileUser.username}`;
    profileImg.src = profileUser.avatar;
    
    //add follow / unfollow button if its not users own profile
    if (user.username != profileUser.username) {
        const followBtn = document.querySelector("#follow-btn");
        //check if the user is following said user
        const isFollowing = await FollowsClient.getFollowsByUser(user.id)
        .then((follows) => {
            return follows.following.includes(profileUser.id);
        })
        .catch((error) => {
            console.log(error.message);
            return null;
        });
        // if following
        if (isFollowing) {
            followBtn.textContent = "Unfollow";
            followBtn.addEventListener("click", event => {
                FollowsClient.unfollow(profileUser.id).then(result => {
                    window.location.reload();
                })
                .catch (error => {
                    console.log("error unfollowing user");
                })
            })
        }
        //else not following
        else {
            followBtn.textContent = "Follow";
            followBtn.addEventListener("click", event => {
                FollowsClient.follow(profileUser.id).then(result => {
                    window.location.reload();
                })
                .catch (error => {
                    console.log("error following user");
                })
            })
        }
        followBtn.classList.remove("d-none");
    }

    //get list of followers
    const follows = await FollowsClient.getFollowsByUser(profileUser.id)
    .then((follows) => {
        return follows;
    })
    .catch((error) => {
        console.log(error.message);
        return null;
    });

    //populate follows list
    const followsList = document.querySelector("#follows-list"); 
    const followTemplate = document.querySelector("#followTemplate");
    follows.following.forEach(following => {
        UsersClient.getUserById(following)
        .then(user => {
            const clonedFollow = followTemplate.content.cloneNode(true); 
            clonedFollow.querySelector(".first-name").textContent = user.first_name;
            clonedFollow.querySelector(".last-name").textContent = user.last_name;
            clonedFollow.querySelector(".follow-username").textContent = `@${user.username}`;
            clonedFollow.querySelector(".follow-profile").src = user.avatar;
            clonedFollow.querySelector(".follow-item").addEventListener("click", event => {
                window.location.href = `${user.username}`;
            });
            followsList.appendChild(clonedFollow);
        })
        .catch(error => {
            console.log(error.message);
        })
    });

    //get howls
    const howls = await HowlsClient.getHowlsFromUser(profileUser.id)
    .then((howls) => {
        return howls;
    })
    .catch((error) => {
        console.log(error.message);
        return null;
    }); 

    //populate howls
    const howlsList = document.querySelector("#howls-list"); 
    const howlTemplate = document.querySelector("#howlTemplate");
    howls.forEach(howl => {
        UsersClient.getUserById(howl.userId)
        .then(user => {
            const clonedHowl = howlTemplate.content.cloneNode(true); 
            clonedHowl.querySelector(".first-name").textContent = user.first_name;
            clonedHowl.querySelector(".last-name").textContent = user.last_name;
            clonedHowl.querySelector(".howl-username").textContent = `@${user.username}`;
            clonedHowl.querySelector(".howl-profile").src = user.avatar;
            clonedHowl.querySelector(".howl-date").textContent = new Date(howl.datetime).toLocaleString();
            clonedHowl.querySelector(".howl-content").textContent = howl.text;
            clonedHowl.querySelector(".howl-header").addEventListener("click", event => {
                window.location.href = `${user.username}`;
            });
            howlsList.appendChild(clonedHowl);
        })
        .catch(error => {
            console.log(error.message);
        })
    });

}
