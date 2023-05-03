// Import modules
const express = require('express');
const path = require('path');
const api = require('./routes');

// Define port that app will listen on
//  Get value from an environment variable or set it to 3001
const PORT = process.env.PORT || 3001;

// Create express app
const app = express();

// Apply middleware in order to create POST routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Bind api endpoint to modular routes
app.use('/api', api);

// Serve public folder
app.use(express.static('public'));

// GET route for notes endpoint - serve notes.html page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// Wildcard GET route - serve landing HTML page
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Start app and listen on port specified
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);