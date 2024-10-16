const bcrypt = require('bcryptjs');
const db = require('../config/maindatabase'); // Adjust path if needed
const express = require('express');
const router = express.Router();

/**/
// Controller function to register a new user
exports.registerUser = async (req, res) => {
    const { fullname, email, password, community, clan, familyname, address, maritalstatus, numberofchildren, stateofresidence, lgaofresidence, dateofbirth, isdobpublic, profile_picture } = req.body;

    // Check for required fields
    if (!fullname || !email || !password || !community || !clan || !familyname) {
        return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    try {
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into the database
        const query = `INSERT INTO mainusers (fullname, email, password, community, clan, familyname, address, maritalstatus, numberofchildren, stateofresidence, lgaofresidence, dateofbirth, isdobpublic, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await dbRun(query, [fullname, email, hashedPassword, community, clan, familyname, address, maritalstatus, numberofchildren, stateofresidence, lgaofresidence, dateofbirth, isdobpublic, profile_picture]);

        res.status(200).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration error:', error);
        // Check for duplicate email error (customize based on your DB)
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Email already in use.' });
        }
        res.status(500).json({ error: 'Database error: ' + error.message });
    }
};

// Utility function for database operations
const dbRun = (query, params) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

// Forgot Password: Generates a reset token and sends a reset link via email
exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Please provide your email address.' });
    }

    const query = `SELECT * FROM mainusers WHERE email = ?`;
    db.get(query, [email], (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        if (!user) {
            return res.status(400).json({ error: 'No account found with that email.' });
        }

        // Generate a password reset token and set expiration (1 hour)
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour

        // Update the user's reset token and expiration in the database
        const updateQuery = `UPDATE mainusers SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?`;
        db.run(updateQuery, [resetToken, resetTokenExpires, email], (err) => {
            if (err) {
                console.error('Database error while saving token:', err);
                return res.status(500).json({ error: 'Could not save reset token.' });
            }

            // Send reset link via email
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const resetLink = `http://localhost:5000/api/users/reset-password/${resetToken}`;
            const mailOptions = {
                to: email,
                from: process.env.EMAIL_USER,
                subject: 'Password Reset Request',
                text: `You are receiving this because you requested a password reset.\n\n` +
                    `Please click the following link to reset your password:\n\n` +
                    `${resetLink}\n\n` +
                    `If you did not request this, please ignore this email.\n`,
            };

            // Send the email
            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    console.error('Failed to send email:', error);
                    return res.status(500).json({ error: 'Failed to send email.' });
                }
                res.status(200).json({ message: 'Password reset link sent to email.' });
            });
        });
    });
};

// Reset Password: Verifies token and allows user to set a new password
exports.resetPassword = (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    // Check if both new password and confirmation are provided
    if (!newPassword || !confirmPassword) {
        return res.status(400).json({ error: 'Please provide both new password and confirmation.' });
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match.' });
    }

    // Validate the reset token and expiration
    const query = `SELECT * FROM mainusers WHERE resetPasswordToken = ? AND resetPasswordExpires > ?`;
    db.get(query, [token, Date.now()], (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token.' });
        }

        // Hash the new password and update the database
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing new password:', err);
                return res.status(500).json({ error: 'Error processing your request.' });
            }

            // Update user's password and clear reset token fields
            const updateQuery = `UPDATE mainusers SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?`;
            db.run(updateQuery, [hashedPassword, user.id], (err) => {
                if (err) {
                    console.error('Error updating password:', err);
                    return res.status(500).json({ error: 'Error updating password.' });
                }

                res.status(200).json({ message: 'Password has been reset successfully! Please log in again.' });
            });
        });
    });
};

// Controller function to log in a user
exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    // Validate that email and password are provided
    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    // Fetch user by email
    const query = `SELECT * FROM mainusers WHERE email = ?`;
    db.get(query, [email], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error while fetching user.' });
        }

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Error comparing passwords.' });
            }

            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid email or password.' });
            }

            res.status(200).json({ message: 'Login successful!', user });
        });
    });
};

module.exports = router; // Export the router
