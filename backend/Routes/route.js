const express = require('express');
const { handleSignUp } = require('../Controllers/authControl');

const router = express.Router();
router.post('/signup', handleSignUp);

module.exports = router;