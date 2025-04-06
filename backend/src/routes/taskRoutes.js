const express = require('express');
const router = express.Router();
const { processContent } = require('../controllers/geminiController');

// Endpoint to process user content and call Gemini API
router.post('/process-content', processContent);

module.exports = router;