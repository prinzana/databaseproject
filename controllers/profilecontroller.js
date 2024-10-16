const profileModel = require('../models/profileModel');
//const path = require('path'); // Import path for handling file paths


// Controller function to get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you set user info in req from middleware
        const profile = await profileModel.findProfileById(userId); // Fetch user profile from the database
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile); // Return profile data
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
