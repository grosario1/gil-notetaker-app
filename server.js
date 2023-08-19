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
    res.sendFile(path.join(__dirname, '/public/pages/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for diagnostics page - wildcard page
app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/public/pages/404.html'));
});

// GET Route for api notes 
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    res.json(notes);
});

// GET Route for diagnostics page - wildcard page
app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/public/pages/404.html'));
});


app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));

    notes.push(newNote);

    fs.writeFileSync('db.json', JSON.stringify(notes));
    res.json(newNote);
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);