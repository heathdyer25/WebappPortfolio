/** 
 * Client for making HTTP requests to API for User information.
 * @author Heath Dyer 
 */

import HTTPClient from './HTTPClient.js';

const UserClient = {
    // Get user by their ID
    getUserByUserId: (userId) => {
        return HTTPClient.get(HTTPClient.API_ROUTE + `/users/${userId}`);
    },
    updateUserSettings: (userId, currentPassword, username, email, newPassword, confirmPassword) => {
        return HTTPClient.put(HTTPClient.API_ROUTE + `/users/${userId}`, {
            currentPassword: currentPassword,
            username: username,
            email: email,
            newPassword, newPassword,
            confirmPassword, confirmPassword,
        });
    },
    updateBattleResults: (userId, result, reward) => {
        console.log(JSON.stringify({
            result: result,
            reward: reward
        }, null, 2));
        
        return HTTPClient.put(HTTPClient.API_ROUTE + `/users/${userId}/battle-results`, {
            result: result,
            reward: reward
        });
    }
}

export default UserClient;