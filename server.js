require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Adjust the path as necessary
const path = require('path'); // Import the path module
const sqlite3 = require('sqlite3').verbose(); // Import sqlite3

// Initialize the app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Middleware to parse JSON requests
app.use(express.static('public')); // Serve static files from 'public' directory

// Logging middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`); // Log the method and URL of the incoming request
    next();
});

// Connect to your SQLite database
const db = new sqlite3.Database('./amon.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Serve the homepage on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html')); // Adjust the path as necessary
});

// Use the user routes (pass the `db` connection to routes if needed)
app.use('/api/users', (req, res, next) => {
    req.db = db; // Attach the db to the request object
    next();
}, userRoutes);

// Catch 404 errors (place after route definitions)
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});





/**WORKING CODE IN CASE THE OTHER MESS UP REVERT TO THIS 
 * 
 * 
 * 
 * 
 * 
 * require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.use('/api/users', userRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
*/


/**working server.js code, revert if issues encountered
 * 
 * // Import necessary modules
require('dotenv').config(); // Ensure you load environment variables from .env file
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Adjust the path as necessary
const path = require('path'); // Import the path module
const sqlite3 = require('sqlite3').verbose(); // Import sqlite3


// Initialize the app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Middleware to parse JSON requests
app.use(express.static('public')); // Serve static files from 'public' directory

// Serve the homepage on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html')); // Adjust the path as necessary
});

// Connect to your SQLite database (Make sure the path is correct)
const db = new sqlite3.Database('./amon.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Log incoming requests for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`); // Log the method and URL of the incoming request
    next();
});

// Use the user routes
app.use('/api/users', userRoutes);

// Start your server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});







/**WORKING CODE IN CASE THE OTHER MESS UP REVERT TO THIS 
 * 
 * 
 * 
 * 
 * 
 * require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.use('/api/users', userRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
*/
 