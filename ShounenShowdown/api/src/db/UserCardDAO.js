/** 
 * Mock database requests for requests that deal with user-card relationships
 * @author: Kanak Joshi 
 * 
 */

const db = require('./DBConnection');
const Card = require('./models/Card');

/**
 * Retrieves the card collection of the user
 * @param user user whose cards have to be retrieved
 */
const getUserCards = (user) => {
    return db.query(
                `SELECT c.crd_id, c.crd_name, c.crd_description, c.crd_show, c.crd_level, c.crd_hp, c.crd_power
                FROM user_card uc
                JOIN card c ON uc.ucd_crd_id = c.crd_id
                WHERE uc.ucd_usr_id = ?`,
                [user.id] // userId is passed to query the user cards
            )
    .then(rows => {
        // Check if any cards were found
        if (rows.length === 0) {
            return Promise.reject({ code: 404, message: `No cards found for user with ID ${userId}.` });
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
};

/**
 * Retrieves the card collection of the user and appends the added cards
 * @param user user whose cards have to be retrieved
 */
const updateUserCards = (user, card, pack) => {
    return db.query(
        'INSERT INTO `user_card` (`ucd_usr_id`, `ucd_crd_id`, `ucd_deck`) VALUES (?, ?, ?)',
        [user.id, card.id, 0]
    )
    .then(() => {
        console.log(user);
        console.log(pack);
        return db.query(
            `UPDATE user
            SET usr_balance = usr_balance - ?
            WHERE usr_id = ?`,
            [pack.price, user.id]
        );
    })          
     .then(() => {
        return db.query('COMMIT');
    })
    .then(() => {
        return Promise.resolve({ code: 200, message: "User and user collection successfully updated."});
    })
    .catch((error) => {
        return db.query('ROLLBACK')
            .then(() => {
                return Promise.reject({ code: 500, message: error.message });
            });
    });
}

module.exports = {
    getUserCards,
    updateUserCards
}