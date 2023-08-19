const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.port || 3001;

const app = express();


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// GET Route for home page
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route for wildcard pages
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// GET Route for api notes
app.get('/api/notes', (req, res) => {
    const notesData = fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8');
    const notes = JSON.parse(notesData);
    res.json(notes);
  });  

//POST to db.json
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notesData = fs.readFileSync('./db/db.json', 'utf8');
    const notes = JSON.parse(notesData);
  
    newNote.id = Date.now().toString();
  
    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(newNote);
  });
  
  app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
  );

