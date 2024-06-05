const express = require('express');
const { handleSignUp, handleSignIn } = require('../Controllers/authControl');
const { authenticateToken } = require('../Middlewares/authenticateToken');
const { handleUserInfo } = require('../Controllers/userControl');

const router = express.Router();
router.post('/signup', handleSignUp);
router.post('/signin', handleSignIn);
router.post('/userinfo', handleUserInfo);

module.exports = router;