/** 
 * Client to make standard HTTP requests to API for Howl
 * @author Heath Dyer 
 */


import HTTPClient from './HTTPClient.js';

const HowlsClient = {
    postHowl: (text) => {
        return HTTPClient.post(HTTPClient.API_ROUTE + "/howls", {
            text: text
        });
    },
    getHowlsFromUser: (username) => {
        return HTTPClient.get(HTTPClient.API_ROUTE + `/users/${username}/howls`)
    },
    getFollowingHowls: () => {
        return HTTPClient.get(HTTPClient.API_ROUTE + "/follows/howls")
    }
}

export default HowlsClient;