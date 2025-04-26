/** 
 * Routes for interactio between the user and its cards
 * @author: Kanak Joshi
 */

// Import DAOs
const userDAO = require('../db/UserDAO');
const userCardDAO = require('../db/UserCardDAO');
const TokenMiddleware = require('../middleware/TokenMiddleware.js');

// Start express app
const express = require('express');
const router = express.Router();


/**
 * Retrieves the card collection of the user. If an error is encountered, a 404 is returned with an error.
 */
router.get('/users/:userId/cards', TokenMiddleware.authenticate, (req, res) => {
    userDAO.getUserByID(req.params.userId).then((user) => {
        userCardDAO.getUserCards(user).then((cardCollection) => {
            return res.json(cardCollection); 
        }).catch((error) => {
            return res.status(404).json({message: `${error.message}`});
        });
    }).catch((error) => {
        return res.status(404).json({message: `${error.message}`});
    });
});

/**
 * Retrieves the card collection of the user. If an error is encountered, a 404 is returned with an error.
 */
router.post('/users/:userId/cards', TokenMiddleware.authenticate, (req, res) => {
    const { cards } = req.body;
    if ("" + req.params.userId !== "" + req.user.id) {
        return res.status(403).json({ message: `User '${req.user.username}' not authorized to edit user '${user.username}'.` });
    }
    userDAO.getUserByID(req.params.userId).then((user) => {
        userCardDAO.updateUserCards(user, cards).then((cardCollection) => {
            return res.json(cardCollection); 
        }).catch((error) => {
            return res.status(404).json({message: `${error.message}`});
        });
    }).catch((error) => {
        return res.status(404).json({message: `${error.message}`});
    });
});

// Export routes
module.exports = router;