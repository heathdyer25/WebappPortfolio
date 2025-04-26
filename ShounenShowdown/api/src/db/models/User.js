/**
 * Converts User data from database to object which we can then
 * convert to a json object to work with or add other functions
 * @author Heath Dyer (hadyer)
 */

const crypto = require('crypto');

module.exports = class User {
    id = null;
    username = null;
    email = null;
    #password = null;;
    #salt = null;;
    avatar = null;
    balance = null;
    rank = null;
    xp = null;
    wins = null;
    losses = null;
    /** Might not use this */
    // collection = [];
    // deck = [];

    /**
     * Validate password against user hashed password
     * @param {String} password 
     * @returns Promise either filitered user or reject
     */
    validatePassword(password) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, this.#salt, 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) { //problem computing digest, like hash function not available
                    reject({code: 500, message: "Error hashing password " + err});
                    return;
                }
                const digest = derivedKey.toString('hex');
                if (this.#password == digest) {
                    resolve(this);
                }
                else {
                    reject({code: 401, message: "Invalid password"});
                }
            });
        });
    }

    /**
     * Hash the password with the user's salt
     * @param {String} password the password to hash
     * @returns {Promise} hashed password
     */
    hashPassword(password) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, this.#salt, 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) {
                    reject({ code: 500, message: "Error hashing password " + err });
                    return;
                }
                const hashedPassword = derivedKey.toString('hex');
                resolve(hashedPassword);
            });
        });
    }

    /** Might not use this */
    addCardToCollection(card) {
        this.collection.push(card);
    }

    /** Might not use this */
    addCardToDeck(card) {
        this.deck.push(card);
    }

    constructor(data) {
        this.id = data.usr_id;
        this.username = data.usr_username;
        this.email = data.usr_email;
        this.#password = data.usr_password;
        this.#salt = data.usr_salt;
        this.avatar = data.usr_avatar;
        this.balance = data.usr_balance;
        this.rank = data.usr_rank;
        this.xp = data.usr_xp;
        this.wins = data.usr_wins;
        this.losses = data.usr_losses;
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            avatar: this.avatar,
            balance: this.balance,
            rank: this.rank,
            xp: this.xp,
            wins: this.wins,
            losses: this.losses,
            /** Might not use this */
            collection: this.collection,
            deck: this.deck,
        }
    }
};