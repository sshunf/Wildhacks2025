const { google } = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    'postmessage' // Redirect URL for Google Sign-In
);

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

            res.status(200).json({
                message: 'User signed in successfully!',
                user: { id: sub, email, name, picture },
            });
        } catch (error) {
            console.error('Error during Google Sign-In:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

module.exports = authController;