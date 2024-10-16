const db = require('../config/database'); // Import the database connection

const AdditionalDetails = {
    // Function to update or insert additional user details
    updateOrInsert: (userId, data, callback) => {
        const { occupation, maritalStatus, numberOfChildren, address, stateOfResidence, lgaOfResidence, dateOfBirth, isDobPublic } = data;

        const sql = `
            INSERT INTO additional_details (user_id, occupation, marital_status, number_of_children, address, state_of_residence, lga_of_residence, date_of_birth, is_dob_public)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET 
                occupation = excluded.occupation,
                marital_status = excluded.marital_status,
                number_of_children = excluded.number_of_children,
                address = excluded.address,
                state_of_residence = excluded.state_of_residence,
                lga_of_residence = excluded.lga_of_residence,
                date_of_birth = excluded.date_of_birth,
                is_dob_public = excluded.is_dob_public
        `;
        
        db.run(sql, [userId, occupation, maritalStatus, numberOfChildren, address, stateOfResidence, lgaOfResidence, dateOfBirth, isDobPublic], function(err) {
            callback(err, this.changes);
        });
    }
};

module.exports = AdditionalDetails;
