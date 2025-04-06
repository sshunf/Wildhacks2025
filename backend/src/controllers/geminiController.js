const { GoogleGenAI } = require('@google/genai');
const mongoose = require('mongoose');

// Initialize Gemini API client
const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const Task = require('../models/tasks');

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

const getRecommendedTasks = async (req, res) => {
    try {
        console.log("getting recommended tasks\n");
        const {user, numTasks} = req.body;

        if (!user || !numTasks) {
            return res.status(400).json({ error: 'userProfile and numTasks are required' });
        }
        const userId = new mongoose.Types.ObjectId(user._id); 
        const tasks = await Task.find({ user_id: userId });

        const userProfile = {
            "core_values": user.core_values,
            "life_priorities": user.life_priorities,
            "motivation": user.motivation,
            "short_term_goals": user.short_term_goals,
            "long_term_goals": user.long_term_goals,
          }
        const responseFormat = "[task1, task2, task3]";

        const prompt = 'Based on my user profile: \n' + JSON.stringify(userProfile) + '\n and the response format: \n' + responseFormat + ',\n generate a list of ' + numTasks + 'tasks that I can do to achieve my goals. Give me these strictly in the format I asked, with no other information and no text formatting'
        + '\n\nAdditionally, here are my current tasks: \n' + JSON.stringify(tasks) + '. \nPlease consider these tasks when recommending, but DO NOT REPEAT TASKS. Also consider whether completed:false for the particular task when choosing new tasks, DO NOT REPEAT TASKS.'; 

        console.log("Prompt: ", prompt);
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
}

module.exports = { processContent, getRecommendedTasks };