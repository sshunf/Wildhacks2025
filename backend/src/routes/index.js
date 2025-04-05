const express = require('express');
const router = express.Router();
const { TextServiceClient, GoogleGenAI } = require('@google/genai');

const client = new GoogleGenAI({ apiKey : process.env.GOOGLE_API_KEY })

// Endpoint to process user content and call Gemini API
router.post('/process-content', async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ error: 'userContent is required' });
        }

        // Call Gemini API
        const response = await client.generateText({
            prompt: userContent,
            model: 'gemini-1', // Replace with the appropriate model name
        });

        // Send the response back to the client
        res.json({ geminiResponse: response });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Failed to process content' });
    }
});

module.exports = router;