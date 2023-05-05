// ------------------------------------------------------------------------------------------
// I borrowed this module from the bootcamp in-class mini project exercise and modified 
// it slightly to fit my solution
//  Week 11     - Express
//  Activity 28 - Student Mini Project
// ------------------------------------------------------------------------------------------

const fs = require('fs');
const util = require('util');

// Rename fs.existsSync and fs.mkdirSync functions
const pathExists = fs.existsSync;
const mkdir = fs.mkdirSync;
// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);
/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.notes_id_counter++; // Increment next note ID metadata by 1
      parsedData.notes.push(content);
      writeToFile(file, parsedData);
    }
  });
};

module.exports = { 
    pathExists, 
    mkdir, 
    readFromFile, 
    writeToFile, 
    readAndAppend 
};