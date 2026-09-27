# Digital-Notebook
Web Systems and Technology

A simple web-based notebook application built with **HTML, CSS, and JavaScript**.  
It allows users to create subjects, switch between them, and save notes in two text areas (left and right).  
Subjects can be renamed or deleted using a right-click context menu.

---

## Features
- Create multiple subjects with custom names
- Save notes in two separate text areas per subject
- Switch between subjects easily
- Rename or delete subjects via right-click menu
- Notes are preserved when switching subjects

---

## How to Use
1. Open `index.html` in your browser.
2. Start typing notes in the left and right text areas.
3. Use the subject buttons to switch between subjects.
4. Right-click a subject button to rename or delete it.
5. Use the **+ Add Subject** button to create new subjects.

---

## Technologies Used
- **HTML** for structure
- **CSS** for styling
- **JavaScript** for functionality

---

## Development Notes
- Initially, notes disappeared when switching subjects.  
  → Fixed by adding a `saveNotes()` function before switching.  
- Deleting subjects originally broke the array (`subjects[index] = null`).  
  → Fixed by clearing subject data instead of removing the object.  
- Positioning the context menu was tricky.  
  → Solved using `event.clientX` and `event.clientY`.  
- Adding new subjects required duplicating click and right-click logic.  
  → Used `subjects[subjects.length] = ...` instead of `push()` for simplicity.

---

## Future Improvements
- Local or Cloud storage so notes remain after closing the browser
- Better styling for the context menu
- Option to export notes
- Inserting Images
- User styling of font such as size, styles, highlight, strike through, underlined.

---
