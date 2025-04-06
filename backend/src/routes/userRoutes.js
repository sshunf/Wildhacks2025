const express = require('express');
const router = express.Router();
const { updateUser } = require('../controllers/userController');

// Update user data
router.put('/users/:id', updateUser);

module.exports = router;