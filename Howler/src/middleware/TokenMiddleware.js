/**
 * Middleware for user authentication
 * @author Heath Dyer (hadyer)
 */

const crypto = require('crypto');
// Library for env file

// Cookie token name
const TOKEN_COOKIE_NAME = "UserToken";
// Get secret key from environment file
const API_SECRET_KEY = process.env.API_SECRET_KEY;


// Base64 encode
const Base64UrlEncode = (input) => {
    return Buffer.from(input).toString('base64url');
}

// Base64 decode
const Base64UrlDecode = (input) => {
    return Buffer.from(input, 'base64url').toString('utf-8');
}

// Create new JWT token
const createJWT = (payload) => {
    // Create header
    const header = {
        alg: "HS256",
        typ: "JWT",
    };
    // Encode header and payload
    const headerEncoded = Base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = Base64UrlEncode(JSON.stringify(payload));
    // Create signature with header/payload and secret key
    const signature = crypto.createHmac('sha256', API_SECRET_KEY)
        .update(`${headerEncoded}.${payloadEncoded}`)
        .digest('base64url');
    // Format and return
    const token = `${headerEncoded}.${payloadEncoded}.${signature}`;
    return token;
}

// Verify JWT token
const verifyJWT = (token) => {
    // Get components from token
    const [headerEncoded, payloadEncoded, signature] = token.split('.');
    // Recompute signature
    const expectedSignature = crypto.createHmac('sha256', API_SECRET_KEY)
        .update(`${headerEncoded}.${payloadEncoded}`)
        .digest('base64url');
    // Does it match?
    if (expectedSignature === signature) {
        // Decode
        const payload = JSON.parse(Base64UrlDecode(payloadEncoded));
        // Is expired??
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            throw new Error("Token expired");
        }
        return payload;
    }
    throw new Error("Invalid signature");
}

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
        const payload = verifyJWT(token);
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
    const token = createJWT(payload);
    // set token in cookie
    res.cookie(TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 60 * 60 * 1000),
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