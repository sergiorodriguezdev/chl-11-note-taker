// Import modules
const notes = require('express').Router(); // Create notes router
const path = require('path');
const fsUtil = require('../helpers/fsUtils');

// ---------- DELETE THIS ----------------
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// ---------- DELETE THIS ----------------

// Initialize notes database
if (!fsUtil.pathExists('./db/')) {
    // If db directory doesn't exist, create it and store an empty array in db.json file
    fsUtil.mkdir('./db/')
    fsUtil.writeToFile('./db/db.json', []);
} else if (!fsUtil.pathExists('./db/db.json')) {
    // Otherwise, if db.json file doesn't exist, store an empty array in it
    fsUtil.writeToFile('./db/db.json', []);
}

// GET route for notes API endpoint
//  Return all data from database
notes.get('/', (req, res) => 
    // Read contents from database and return them in response as JSON
    fsUtil.readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

// POST route for notes API endpoint
//  Add new note to database
//  Return new note
notes.post('/', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: Math.ceil(Math.random() * 1000)
        };

        fsUtil.readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote
        };

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
    const noteId = req.params.id;

    fsUtil.readFromFile('./db/db.json')
        .then(data => JSON.parse(data))
        .then(json => {
            const noteToDelete = json.findIndex(item => item.id === noteId);
            if (noteToDelete < 0) throw Error(`Note ${noteId} not found`);
            json.splice(noteToDelete, 1);
            fsUtil.writeToFile('./db/db.json', json);

            res.json(`Note ${noteId} was deleted successfully`);
        })
        .catch(error => {
            const deleteError = {
                status: 'fail',
                message: 'Error deleting note',
                error: error.message
            };
            console.log(error.message);
            res.json(JSON.stringify(deleteError));
        });
})

// Export notes router
module.exports = notes;