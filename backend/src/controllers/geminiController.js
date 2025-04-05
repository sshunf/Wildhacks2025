const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini API client
const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const processContent = async (req, res) => {
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
};

module.exports = { processContent };