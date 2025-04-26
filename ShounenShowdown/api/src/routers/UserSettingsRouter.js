/** 
 * Routes for authentication
 * @author: Kanak Joshi
 */

// Import DAOs
const userDAO = require('../db/UserDAO');
const userValidation = require('../validation/UserValidation.js');
const TokenMiddleware = require('../middleware/TokenMiddleware.js');

// Start express app
const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const uploadDir = path.join(__dirname, '../uploads/avatars');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${Date.now()}-avatar-user${req.user.id}${ext}`;
        cb(null, uniqueName);
    }
});

const imageFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        req.fileValidationError = 'Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.';
        return cb(null, false, req.fileValidationError);
    }
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });


/**
 * Retrieves user by its ID. If there is an error, a corresponding message is returned
 */
router.get('/users/:userId', TokenMiddleware.authenticate, (req, res) => {
    userDAO.getUserByID(req.params.userId).then((user) => {
        return res.json(user);
    }).catch((error) => {
        return res.status(404).json({message: `${error.message}`});
    })
});

/**
 * Retrieves user by its ID and updates its details. If there is an error, a corresponding message is returned
 */
router.put('/users/:userId', TokenMiddleware.authenticate, upload.single('avatar'), (req, res) => {
    const { currentPassword, username, email, newPassword, confirmPassword} = req.body;
    const file = req.file;
    let field = null;
    userDAO.getUserByID(req.params.userId).then((user) => {
        //check if user is authorized to edit
        if ("" + user.id !== "" + req.user.id) {
            return res.status(403).json({ message: `User '${req.user.username}' not authorized to edit user '${user.username}'.` });
        }
        if (req.fileValidationError) {
            throw new Error(req.fileValidationError);
        }
        //if profile photo
        if (file) {
            field ="avatar";
            const imagePath = `uploads/avatars/${file.filename}`;
            return userDAO.updateUserAvatar(user.id, imagePath);
        }
        //update user username
        if (username) {
            // Validate username
            if (!userValidation.validUsername(username)) {
                return res.status(400).json({ message: "Username is not in valid format." });
            }
            field = "username";
            return userDAO.updateUserUsername(user.id, currentPassword, username);
        }
        //update user email
        else if (email) {
            // Validate email
            if (!userValidation.validEmail(email)) {
                return res.status(400).json({ message: "Email is not in valid format." });
            }
            field = "email";
            return userDAO.updateUserEmail(user.id, currentPassword, email);
        }
        //update user password
        else if (newPassword) {
            // Validate password
            if (!userValidation.validPassword(currentPassword)) {
                throw new Error("Password is not in valid format.");
            }
            if (newPassword != confirmPassword) {
                throw new Error("Passwords must match.");
            }
            field = "password";
            return userDAO.updateUserPassword(user.id, currentPassword, newPassword, confirmPassword);
        }
        // not data provided
        else {
            return res.status(400).json({message: "User info not provieded to update user."});
        }
    })
    .then(result => {
        return res.status(200).json({message: `User ${field} succesfully updated.`});
    })
    .catch(error => {
        return res.status(400).json({message: error.message});
    })
});

/**
 * Retrieves user by its ID. If there is an error, a corresponding message is returned
 */
router.get('/users/:userId', TokenMiddleware.authenticate, (req, res) => {
    userDAO.getUserByID(req.params.userId).then((user) => {
        return res.json(user);
    }).catch((error) => {
        return res.status(404).json({message: `${error.message}`});
    })
});

/**
 * Retrieves user by its ID and updates its battle results and prizes 
 */
router.put('/users/:userId/battle-results', TokenMiddleware.authenticate, (req, res) => {
    // const { results } = req.body;

    const { result, reward } = req.body;

    userDAO.getUserByID(req.params.userId).then(async (user) => {
        //check if user is authorized to edit
        if ("" + user.id !== "" + req.user.id) {
            return res.status(403).json({ message: `User '${req.user.username}' not authorized to edit user '${user.username}'.` });
        }

        if (result === 'win') {
            await userDAO.updateUserWins(req.user.id);
            console.log("Wins updated");
        }
        else {
            await userDAO.updateUserLosses(req.user.id);
            console.log("Losses updated");
        }

        const {coins, xp} = reward;

        await userDAO.updateUserBalance(req.user.id, coins);
        console.log("Balance updated");

        await userDAO.updateUserXP(req.user.id, xp);
        console.log("XP updated");
    })
    .then(() => {
        return res.status(200).json({message: `User succesfully updated.`});
    })
    .catch(error => {
        return res.status(400).json({message: error.message});
    })
});

// Export routes
module.exports = router;
