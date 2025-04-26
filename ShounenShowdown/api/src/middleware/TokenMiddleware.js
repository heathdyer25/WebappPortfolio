/**
 * Middleware for user authentication
 * @author Heath Dyer (hadyer)
 */

const jwt = require('jsonwebtoken');
// Library for env file

// Cookie token name
const TOKEN_COOKIE_NAME = "UserToken";
// Get secret key from environment file
const API_KEY = process.env.API_KEY;

// Authenticate user middleware
const authenticate = (req, res, next) => {
    let token = null;
    if(req.cookies[TOKEN_COOKIE_NAME]) { //We do have a cookie with a token
        token = req.cookies[TOKEN_COOKIE_NAME]; //Get token from cookie
    }
    else { //No cookie, so let's check Authorization header
        const authHeader = req.get('Authorization');
        if(authHeader && authHeader.startsWith("Bearer ")) {
            //Format should be "Bearer token" but we only need the token
            token = authHeader.split(" ")[1].trim();
        }
    }
    //token still null?
    if (token == null) {
        res.status(401).json({error: 'Not Authenticated'});
        return;
    }
    // verify valid token
    try {
        const payload = jwt.verify(token, API_KEY);
        req.user = payload.user;
        next();
    } catch(error) {
        console.log(error);
        res.status(401).json({error: 'Not Authenticated'});
    }
};

// Generate token middleware
const generateToken = (req, res, user) => {
    // create payload for token
    const payload = {
        user: user,
        exp: Date.now() + 60 * 60 * 1000,
    };
    // generate token
    const token = jwt.sign(payload, API_KEY);
    // set token in cookie
    res.cookie(TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
}

// Remove token middleware
const removeToken = (req, res) => {
    //expired cookie
    res.cookie(TOKEN_COOKIE_NAME, "", {
        httpOnly: true,
        secure: true,
        expires: new Date(-1),
    });
}

module.exports = {
    authenticate,
    generateToken,
    removeToken,
};