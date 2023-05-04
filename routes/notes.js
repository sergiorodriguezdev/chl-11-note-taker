// Import modules
const notes = require('express').Router(); // Create notes router
const path = require('path');
const fsUtil = require('../helpers/fsUtils');

// Base database object structure
const baseObject = {
    notes_id_counter: 1,
    notes: []
};

// Initialize notes database
// If db directory doesn't exist, create it
if (!fsUtil.pathExists('./db/')) fsUtil.mkdir('./db/');

// If db.json file doesn't exist, store a base database object in it
if (!fsUtil.pathExists('./db/db.json')) fsUtil.writeToFile('./db/db.json', baseObject);

// Global variable
//  Retrieve the next ID from the database metadata 
let newNoteId;
fsUtil.readFromFile('./db/db.json').then((data) => newNoteId = JSON.parse(data).notes_id_counter);

// GET route for notes API endpoint
//  Return all data from database
notes.get('/', (req, res) => 
    // Read contents from database and return the notes array in response as JSON
    fsUtil.readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data).notes))
);

// POST route for notes API endpoint
//  Add new note to database
//  Return new note or error
notes.post('/', (req, res) => {
    // Desconstruct body object - extract title and text properties
    const { title, text } = req.body;

    // If title and text have data then add a new note
    //  Otherwise, respond with an error
    if (title && text) {

        // Create new note object
        const newNote = {
            title,
            text,
            id: newNoteId // Set ID to value retrieved from database metadata
        };

        // Append new note entry
        fsUtil.readAndAppend(newNote, './db/db.json');

        // Create new response object
        const response = {
            status: 'success',
            body: newNote
        };

        // Increment global ID variable by 1
        newNoteId = newNote.id + 1;
        
        // Return response object
        res.json(response);
    } else {
        res.json('Error saving note');
    }
});

// DELETE route for notes API endpoint
//  Receives note's unique identifier
//  Deletes specified note from database
//  Returns nothing
notes.delete('/:id', (req, res) => {
    // Extract note ID value from URL parameters (as a number)
    const noteId = parseInt(req.params.id);

    // Read data from database
    fsUtil.readFromFile('./db/db.json')
        .then(data => JSON.parse(data))
        .then(json => {

            // Finx index of note to delete
            const noteToDelete = json.notes.findIndex(item => item.id === noteId);
            
            // If index not found (-1) then throw error
            if (noteToDelete < 0) throw Error(`Note ${noteId} not found`);
            
            // Remove note from array
            json.notes.splice(noteToDelete, 1);

            // Save updates to database
            fsUtil.writeToFile('./db/db.json', json);

            // Return confirmation message
            res.json(`Note ${noteId} was deleted successfully`);
        })
        .catch(error => {

            // If an error is found, then create error object
            const deleteError = {
                status: 'fail',
                message: 'Error deleting note',
                error: error.message
            };

            console.log(error.message);

            // Return error object
            res.json(JSON.stringify(deleteError));
        });
})

// Export notes router
module.exports = notes;