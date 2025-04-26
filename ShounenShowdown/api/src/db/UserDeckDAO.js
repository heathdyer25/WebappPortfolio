/** 
 * Mock database requests for requests that deal with user-card relationships
 * @author: Kanak Joshi 
 * 
 */
const db = require('./DBConnection');
const cardDAO = require('../db/CardDAO.js');
const Card = require('./models/Card');

/**
 * Retrieves the card deck of the user
 * @param user user whose cards have to be retrieved
 */
const getUserDeck = (user) => {
    return db.query(
        `SELECT c.crd_id, c.crd_name, c.crd_description, c.crd_show, c.crd_level, c.crd_hp, c.crd_power
        FROM user_card uc
        JOIN card c ON uc.ucd_crd_id = c.crd_id
        WHERE uc.ucd_usr_id = ? AND uc.ucd_deck = 1`,
        [user.id] // userId is passed to query the user cards
    )
    .then(rows => {
        // Check if any cards were found
        if (rows.length === 0) {
            return Promise.reject({ code: 404, message: `No cards found for user with ID ${user.id}.` });
        }

        const cards = [];
        rows.forEach(row => {
            cards.push(new Card(row));
        })
        // Resolve with the card details
        return Promise.resolve(cards); 
    })          
    .catch (error => {
        return Promise.reject({ code: 500, message: error.message });
    });
}

/**
 * Retrieves the card collection of the user and appends the added cards
 * @param user user whose cards have to be retrieved
 */
const updateUserDeck = (user, cardIds) => {
     // Start a transaction to ensure correctness
    return db.query(
        `SELECT SUM(c.crd_level) AS totalLevel
        FROM card c
        WHERE c.crd_id IN (?)`,
        [cardIds] // Pass the array of card IDs
    )
    .then((rows) => {
        console.log(rows[0].totalLevel);
        if (rows.length === 0 || rows[0].totalLevel > 5) {
            return Promise.reject({ code: 400, message: 'Total card levels in deck cannot exceed 5.' });
        }
        // To ensure correctness so we can roll back
        return db.query('START TRANSACTION');
    })
    .then(() => {
        return db.query(
            `UPDATE user_card
            SET ucd_deck = 1
            WHERE ucd_usr_id = ? AND ucd_crd_id IN (?)`,
            [user.id, cardIds]
        );
    })
     // User ID and the array of card IDs
    .then(() => {
        return db.query(
            `UPDATE user_card
            SET ucd_deck = 0
            WHERE ucd_usr_id = ? AND ucd_crd_id NOT IN (?)`,
            [user.id, cardIds]
        );
    })
    // Commit the transaction if both updates succeed
    .then(() => {
        return db.query('COMMIT');
    })
    .then(() => {
        return Promise.resolve({ code: 200, message: "Deck successfully updated."});
    })
     // Rollback the transaction in case of an error
    .catch((error) => {
        return db.query('ROLLBACK')
            .then(() => {
                return Promise.reject({ code: 500, message: error.message });
            });
    });
}

module.exports = {
    getUserDeck,
    updateUserDeck
}