/** 
 * Routes for authentication
 * @author: Heath Dyer 
 */

// Import DAOs
const userDAO = require('../db/UserDAO.js');
const userValidation = require('../validation/UserValidation.js');
const TokenMiddleware = require('../middleware/TokenMiddleware.js');

// Start express app
const express = require('express');
const router = express.Router();


/**
 * Login user route. Validates data, creates new user object and returns
 * new user. Returns eror if data is invalid, user does not exist, or password
 * is incorrect
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Validate username
    if (!userValidation.validUsername(username)) {
        return res.status(400).json({ message: "Username is not in valid format." });
    }
    // Validate password
    if (!userValidation.validPassword(password)) {
        return res.status(400).json({ message: "Password is not in valid format." });
    }
    // Search for user
    try {
        userDAO.getUserByCredentials(username, password)
        .then(user => {
            TokenMiddleware.generateToken(req, res, user);
            res.json(user);
        })
        .catch((error) => {
            console.log(error);
            res.status(error.code || 500).json({message: error.message});
        });
    }
    catch (error) {
        res.status(error.code || 500).json({message: error.message});
    }
});


/**
 * TODO: Route for logging a user out.
 */
router.post('/logout', (req, res) => {
    TokenMiddleware.removeToken(req, res);
    res.json({success: true});
});


/**
 * Register user route. Validates data, creates new user, and returns
 * user object. Returns error if data is invalid or the user already exists.
 */
router.post('/register', (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    // Validate username
    if (!userValidation.validUsername(username)) {
        return res.status(400).json({ message: "Username is not in valid format." });
    }
    // Validate email
    if (!userValidation.validEmail(email)) {
        return res.status(400).json({ message: "Email is not in valid format." });
    }
    // Validate password
    if (!userValidation.validPassword(password)) {
        return res.status(400).json({ message: "Password is not in valid format." });
    }
    // Passwords must match
    if (password != confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }
    // Create new user
    userDAO.createUser(req.body).then(user => {
        return res.json(user);
    })
    .catch((error) => {
        return res.status(404).json({message: `${error.message}`});
    });
});

/**
 * Gets currently authenticated user
 */
router.get('/current', TokenMiddleware.authenticate, (req,  res) => {
    try {
        userDAO.getUserByID(req.user.id).then(user => {
            return res.json(user);
        })
    }
    catch (error) {
        return res.status(400).json({message: error.message});
    }
});

// Export routes
module.exports = router;
