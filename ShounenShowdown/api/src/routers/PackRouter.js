/** 
 * Routes for retrieving packs and their cards
 * @author: Kanak Joshi
 */

// Import DAOs
const packDAO = require('../db/PackDAO.js');
const TokenMiddleware = require('../middleware/TokenMiddleware.js');
const userCardDAO = require('../db/UserCardDAO');

// Start express app
const express = require('express');
const router = express.Router();


/**
 * Retrieves all the packs in the database. If an error is encountered, a 404 is returned with an error.
 */
router.get('/packs', TokenMiddleware.authenticate, (req, res) => {
    packDAO.getAllPacks().then((packs) => {
        return res.json(packs); 
    }).catch((error) => {
        return res.status(400).json({message: `${error.message}`});
    });
});

/**
 * Retrieves the card collection of the pack. If an error is encountered, a 404 is returned with an error.
 */
router.get('/packs/:packId/cards', TokenMiddleware.authenticate, (req, res) => {
    // packDAO.getPackByID(req.params.packId).then((pack) => {
    //     packDAO.getAllCardsFromPack(pack).then((cards) => {
    //         return res.json(cards);
    //     }).catch((error) => {
    //         return res.status(404).json({message: `${error.message}`});
    //     });
    // }).catch((error) => {
    //     return res.status(404).json({message: `${error.message}`});
    // });
    console.log("Pack ID: " + req.params.packId);
    packDAO.getPackByID(req.params.packId).then((pack) => {
        packDAO.getCardsFromPack(pack.id, req.user.id).then((card) => {
            userCardDAO.updateUserCards(req.user, card, pack).then(() => {
                return res.json(card);
            })
            .catch((error) => {
                if (error.message.includes('Card with id')) {
                return res.status(404).json({ message: "No cards left in pack" }); // Specific 404
                }
                return res.status(400).json(error);
            });
        }).catch((error) => {
            return res.status(404).json({message: `${error.message}`});
        });
    }).catch((error) => {
        return res.status(404).json({message: `${error.message}`});
    });
    
});

// Export routes
module.exports = router;