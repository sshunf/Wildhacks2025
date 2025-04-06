const express = require('express');
const router = express.Router();
const Users = require('../models/users');

// Update user data
router.put('/users/:id', async (req, res) => {
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
});

module.exports = router;