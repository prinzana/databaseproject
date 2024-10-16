const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database
const db = new sqlite3.Database('./amon.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    } else {
        // Create the mainusers table combining columns from both users and additional_details
        db.run(`CREATE TABLE IF NOT EXISTS mainusers (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT, -- Set user_id as the primary key
            fullname TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            community TEXT NOT NULL,
            clan TEXT NOT NULL,
            familyname TEXT NOT NULL,
            resetPasswordToken TEXT,
            resetPasswordExpires INTEGER,
            occupation TEXT,
            maritalstatus TEXT,
            numberofchildren INTEGER,
            address TEXT,
            stateofresidence TEXT,
            lgaofresidence TEXT,
            dateofbirth INTEGER, -- Store as Unix timestamp
            isdobpublic INTEGER, -- 1 for true, 0 for false
            profile_picture TEXT -- Store file path or URL of the profile picture
        )`, (err) => {
            if (err) {
                console.error("Error creating mainusers table:", err.message);
            } else {
                console.log("Empty mainusers");
            }
        });
    }
});

module.exports = db;
