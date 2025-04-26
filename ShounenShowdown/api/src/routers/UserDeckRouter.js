/** 
 * Routes for interaction between the user and its deck
 * @author: Kanak Joshi
 */

// Import DAOs
const userDAO = require('../db/UserDAO');
const userDeckDAO = require('../db/UserDeckDAO');
const TokenMiddleware = require('../middleware/TokenMiddleware.js');

// Start express app
const express = require('express');
const router = express.Router();


/**
 * Retrieves the card collection of the user. If an error is encountered, a 404 is returned with an error.
 */
router.get('/users/:userId/decks', TokenMiddleware.authenticate, (req, res) => {
    userDAO.getUserByID(req.params.userId).then((user) => {
        userDeckDAO.getUserDeck(user).then((deck) => {
            return res.json(deck); 
        }).catch((error) => {
            return res.status(404).json({message: `${error.message}`});
        });
    }).catch((error) => {
        return res.status(404).json({message: `${error.message}`});
    });
});

/**
 * Retrieves the deck of the user and adds the new cards to it. If an error is encountered, a 404 is returned with an error.
 */
router.put('/users/:userId/decks', TokenMiddleware.authenticate, (req, res) => {
    const { cards } = req.body;
    //check if user is authorized to edit
    if ("" + req.params.userId !== "" + req.user.id) {
        return res.status(403).json({ message: `User '${req.user.username}' not authorized to edit user '${user.username}'.` });
    }
    userDAO.getUserByID(req.params.userId)
    .then((user) => {
        userDeckDAO.updateUserDeck(user, cards)
        .then((deck) => {
            return res.json(deck);
        })
        .catch((error) => {
            return res.status(400).json({message: `${error.message}`});
        });
    })
    .catch((error) => {
        return res.status(400).json({message: `${error.message}`});
    });
});

// Export routes
module.exports = router;