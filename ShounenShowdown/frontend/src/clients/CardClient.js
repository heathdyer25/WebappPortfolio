/** 
 * Client to make HTTP requests for Card data to API.
 * @author Heath Dyer
 **/

import HTTPClient from './HTTPClient.js';

const CardClient = {
    getCardsByUserId: (userId) => {
        return HTTPClient.get(HTTPClient.API_ROUTE + `/users/${userId}/cards`);
    },
    getMovesByCardId: (cardId) => {
        return HTTPClient.get(HTTPClient.API_ROUTE + `/cards/${cardId}/moves`);
    },
    getMoveByMoveId: (moveId) => {
        return HTTPClient.get(HTTPClient.API_ROUTE + `/moves/${moveId}`);
    },
    getCards: () => {
        return HTTPClient.get(HTTPClient.API_ROUTE + `/cards`);
    },
    getMoves: () => {
        return HTTPClient.get(HTTPClient.API_ROUTE + `/moves`);
    }
}

export default CardClient;