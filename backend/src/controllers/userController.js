const Users = require('../models/users');

// Controller function to create a new user
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id; // Extract user ID from the URL
        const {
            core_values,
            life_prioties,
            short_term_goals,
            long_term_goals,
            motivation,
            finished_survey
        } = req.body; // Extract fields from the request body

        // Update the user in the database
        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            {
                core_values: core_values || [], // Default to an empty array if not provided
                life_prioties: life_prioties || [], // Default to an empty array if not provided
                short_term_goals: short_term_goals || '', // Default to an empty string if not provided
                long_term_goals: long_term_goals || '', // Default to an empty string if not provided
                motivation: motivation || '', // Default to an empty string if not provided
                finished_survey: finished_survey || false // Default to false if not provided
            },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updateHero = async (req, res) => {
    try {
        console.log("hello world\n");
        const userId = req.params.id; // Extract user ID from the URL
        const { hero_id } = req.body; // Extract hero ID from the request body

        // Update the user's hero in the database
        console.log("Updating hero\n");
        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            { hero_id: hero_id }, // Update the hero_id field
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Hero updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating hero:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getSelectedHero = async (req, res) => {
    try {
        const userId = req.params.id; // Extract user ID from the URL

        const user = await Users.findById(userId, 'hero_id');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ hero_id: user.hero_id });
    } catch (error) {
        console.error('Error fetching selected hero:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { createUser, updateUser, updateHero, getSelectedHero };