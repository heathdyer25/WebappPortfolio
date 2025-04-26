const express = require('express');
const router = express.Router();

// Use cookies
const cookieParser = require('cookie-parser');
router.use(cookieParser());
router.use(express.json());

//JSON for request body
router.use(express.json());

/** Add API routers here */
const authRouter = require('./routers/AuthRouter');
router.use(authRouter);

const followsRouter = require('./routers/FollowsRouter');
router.use(followsRouter);

const howlsRouter = require('./routers/HowlsRouter');
router.use(howlsRouter);

const userRouter = require('./routers/UserRouter');
router.use(userRouter);


module.exports = router;