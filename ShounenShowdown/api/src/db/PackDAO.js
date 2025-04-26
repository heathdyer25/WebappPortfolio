/** 
 * Mock database requests for pack retrieval requests
 * @author: Kanak Joshi 
 * 
 */

const db = require('./DBConnection');
const Pack = require('./models/Pack')
const cardDAO = require('../db/CardDAO');
const Card = require('./models/Card');

/**
 * Retrieves all the packs in the database
 */
const getAllPacks = () => {
    return db.query(
        `SELECT pck_id, pck_name FROM pack`
    )
    .then(rows => {
        const packs = [];
        rows.forEach(row => {
            packs.push(new Pack(row));
        })
        return Promise.resolve(packs);
    })
    .catch((error) => {
        return Promise.reject(error);
    });
}

/**
 * Retrieves pack from the database by ID
 * @param packID packID of the pack to be searched
 */
const getPackByID = (packID) => {
    return db.query(
        `SELECT pck_id, pck_name, pck_price 
        FROM pack
        WHERE pck_id = ?`, 
        [packID] // userId is passed to query the user cards
    )
    .then(rows => {
        // Check if any cards were found
        if (rows.length === 1) {
            console.log(new Pack(rows[0]));
            return Promise.resolve(new Pack(rows[0])); 
        }
        throw new Error(`Pack with id ${packId} could not be found`);
    })          
    .catch (error => {
        return Promise.reject({ code: 500, message: error.message });
    });
}

/**
 * Retrieves pack from the database by ID
 * @param packID packID of the pack to be searched
 */
const getCardsFromPack = (packID, userID) => {
    const packCards = [];
    const userCards = [];

    return db.query(
        `SELECT pcd_crd_id
        FROM pack_card
        WHERE pcd_pck_id = ?`, 
        [packID] // userId is passed to query the user cards
    )
    .then(rows => {
        rows.forEach(row => {
            console.log("Before");
            console.log(row);
            packCards.push(row.pcd_crd_id);
            console.log("After");
        })
    }).then(() => {
        return db.query(
            `SELECT c.crd_id, c.crd_name, c.crd_description, c.crd_show, c.crd_level, c.crd_hp, c.crd_power
            FROM user_card uc
            JOIN card c ON uc.ucd_crd_id = c.crd_id
            WHERE uc.ucd_usr_id = ?`,
            [userID] // userId is passed to query the user cards
        ).then(rows => {
            console.log("Retrieving user cards");
            rows.forEach(row => {
                userCards.push(new Card(row));
            })
        }).catch (error => {
            return Promise.reject({ code: 500, message: error.message });
        });
    }).then(() => {
        console.log(userCards);
        console.log(packCards);
        const userCardIds = new Set(userCards.map(card => card.id)); // Efficient lookup
        const unownedPackCards = packCards.filter(cardID => !userCardIds.has(cardID));
        if (unownedPackCards.length === 0) {
            return Promise.reject(new Error('No unowned cards'));
          }
        // Pick random unowned card
        const randomIndex = Math.floor(Math.random() * unownedPackCards.length);
        const selectedCardIndex = unownedPackCards[randomIndex];

        return Promise.resolve(getCard(selectedCardIndex));
    })      
    .catch (error => {
        return Promise.reject({ code: 500, message: error.message });
    });
}

// /**
//  * Takes the list of card IDs and creates an array of card objects
//  * @param cardIDArray containing the list of IDs of the card collection of the user
//  */
// function getCardCollection(cardIDArray) {
//     const promises = cardIDArray.map(cardID => cardDAO.getCardByID(cardID));

//     return Promise.all(promises).then(cards => {
//         return cards;
//     }).catch(error => {
//         return [];
//     })
// }

function getCard(cardID) {
    // const promises = cardDAO.getCardByID(cardID);

    // return Promise.all(promises).then(card => {
    //     return card;
    // }).catch(error => {
    //     return Promise.reject({ code: 500, message: error.message });
    // })

    return cardDAO.getCardByID(cardID).then(card => {
        return card;
    }).catch(error => {
        return Promise.reject({code: 500, message: error.message});
    });
}

/** Export DAO functions */
module.exports = {
    getAllPacks,
    getCardsFromPack,
    getPackByID
}