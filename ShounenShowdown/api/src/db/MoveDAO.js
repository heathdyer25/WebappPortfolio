/** 
 * Mock database requests for move retrieval requests
 * @author: Kanak Joshi 
 * 
 */

const Move = require('./models/Move');
const db = require('./DBConnection');

const getMoveByCard = (card) => {
    return db.query(
        `SELECT mov_id, mov_name, mov_description, mov_type, mov_class 
         FROM move 
         WHERE mov_crd_id = ?`, 
        [card.id]
    )
    .then(rows => {
        const moves = [];
        rows.forEach(row => {
            moves.push(new Move(row));
        })
        return Promise.resolve(moves);
    })
    .catch((error) => {
        return Promise.reject(error);
    });
}

const getAllMoves = () => {
    return db.query(
        `SELECT mov_id, mov_name, mov_description, mov_type, mov_class, mov_crd_id 
         FROM move`
    )
    .then(rows => {
        const moves = [];
        rows.forEach(row => {
            moves.push(new Move(row));
        });
        return Promise.resolve(moves);
    })
    .catch((error) => {
        return Promise.reject(error);
    });
};

/**
 * Retrieves move by ID from the list of moves given
 * @param moveID moveID of the move to be searched
 */
const getMoveByID = (moveID) => {
    return db.query(
        `SELECT mov_id, mov_crd_id, mov_name, mov_description, mov_type, mov_class
        FROM move 
        WHERE mov_id = ?`, 
        [moveID] // userId is passed to query the user cards
    )
    .then(rows => {
        // Check if any cards were found
        if (rows.length === 1) {
            return Promise.resolve(new Move(rows[0])); 
        }
        throw new Error(`Move with id ${moveID} could not be found`);
    })          
    .catch (error => {
        return Promise.reject({ code: 500, message: error.message });
    });
}

/** Export DAO functions */
module.exports = {
    getAllMoves,
    getMoveByCard,
    getMoveByID,
}