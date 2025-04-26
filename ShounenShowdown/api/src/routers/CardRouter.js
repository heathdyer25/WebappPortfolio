/** 
 * Routes for retrieving cards
 * @author: Kanak Joshi
 */

//Import DAOs
const cardDAO = require('../db/CardDAO.js');
const moveDAO = require('../db/MoveDAO.js');
const TokenMiddleware = require('../middleware/TokenMiddleware.js');

// Start express app
const express = require('express');
const router = express.Router();

/**
 * Returns all the cards in the database. If there is an error, a corresponding message is returned
 */
router.get('/cards', TokenMiddleware.authenticate, (req, res) => {
    cardDAO.getAllCards().then(cards => {
        return res.json(cards);
    }).catch((error) => {
        return res.status(404).json({message: `${error.message}`});
    })
});

/**
 * Returns the card corresponding to the card ID given as a parameter. If there is an error, a corresponding message is returned
 */
router.get('/cards/:cardID', TokenMiddleware.authenticate, (req, res) => {
    cardDAO.getCardByID(req.params.cardID).then(card => {
        return res.json(card);
    }).catch((error) => {
        return res.status(404).json({message: `${error.message}`});
    })
});

/**
 * Returns the list of moves in the card with the matching card ID. If there is an error, a corresponding message is returned
 */
router.get('/cards/:cardID/moves', TokenMiddleware.authenticate, (req, res) => {
    cardDAO.getCardByID(req.params.cardID).then(card => {
        moveDAO.getMoveByCard(card).then((moves) => {
            return res.json(moves);
        }).catch((error) => {
            return res.status(404).json({message: `${error.message}`});
        });
    }).catch((error) => {
        return res.status(404).json({message: `${error.message}`});
    });
});

/**
 * Returns the move by the move ID
 */
router.get('/moves/:moveID', TokenMiddleware.authenticate, (req, res) => {
    moveDAO.getMoveByID(req.params.moveID).then(move => {
        return res.json(move);
    }).catch((error) => {
        return res.status(404).json({message: `${error.message}`});
    });
});

router.get('/moves', TokenMiddleware.authenticate, (req, res) => {
    moveDAO.getAllMoves().then(moves => {
        return res.json(moves);
    }).catch((error) => {
        return res.status(404).json({message: `${error.message}`});
    });
});

// Export routes
module.exports = router;