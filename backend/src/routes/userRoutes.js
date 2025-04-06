const express = require('express');
const router = express.Router();
const { updateUser, updateHero, getSelectedHero } = require('../controllers/userController');

// Update user data
router.put('/users/:id', updateUser);
router.put('/users/hero/:id', updateHero);
router.get('/users/hero/:id', getSelectedHero);

module.exports = router;