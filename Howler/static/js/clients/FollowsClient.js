/** 
 * Client to make standard HTTP requests to API for Follows
 * @author Heath Dyer 
 */


import HTTPClient from './HTTPClient.js';

const FollowsClient = {
    getFollowsByUser: (userId) => {
        return HTTPClient.get(HTTPClient.API_ROUTE + `/users/${userId}/follows`);
    },
    follow: (followingId) => {
        return HTTPClient.post(HTTPClient.API_ROUTE + `/follows`, {
            followingId: followingId,
        });
    },
    unfollow: (followingId) => {
        return HTTPClient.delete(HTTPClient.API_ROUTE + `/follows/${followingId}`);
    },
}

export default FollowsClient;