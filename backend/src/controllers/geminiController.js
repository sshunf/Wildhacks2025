const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini API client
const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const processContent = async (req, res) => {
    try {
        console.log("generating initial user tasks\n");
        const {user, numTasks} = req.body;

        if (!user || !numTasks) {
            return res.status(400).json({ error: 'userProfile and numTasks are required' });
        }

        const userProfile = {
            "core_values": user.core_values,
            "life_priorities": user.life_priorities,
            "motivation": user.motivation,
            "short_term_goals": user.short_term_goals,
            "long_term_goals": user.long_term_goals,
          }
        const responseFormat = "[task1, task2, task3]";

        const prompt = 'Based on my user profile: ' + JSON.stringify(userProfile) + ' and the response format: ' + responseFormat + ', generate a list of ' + numTasks + 'tasks that I can do to achieve my goals. Give me these strictly in the format I asked, with no other information and no text formatting'; 

        //Call Gemini API to generate content
        console.log("calling gemini api\n");
        const response = await client.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
          });

        // Send the response back to the client
        console.log(response.text);
        return res.json({ geminiResponse: response.text });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Failed to process content' });
    }
};

module.exports = { processContent };