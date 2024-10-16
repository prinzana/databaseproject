const express = require('express');
const router = express.Router();
const profileMiddleware = require('../middlewares/profileMiddleware'); // Adjust the path based on your structure

// Profile route - get user profile
router.get('/', profileMiddleware, (req, res) => {
    const userId = req.user.id; // Now this should work if the middleware is set up correctly

    // Query the database to get user details based on userId
    req.db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(row); // Send the user data back as a response
    });
});

module.exports = router;
