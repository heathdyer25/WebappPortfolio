const express = require('express');
const router = express.Router();

const HowlsDAO = require('../db/DAOs/HowlsDAO');
const FollowsDAO = require('../db/DAOs/FollowsDAO');
const TokenMiddleware = require('../middleware/TokenMiddleware');

/**
 * Creating a new howl.
 */
router.post('/howls', TokenMiddleware.authenticate, (req, res) => {
    if (req.body.text) {
        HowlsDAO.createHowl(req.body.text, req.user).then(howl => {
            return res.json({howl: howl}); 
        })
        .catch(error => {
            return res.status(error.code).json({error: error.message});
        })
    }
    else {
        return res.status(400).json({error: 'Howl text not provided'});
    }
});

/**
 * Getting howls posted by a specific user
 */
router.get('/users/:userId/howls', TokenMiddleware.authenticate, (req, res) => {
    HowlsDAO.getHowlsByUserId(req.user.id)
    .then(howls => {
        res.json(howls);
    })
    .catch(error => {
        console.log(error);
        res.status(404).json({message: `Could not find howls for user ${req.user.id}.`});
    })
});

/**
 * Getting howls posted by all users followed by the "authenticated" user
 */
router.get('/follows/howls', TokenMiddleware.authenticate, (req, res) => {
    const howls = [];
    FollowsDAO.getFollowsByUser(req.user.id)
    .then(follows => {
        const followPromises = follows.following.map(followId => {
            return HowlsDAO.getHowlsByUserId(followId)
            .then(followHowls => {
                followHowls.forEach(howl => {
                    howls.push(howl);
                });
            });
        });
        Promise.all(followPromises)
        .then(() => {
            howls.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
            res.json(howls);
        })
        .catch(error => {
            console.log(error);
            res.status(404).json({message: `Could not retrieve howls from followed users.`});
        });
    })
    .catch(error => {
        console.log(error);
        res.status(404).json({message: `Could not find howls for user ${req.user.username}.`});
    })
});

module.exports = router;