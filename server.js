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

// GET Route for api notes
app.get('/api/notes', (req, res) => {
  const notesData = fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8');
  const notes = JSON.parse(notesData);
  res.json(notes);
});

// POST Route for saving a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notesData = fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8');
  const notes = JSON.parse(notesData);

  newNote.id = Date.now().toString();

  notes.push(newNote);
  fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(notes));
  res.json(newNote);
});

// DELETE Route for deleting a note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  let notesData = fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8');
  const notes = JSON.parse(notesData);

  const updatedNotes = notes.filter((note) => note.id !== noteId);

  fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(updatedNotes));
  res.json({ message: 'Note deleted successfully' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);