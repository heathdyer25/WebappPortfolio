/** 
 * Client to make HTTP requests for Card data to API.
 * @author Heath Dyer
 **/

import HTTPClient from './HTTPClient.js';

const PackClient = {
    getPacks: () => {
        return HTTPClient.get(HTTPClient.API_ROUTE + `/packs`);
    },
    getPackCard: (packId) => {
        return HTTPClient.get(HTTPClient.API_ROUTE + `/packs/${packId}/cards`);
    }
}

export default PackClient;