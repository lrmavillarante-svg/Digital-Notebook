const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// ***************** SERVE FRONTEND FILES ***************** //
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Helper functions to read/write subjects.json
// Early failures were notes were not saving after refresh.
// To fix it, I ensured readSubjects() and writeSubjects() always handle JSON correctly
function readSubjects() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'subjects.json')));
}
function writeSubjects(subjects) {
  fs.writeFileSync(path.join(__dirname, 'subjects.json'), JSON.stringify(subjects, null, 2));
}

// ---------------- ROUTES ---------------- //

// GET all subjects
app.get('/subjects', (req, res) => {
  res.json(readSubjects());
});

// POST add subject
// Earlier failures includes "allowing blank names" and "duplicates"
// To fix it, added validation.
app.post('/subjects', (req, res) => {
  const subjects = readSubjects();
  const name = req.body.name?.trim();

  if (!name) {
    return res.status(400).json({ error: "Subject name required" });
  }

  const exists = subjects.some(s => s.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "Subject name already exists" });
  }

  const newSubject = { id: Date.now(), name, left: "", right: "" };
  subjects.push(newSubject);
  writeSubjects(subjects);
  res.json(subjects);
});

// PUT update subject (rename or save notes)
// Earlier failure includes "switching broke when rename validation was too strict".
// To fix it, only apply duplicate/blank checks when renaming, not when saving notes.
app.put('/subjects/:id', (req, res) => {
  let subjects = readSubjects();
  const id = req.params.id;
  const newName = req.body.name?.trim();

  subjects = subjects.map(s => {
    if (s.id == id) {

      if (req.body.name !== undefined) {
        if (!newName) {
          return s; 
        }
        const duplicate = subjects.some(
          subj => subj.id != id && subj.name.toLowerCase() === newName.toLowerCase()
        );
        if (duplicate) {
          return s; 
        }
        s.name = newName;
      }
  
      if (req.body.left !== undefined) s.left = req.body.left;
      if (req.body.right !== undefined) s.right = req.body.right;
    }
    return s;
  });

  writeSubjects(subjects);
  res.json(subjects);
});

// DELETE subject
// Earlier failures includes deleting current subject left notes visible.
// To fix it, frontend clears text areas when current subject is deleted.
app.delete('/subjects/:id', (req, res) => {
  let subjects = readSubjects();
  const id = req.params.id;
  subjects = subjects.filter(s => s.id != id);
  writeSubjects(subjects);
  res.json(subjects);
});

// ---------------- START SERVER ---------------- //
const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));