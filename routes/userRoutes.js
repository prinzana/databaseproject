const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');
const db = require('../config/database'); // Adjust path if needed

// Utility functions for database operations (assuming these are defined)////////////////////////////////////////////////////////////////////
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
    const { fullname, email, password, community, clan, familyname } = req.body;

    // Validate required fields
    if (!fullname || !email || !password || !community || !clan || !familyname) {
        return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    try {
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into the database
        await dbRun(`INSERT INTO users (fullname, email, password, community, clan, familyname) VALUES (?, ?, ?, ?, ?, ?)`, 
            [fullname, email, hashedPassword, community, clan, familyname]);

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



// Profile Update Route/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Forgot Password Route///////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(400).json({ message: 'No account found with that email.' });
        }

        // Generate reset token and expiration///////////////////////////////////////////////////////////////////////////////////////////////
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpires = Date.now() + 3600000; // Token valid for hour

        // Update user record///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        await dbRun('UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?', 
            [resetToken, resetTokenExpires, email]);

        // Send email with the reset link////////////////////////////////////////////////////////////////////////////////////////////////////
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `http://localhost:5000/api/users/reset-password/${resetToken}`;
        const mailOptions = {
            to: email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset',
            text: `Click the following link to reset your password:\n\n ${resetLink} \n\n If you did not request this, please ignore this email.`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent!' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
});

// Serve the password reset HTML form///////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const user = await dbGet('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?', 
            [token, Date.now()]);
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        res.sendFile(path.join(__dirname, '../public/resetpassword.html'));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Password Reset Route
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    // Check if both passwords are provided
    if (!newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'Please provide both new password and confirmation.' });
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    try {
        const user = await dbGet('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?', 
            [token, Date.now()]);

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password and clear the reset token
        await dbRun('UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?', 
            [hashedPassword, user.id]);

        res.status(200).json({ message: 'Password has been reset successfully!' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred while resetting your password.' });
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// User Login Route///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    try {
        const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        res.status(200).json({ message: 'Login successful!', user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});

module.exports = router;










/**           
 // Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;
    try {
        const user = await dbGet(query, [email]);

        if (!user) {
            console.log(`No user found with email: ${email}`);
            return res.status(400).json({ message: 'No account found with that email.' });
        }

        // Generate and send reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpires = Date.now() + 3600000; // Token valid for 1 hour

        // Update user with the reset token and expiration
        await dbRun(`UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?`, 
            [resetToken, resetTokenExpires, email]);

        // Setup nodemailer to send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `http://localhost:5000/api/users/reset-password/${resetToken}`;
        console.log(`Reset link: ${resetLink}`);

        const mailOptions = {
            to: email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset',
            text: `Click the following link to reset your password:\n\n ${resetLink} \n\n If you did not request this, please ignore this email.`,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent!' });
        
    } catch (error) {
        console.error('Error processing forgot password request:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
});

// Serve the password reset HTML form when the user clicks on the reset link
router.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    console.log('Token received:', token);

    const query = `SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?`;
    try {
        const user = await dbGet(query, [token, Date.now()]);

        if (!user) {
            console.log('Invalid or expired token.');
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        res.sendFile(path.join(__dirname, '../public/resetpassword.html'), (err) => {
            if (err) {
                console.error('Error sending reset password form:', err);
                res.status(500).json({ message: 'Error serving reset password form.' });
            }
        });
        
    } catch (error) {
        console.error('Error processing reset password request:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
});

// Password Reset Route (Handles form submission for new password)
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const query = `SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?`;
    try {
        const user = await dbGet(query, [token, Date.now()]);

        if (!user) {
            console.log('Invalid or expired token.');
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log(`New password hashed for user: ${user.email}`);

        // Update user record with the new password and clear reset token fields
        await dbRun(`UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?`, 
            [hashedPassword, user.id]);

        res.status(200).json({ message: 'Password has been reset successfully!' });
        
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'An error occurred while resetting your password.' });
    }
});


 */





/** workable codes before the above(present codes)
 const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // For generating reset tokens
const nodemailer = require('nodemailer'); // For sending reset emails
const db = require('../config/database'); // Database configuration
const path = require('path'); // To serve the password reset form
require('dotenv').config(); // To load environment variables

const router = express.Router();
const secretKey = 'yourSecretKey'; // Ensure you keep this secret!
const { registerUser } = require('../controllers/userController'); // Import registerUser function

// Forgot Password Route
router.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.' });
        }

        if (!user) {
            return res.status(400).json({ message: 'No account found with that email.' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpires = Date.now() + 3600000; // Token valid for 1 hour

        const updateQuery = `UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?`;
        db.run(updateQuery, [resetToken, resetTokenExpires, email], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving reset token.' });
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail', // Ensure this matches your email service
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const resetLink = `http://localhost:5000/reset-password/${resetToken}`;

            const mailOptions = {
                to: email,
                from: process.env.EMAIL_USER,
                subject: 'Password Reset',
                text: `Click the following link to reset your password:\n\n ${resetLink} \n\n If you did not request this, please ignore this email.`,
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    return res.status(500).json({ message: 'Error sending email.' });
                }
                res.status(200).json({ message: 'Password reset email sent!' });
            });
        });
    });
});

// Serve the password reset HTML form when user clicks on the reset link
router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;

    // Optionally validate the token before serving the form
    const query = `SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?`;
    db.get(query, [token, Date.now()], (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        // Serve the reset password form if token is valid
        res.sendFile(path.join(__dirname, '../public/resetpassword.html')); // Serve from 'public' directory
    });
});

// Password Reset Route (Handles form submission for new password)
router.post('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const query = `SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?`;
    db.get(query, [token, Date.now()], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.' });
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password

        const updateQuery = `UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?`;
        db.run(updateQuery, [hashedPassword, user.id], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error resetting password.' });
            }

            res.status(200).json({ message: 'Password has been reset successfully!' });
        });
    });
});

// Route for user registration
router.post('/register', registerUser);

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while fetching user.' });
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login successful!', token });
    });
});

module.exports = router;
 */














//Funtional route kept safe

/**const express = require('express');
const { registerUser } = require('../controllers/userController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database'); // Database configuration
const secretKey = 'yourSecretKey'; // Make sure to keep your secret key safe!

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validate that email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    // Check if the user exists
    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while fetching user.' });
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // If password matches, generate a JWT token
        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        // Send the token back to the client
        return res.status(200).json({ message: 'Login successful!', token });
    });
});

// Export the router
module.exports = router;










 */























/**WORKING CODE IN CASE THE OTHER MESS UP REVERT TO THIS
 * 
 * 
 * const express = require('express');
const { registerUser } = require('../controllers/userController');

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

module.exports = router;
 * 
 */