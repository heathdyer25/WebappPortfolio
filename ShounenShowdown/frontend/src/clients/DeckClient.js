/** 
 * Client to make standard HTTP requests to API for User Decks
 * @author Heath Dyer 
 */


import HTTPClient from './HTTPClient.js';

const DeckClient = {
    getDeckByUserId :(userId) => {
        return HTTPClient.get(HTTPClient.API_ROUTE + `/users/${userId}/decks`);
    },
    updateDeckByUserId: (userId, cards) => {
        return HTTPClient.put(HTTPClient.API_ROUTE + `/users/${userId}/decks`, {
            "cards": cards
        });
    },
}

export default DeckClient;