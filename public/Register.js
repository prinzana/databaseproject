const bcrypt = require('bcryptjs');
const db = require('../config/maindatabase');

const registerUser = async (req, res) => {
    const { fullname, email, password, community, clan, familyname } = req.body;

    // Validate that all required fields are present
    if (!fullname || !email || !password || !community || !clan || !familyname) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    try {
        // Check if a user with the given email already exists
        const query = `SELECT * FROM users WHERE email = ?`;
        db.get(query, [email], async (err, row) => {
            if (err) {
                console.error('Database error during user check:', err);
                return res.status(500).json({ message: 'An error occurred while checking for existing user.' });
            }

            if (row) {
                // If user already exists, return a user-friendly message
                return res.status(400).json({ message: 'User already exists with this email.' });
            }

            // Hash the password before saving
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insert the new user into the database
            const insertQuery = `
                INSERT INTO users (fullname, email, password, community, clan, familyname)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            db.run(insertQuery, [fullname, email, hashedPassword, community, clan, familyname], function (err) {
                if (err) {
                    // Catch unique constraint violation error
                    if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('users.email')) {
                        return res.status(400).json({ message: 'This email is already in use. Please use a different email.' });
                    }

                    console.error('Database error during user registration:', err);
                    return res.status(500).json({ message: 'An error occurred while registering the user.' });
                }

                // User registered successfully
                return res.status(201).json({ message: 'User registered successfully!' });
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = { registerUser };

































/**
 * 
 * WORKING CODE IN CASE THE OTHER ONE MESS UP REVERT TO THIS
 * 
 * const bcrypt = require('bcryptjs');
const db = require('../config/dbconfig');

const registerUser = async (req, res) => {
    const { fullname, email, password, community, clan, familyname } = req.body;

    // Validate that all required fields are present
    if (!fullname || !email || !password || !community || !clan || !familyname) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    try {
        // Check if a user with the given email already exists
        const query = `SELECT * FROM users WHERE email = ?`;
        db.get(query, [email], async (err, row) => {
            if (err) {
                console.error('Database error during user check:', err);
                return res.status(500).json({ message: 'An error occurred while checking for existing user.' });
            }

            if (row) {
                // If user already exists, return a user-friendly message
                return res.status(400).json({ message: 'User already exists with this email.' });
            }

            // Hash the password before saving
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insert the new user into the database
            const insertQuery = `
                INSERT INTO users (fullname, email, password, community, clan, familyname)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            db.run(insertQuery, [fullname, email, hashedPassword, community, clan, familyname], function (err) {
                if (err) {
                    // Catch unique constraint violation error
                    if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('users.email')) {
                        return res.status(400).json({ message: 'This email is already in use. Please use a different email.' });
                    }

                    console.error('Database error during user registration:', err);
                    return res.status(500).json({ message: 'An error occurred while registering the user.' });
                }

                // User registered successfully
                return res.status(201).json({ message: 'User registered successfully!' });
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = { registerUser };

 */