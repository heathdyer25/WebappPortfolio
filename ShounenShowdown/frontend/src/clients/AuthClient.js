/**
 * HTTP client to making authorization requests to API
 * @author Heath Dyer
 */

import HTTPClient from './HTTPClient.js';


const AuthClient = {
    // Login request
    login: (username, password) => {
        return HTTPClient.post(HTTPClient.API_ROUTE + '/login', 
            {
                "username": username,
                "password": password,
            });
    },
    // Register request
    register: (username, email, password, confirmPassword) => {
        return HTTPClient.post(HTTPClient.API_ROUTE + '/register', 
            {
                "username": username,
                "email": email,
                "password": password,
                "confirmPassword": confirmPassword,
            });
    },
    // Logout request
    logout: () => {
        return HTTPClient.post(HTTPClient.API_ROUTE + '/logout');
    },
    // Current user request
    current: () => {
        return HTTPClient.get(HTTPClient.API_ROUTE + '/current');
    },
}

export default AuthClient;