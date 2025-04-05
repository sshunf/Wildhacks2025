const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.googleSignup); // Google Sign-Up route

module.exports = router;
