const express = require('express');
const router = express.Router();

const FollowsDAO = require('../db/DAOs/FollowsDAO');
const TokenMiddleware = require('../middleware/TokenMiddleware');


/**
 * Getting the list of users followed by a specific user
 */
router.get('/users/:userId/follows', TokenMiddleware.authenticate, (req, res) => {
    console.log(req.user);
    FollowsDAO.getFollowsByUser(req.user.id)
    .then(follows => {
        res.json(follows);
    })
    .catch(error => {
        console.log(error);
        res.status(404).json({message: `Could not find follows for user ${req.user.id}.`});
    })
});

/**
 * Following a user
 */
router.post('/follows', TokenMiddleware.authenticate, (req, res) => {
    const followingId = req.body.followingId;
    if (followingId) {
        FollowsDAO.followUser(req.user.id, followingId).then(follows => {
            res.json({follows: follows});
            return;
        })
        .catch(error => {
            res.status(error.code).json({error: error.message});
            return;
        })
    }
    else {
        res.status(400).json({error: 'User to follow not provided'});
        return;
    }
});

/**
 * Unfollowing a user
 */
router.delete('/follows/:followingId', TokenMiddleware.authenticate, (req, res) => {
    const followingId = req.params.followingId;
    if (followingId) {
        FollowsDAO.unfollowUser(req.user.id, Number(followingId)).then(follows => {
            res.json({follows: follows});
            return;
        })
        .catch(error => {
            res.status(error.code).json({error: error.message});
            return;
        })
    }
    else {
        res.status(400).json({error: 'User to unfollow not provided'});
        return;
    }
});

module.exports = router;