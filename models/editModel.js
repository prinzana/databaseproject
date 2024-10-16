const db = require('../config/database'); // Import the database connection

const User = {
    // Function to update user details
    update: (id, data, callback) => {
        const { fullName, email, community, clan, familyName, stateOfResidence, address, lgaOfResidence, occupation, sex, maritalStatus, numberOfChildren, dateOfBirth } = data;
        
        const sql = `UPDATE users SET fullname = ?, email = ?, community = ?, clan = ?, familyname = ?, state_of_residence = ?, address = ?, lga_of_residence = ?, resetPasswordToken = NULL WHERE id = ?`;
        
        db.run(sql, [fullName, email, community, clan, familyName, stateOfResidence, address, lgaOfResidence, id], function(err) {
            callback(err, this.changes);
        });
    },
    // Function to find user by ID
    findById: (id, callback) => {
        const sql = `SELECT * FROM users WHERE id = ?`;
        db.get(sql, [id], (err, row) => {
            callback(err, row);
        });
    }
};

module.exports = User;
