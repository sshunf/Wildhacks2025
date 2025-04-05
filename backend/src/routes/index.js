const express = require('express');
const router = express.Router();
const { processContent } = require('../controllers/geminiController');
const { createUser } = require('../controllers/userController');

// Endpoint to process user content and call Gemini API
router.post('/process-content', processContent);
router.post('/create-user', createUser);

module.exports = router;