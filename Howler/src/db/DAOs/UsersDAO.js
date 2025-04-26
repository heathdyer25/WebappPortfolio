let users = require('../data/users.json');
const crypto = require('crypto');

let FollowsDAO = require("./FollowsDAO.js");

/**
 * Sanatize user object and return
 * @param {*} user User to sanitize
 * @returns returns user object
 */
const getFilteredUser = (user) => {
    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "username": user.username,
        "avatar": user.avatar
    }
}

// Generates a 16-byte salt in hex format
const generateSalt = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Hash password
const hashPassword = (password, salt) => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (error, derivedKey) => {
            if (error) {
                reject({code: 500, message: `Error occured while hasing password`});
                return;
            }
            resolve(derivedKey.toString('hex'));
        });
    });
};

module.exports = {
    /**
     * Getting a specific user's object
     * @param {*} id 
     */
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            const user =  Object.values(users).find(user => user.id == id);
            if(user) {
                resolve(getFilteredUser(user));
            }
            else {
                reject({code: 404, message: `User ${id} not found`});
            }
        });
    },
    getUserByUsername: (username) => {
        return new Promise((resolve, reject) => {
            const user =  Object.values(users).find(user => user.username == username);
            if(user) {
                resolve(getFilteredUser(user));
            }
            else {
                reject({code: 404, message: `User ${username} not found`});
            }
        });
    },
    getUserByCredentials: (username, password) => {
        return new Promise(async (resolve, reject) => {
            const user = Object.values(users).find(user => user.username == username);
            if(!user) {
                reject({code: 401, message: "No such user"});
                return;
            }
            //check if passwords match
            await hashPassword(password, user.salt)
            .then((digest) => {
                if (user.password == digest) {
                    resolve(getFilteredUser(user));
                }
                else {
                    reject({code: 401, message: "Invalid password"});
                }
            })
            .catch(error => {
                reject({code: 500, message: "Error hashing password " + error});
            });
        });
    },
    createUser: (user) => {
        return new Promise(async (resolve, reject) => {
            // Make sure fields are set
            if (user.first_name && user.last_name && user.username && user.password) {
                //make sure user doesnt exist already
                const lookup =  Object.values(users).find(lookup => user.username == lookup.username);
                if (lookup) {
                    reject({code: 400, message: `User with username "${user.username}". already exists`});
                }
                // We should do more thorough data validation but for now assume all fields valid
                const id = Object.values(users).length + 1;
                const salt = generateSalt();
                hashPassword(user.password, salt).then(hashedPassword => {
                    // create new user
                    const newUser = {
                        "id": id,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "username": user.username,
                        "salt": salt,
                        "password": hashedPassword,
                        "avatar": "https://robohash.org/veniamdoloresenim.png?size=64x64&set=set1"
                    }
                    // add user
                    users[id] = newUser;
                    //create new follows object for user
                    FollowsDAO.createFollows(id).then(result => {
                        resolve(getFilteredUser(newUser));
                        return;
                    })
                })
                .catch(error => {
                    reject({code: 500, message: "Could not hash passord."});
                })
            }
            else {
                reject({code: 400, message: "Could not create user, input invalid."});
            }
        });
    }
}

