const express = require('express');
const { handleSignUp, handleSignIn, generateAccessTokenOnly, deleteRefreshToken } = require('../Controllers/authControl');
const { authenticateToken } = require('../Middlewares/authenticateToken');
const { handleUserInfo, handleUserLogs } = require('../Controllers/userControl');
const { getGame } = require('../Controllers/Game/getGame');
const handleCancelgame = require('../Controllers/Game/cancelGame');

// AUTHORIZATION SETUP REQUIRED!
const router = express.Router();
router.post('/signup', handleSignUp);
router.post('/signin', handleSignIn);
router.post('/userinfo', handleUserInfo);
router.post('/getgame', getGame);
router.post('/getlogs', handleUserLogs);
router.post('/cancelgame', handleCancelgame);
router.post('/accessToken', generateAccessTokenOnly);
router.post('/dltToken', deleteRefreshToken);

module.exports = router;