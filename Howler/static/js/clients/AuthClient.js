/** 
 * Client to make standard HTTP requests to API for Howl
 * @author Heath Dyer 
 */

import HTTPClient from './HTTPClient.js';

const AuthClient = {
    login: (username, password) => {
        return HTTPClient.post(HTTPClient.API_ROUTE + "/login", {
            username: username,
            password: password,
        })
    },
    register: (user) => {
        return HTTPClient.post(HTTPClient.API_ROUTE + "/register", {
            user: user,
        })
    },
    logout: () => {
        return HTTPClient.post(HTTPClient.API_ROUTE + "/logout", {})
    },
    current: () => {
        return HTTPClient.get(HTTPClient.API_ROUTE + "/users/current")
    }
}

export default AuthClient;