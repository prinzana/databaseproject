const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');
const db = require('../config/maindatabase'); // Adjust path if needed
const express = require('express');
const userController = require('../controllers/userProfileController'); // Import the userController
const router = express.Router();
const jwt = require('jsonwebtoken'); // Make sure to import this at the top of your file


// Utility functions for database operations
const dbGet = (query, params) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const dbRun = (query, params) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

// User Registration Route
router.post('/register', async (req, res) => {
    // Destructure request body
    const { fullname, email, password, community, clan, familyname, address, maritalstatus, numberofchildren, stateofresidence, lgaofresidence, dateofbirth, isdobpublic, profile_picture } = req.body;

    // Validate required fields
    if (!fullname || !email || !password || !community || !clan || !familyname || !address || !stateofresidence || !lgaofresidence) {
        return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    try {
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into the database
        await dbRun(
            `INSERT INTO mainusers (fullname, email, password, community, clan, familyname, address, maritalstatus, numberofchildren, stateofresidence, lgaofresidence, dateofbirth, isdobpublic, profile_picture) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [fullname, email, hashedPassword, community, clan, familyname, address, maritalstatus, numberofchildren, stateofresidence, lgaofresidence, dateofbirth, isdobpublic, profile_picture]
        );

        // Send success response
        res.status(200).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration error:', error);
        // You can handle specific database errors here, like duplicate email
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Email already in use.' });
        }
        res.status(500).json({ error: 'Database error: ' + error.message });
    }
});
