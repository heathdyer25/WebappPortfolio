/** 
 * Mock database requests for card retrieval requests
 * @author: Kanak Joshi 
 * 
 */


const db = require('./DBConnection');
const Card = require('./models/Card');

/**
 * Retrieves all the cards in the database
 */
const getAllCards = () => {
    return db.query(
        `SELECT * FROM card`
    )
    .then(rows => {
        const cards = [];
        rows.forEach(row => {
            cards.push(new Card(row));
        })
        return Promise.resolve(cards);
    })          
    .catch (error => {
        return Promise.reject({ code: 500, message: error.message });
    });
}

/**
 * Retrieves card from the database by ID
 * @param cardID cardID of the card to be searched
 */
const getCardByID = (cardID) => {
    return db.query(
        `SELECT crd_id, crd_name, crd_description, crd_show, crd_level, crd_hp, crd_power
        FROM card 
        WHERE crd_id = ?`, 
        [cardID] // userId is passed to query the user cards
    )
    .then(rows => {
        // Check if any cards were found
        if (rows.length === 1) {
            return Promise.resolve(new Card(rows[0])); 
        }
        throw new Error(`Card with id ${cardID} could not be found`);
    })          
    .catch (error => {
        return Promise.reject({ code: 500, message: error.message });
    });
}

/** Export DAO functions */
module.exports = {
    getAllCards,
    getCardByID
}