const express = require('express');
const { handleSignUp, handleSignIn } = require('../Controllers/authControl');
const { authenticateToken } = require('../Middlewares/authenticateToken');
const { handleUserInfo, handleUserLogs } = require('../Controllers/userControl');
const { getGame } = require('../Controllers/Game/getGame');

// AUTHORIZATION SETUP REQUIRED!
const router = express.Router();
router.post('/signup', handleSignUp);
router.post('/signin', handleSignIn);
router.post('/userinfo', handleUserInfo);
router.post('/getgame', getGame);
router.post('/getlogs', handleUserLogs);

module.exports = router;