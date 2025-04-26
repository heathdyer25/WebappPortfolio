let follows = require('../data/follows.json');

module.exports = {
    /**
     * Getting the list of users followed by a specific user
     * @param {*} userId 
     */
    getFollowsByUser: (userId) => {
        return new Promise((resolve, reject) => {
            const userFollows =  Object.values(follows).find(follow => follow.userId == userId);
            if(userFollows) {
                resolve(userFollows);
            }
            else {
                reject({code: 404, message: `Follows for user ${userId} not found`});
            }
        });
    },
    /**
     * Following a user
     * @param {*} userId User following
     * @param {*} followUserId User to follow
     */
    followUser: (userId, followUserId) => {
        return new Promise((resolve, reject) => {
            const userFollows =  Object.values(follows).find(follow => follow.userId == userId);
            if(!userFollows) {
                reject({code: 404, message: `Follows for user not found`});
                return;
            }
            if (userFollows.following.includes(followUserId)) {
                reject({code: 400, message: `User is already following this user`});
                return;
            }
            userFollows.following.push(followUserId);
            resolve(userFollows);
            return;
        });
    },

    /**
     * Unfollowing a user
     * @param {*} userId User unfollowing
     * @param {*} followUserId User to unfollow 
     */
    unfollowUser: (userId, followingId) => {
        return new Promise((resolve, reject) => {
            const userFollows =  Object.values(follows).find(follow => follow.userId == userId);
            if(!userFollows) {
                reject({code: 404, message: `Follows for user not found`});
                return;
            }
            if (!userFollows.following.includes(followingId)) {
                reject({code: 400, message: `User is not following this user`});
                return;
            }
            userFollows.following = userFollows.following.filter(id => id !== followingId);
            resolve(userFollows);
            return;
        });
    },
    createFollows: (userId) => {
        return new Promise((resolve, reject) => {
            follows[userId] = {
                "userId": userId,
                "following": [],
            }
            resolve({code: 200, message: "New follows created"});
            return;
        });
    }
}