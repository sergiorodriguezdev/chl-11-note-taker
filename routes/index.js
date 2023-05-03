// Import modules
const express = require('express');

// Import notes modular router
const notesRouter = require('./notes');

// Create express app
const app = express();

// Bind notes routes to notes endpoint
app.use('/notes', notesRouter);

// Export api object
module.exports = app;