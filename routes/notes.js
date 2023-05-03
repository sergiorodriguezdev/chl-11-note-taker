// Import modules
const notes = require('express').Router(); // Create notes router
const path = require('path');

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// GET route for notes API endpoint
//  Return all data from database
notes.get('/', (req, res) => 
    // res.sendFile(path.join(__dirname, 'public/notes.html'))
    res.json("All good here")
);

// POST route for notes API endpoint
//  Add new note to database
//  Return new note

// DELETE route for notes API endpoint
//  Receives note's unique identifier
//  Deletes specified note from database
//  Returns... ?

// Export notes router
module.exports = notes;