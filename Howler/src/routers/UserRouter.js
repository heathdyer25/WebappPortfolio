const express = require('express');
const router = express.Router();

const UsersDAO = require('../db/DAOs/UsersDAO');
const TokenMiddleware = require('../middleware/TokenMiddleware');

/**
 * Getting a specific user's object
 */
router.get('/users/:id', TokenMiddleware.authenticate, (req, res) => {
    UsersDAO.getUserById(req.params.id)
    .then(user => {
        res.json(user);
    })
    .catch(error => {
        console.log(error);
        res.status(404).json({message: `Could not find user ${req.params.id}.`});
    });
});

/**
 * Getting a specific user's object by username through query
 */
router.get('/users', TokenMiddleware.authenticate, (req, res) => {
    const { username } = req.query;
    if  (username) {
        UsersDAO.getUserByUsername(username)
        .then(user => {
            res.json(user);
        })
        .catch(error => {
            console.log(error);
            res.status(404).json({message: `Could not find user ${username}.`});
        });
    }
    else {
        res.status(404).json({code: 400, message: `Username not in query.`});
    }
});

module.exports = router;