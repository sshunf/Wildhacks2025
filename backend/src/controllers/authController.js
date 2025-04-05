const { google } = require('googleapis');
const mongoose = require('mongoose');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    'postmessage' // Redirect URL for Google Sign-In
);

const Users = require('../models/users');

const authController = {
    async googleSignup(req, res) {
        try {
            const { token } = req.body;
            const ticket = await oauth2Client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const { sub, email, name, picture } = payload;
            let user = await Users.findOne({ email }); // Find the user by email

            if(!user){
                console.log('User not found, creating a new user...');
                // If user doesn't exist, create a new user
                user = new Users({
                    _id: new mongoose.Types.ObjectId(),
                    username: name,
                    email,
                    core_values: [], // Default empty array
                    life_prioties: [], // Default empty array
                    motivation: '',
                    short_term_goals: [],
                    long_term_goals: [],
                    rating: 0,
                    finished_survey: false,
                });
                await user.save();
            }

            res.status(200).json({
                message: 'User signed in successfully!',
                user: user,
            });
        } catch (error) {
            console.error('Error during Google Sign-In:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

module.exports = authController;