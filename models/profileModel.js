const db = require('../config/database'); // Adjust this to your database connection

// Function to find a profile by user ID
exports.findProfileById = async (userId) => {
    const query = 'SELECT * FROM users WHERE id = ?'; // Adjust based on your DB schema
    const [rows] = await db.execute(query, [userId]); // Execute query

    return rows[0]; // Return the first profile found
};
