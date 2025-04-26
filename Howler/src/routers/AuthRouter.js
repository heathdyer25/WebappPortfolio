const express = require('express');
const router = express.Router();

// Use user DAO
const UsersDAO = require('../db/DAOs/UsersDAO');
const TokenMiddleware = require('../middleware/TokenMiddleware');

/**
 * "Authenticating" a user. For this assignment, just receive a 
 * username and verify that it corresponds to one of the existing users to grant access.
 */
router.post('/login', (req, res) => {
    if (req.body.username && req.body.password) {
        UsersDAO.getUserByCredentials(req.body.username, req.body.password)
        .then(user => {
            TokenMiddleware.generateToken(req, res, user);
            return res.status(200).json({user}); 
        })
        .catch(error => {
            console.log(error);
            const status = typeof error.code === 'number' ? error.code : 500;
            return res.status(status).json({error: error.message});
        })
    }
    else {
        return res.status(400).json({error: 'Credentials not provided'});
    }
});

/**
 * Logging the user out
 */
router.post('/logout', (req, res) => {
    TokenMiddleware.removeToken(req, res);
    res.json({success: true});
});

/**
 * Logging the user out
 */
router.post('/register', (req, res) => {
    if (req.body.user) {
        UsersDAO.createUser(req.body.user)
        .then(user => {
            return res.json({success: true});
        })
        .catch(error => {
            return res.status(error.code).json({error: error.message});
        })
    }
    else {
        return res.status(400).json({error: 'User information not provided'});
    }
});

/**
 * Getting the currently "authenticated" user's object. This is needed by the 
 * frontend to know which user is currently logged in when you navigate to different pages.
 */
router.get('/users/current', TokenMiddleware.authenticate, (req, res) => {
    res.json(req.user);
});

module.exports = router;