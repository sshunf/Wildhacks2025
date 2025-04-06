const express = require('express');
const router = express.Router();
const { updateUser, updateHero } = require('../controllers/userController');

// Update user data
router.put('/users/:id', updateUser);
router.put('/users/hero/:id', updateHero);

module.exports = router;