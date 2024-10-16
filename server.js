/// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const profileRoutes = require('./routes/profileroute'); // Import profile routes
const path = require('path'); // Import the path module for handling file paths
const sqlite3 = require('sqlite3').verbose(); // Import sqlite3 for database operations

// Initialize the Express application
const app = express();



// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Middleware to parse JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded requests
app.use(express.static('public')); // Serve static files from 'public' directory
app.use('/uploads', express.static('uploads')); // Serve uploaded images


// Logging middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`); // Log the method and URL of the incoming request
    next(); // Proceed to the next middleware or route
});

// Connect to your SQLite database
const db = new sqlite3.Database('./amon.db', (err) => {
    if (err) {
        console.error(err.message); // Log error message if there's an issue connecting
    } else {
        console.log('Connected to the SQLite database.'); // Confirm successful connection
    }
});



// Route for serving the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html')); // Serve homepage HTML file
});

// Serve the user profile page
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/profile.html'));
});

// Middleware to attach the database connection to the request object
app.use((req, res, next) => {
    req.db = db; // Attach the database connection to the request object for use in routes
    next(); // Proceed to the next middleware
});

// File upload middleware
const fileUpload = require('express-fileupload');
app.use(fileUpload()); // Enable file upload handling

// Use the user routes
app.use('/api/users', userRoutes); // Ensure this matches your route setup for user-related API

// Use the profile routes
app.use('/api/profile', profileRoutes); // Ensure this matches your route setup for profile-related API

// Use the update profile routes


// Catch 404 errors (place after route definitions)
app.use((req, res, next) => {
    res.status(404).send('Not Found'); // Send a 404 response if no route is matched
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace
    res.status(500).send('Something broke!'); // Send a 500 response for server errors
});

// Define the PORT variable
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Confirm server is running and listening
});
