let howls = require('../data/howls.json');

module.exports = {
    /**
     * Creating a new howl.
     * @param {*} howl 
     */
    createHowl: (text, user) => {
        return new Promise((resolve, reject) => {
            try {
                const newId = howls.length + 1;
                const newHowl = {
                    "id": newId,
                    "userId": user.id,
                    "datetime": new Date().toISOString(),
                    "text": text,
                }
                howls.push(newHowl);
                resolve(newHowl);
            }
            catch (error) {
                reject("Error creating howl.");
            }
        });
    },
    /**
     * Getting howls posted by a specific user
     * @param {*} user 
     */
    getHowlsByUserId: (userId) => {
        return new Promise((resolve, reject) => {
            const userHowls =  Object.values(howls)
                .filter(howl => howl.userId == userId)
                .sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
            if(userHowls) {
                resolve(userHowls);
            }
            else {
                reject();
            }
        });
    },
    /**
     * Getting howls posted by a specific user
     * @param {*} user 
     */
    getHowlsByUsername: (username) => {
        return new Promise((resolve, reject) => {
            const userHowls =  Object.values(howls)
                .filter(howl => howl.username == username)
                .sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
            if(userHowls) {
                resolve(userHowls);
            }
            else {
                reject();
            }
        });
    },
}