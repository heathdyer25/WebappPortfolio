/** 
 * Client to make standard HTTP requests to API for Users
 * @author Heath Dyer 
 */


import HTTPClient from './HTTPClient.js';

const UsersClient = {
    getUserById: (userId) => {
        return HTTPClient.get(HTTPClient.API_ROUTE + `/users/${userId}`);
    },
    getUserByUsername: (username) => {
        return HTTPClient.get(HTTPClient.API_ROUTE + `/users?username=${username}`);
    },
}

export default UsersClient;