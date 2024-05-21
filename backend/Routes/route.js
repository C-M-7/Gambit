const express = require('express');
const { handleSignUp, handleSignIn } = require('../Controllers/authControl');
const { authenticateToken } = require('../Middlewares/authenticateToken');

const router = express.Router();
router.post('/signup', handleSignUp);
router.post('/signin', handleSignIn);

module.exports = router;