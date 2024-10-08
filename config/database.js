const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database
const db = new sqlite3.Database('./amon.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    } else {
        // Only create the users table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullname TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            community TEXT NOT NULL,
            clan TEXT NOT NULL,
            familyname TEXT NOT NULL,
            resetPasswordToken TEXT,
            resetPasswordExpires INTEGER
        )`, (err) => {
            if (err) {
                console.error("Error creating users table:", err.message);
            } else {
                console.log("Ready and Connected to Database.");
            }
        });
    }
});

module.exports = db;


        


        

/**WORKING CODE IN CASE THE OTHER MESS UP REVERT TO THIS 
 * const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database
const db = new sqlite3.Database('./amon.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        const sqlite3 = require('sqlite3').verbose();

                // Create the users table if it doesn't exist
                db.run(`CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    fullname TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    community TEXT NOT NULL,
                    clan TEXT NOT NULL,
                    familyname TEXT NOT NULL
                )`, (err) => {
                    if (err) {
                        console.error("Error creating users table:", err.message);
                    } else {
                        console.log("Users table is ready.");
                    }
                });
            }
        });
        
        module.exports = db;
*/