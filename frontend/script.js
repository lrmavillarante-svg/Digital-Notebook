let currentSubjectId = null;
const leftTextArea = document.getElementById("leftTextArea");
const rightTextArea = document.getElementById("rightTextArea");

// Render subjects dynamically
// Early failure - Switching broke when backend rejected updates.
// Solution - Added error handling so UI always refreshes correctly.
function renderSubjects(subjects) {
    const subjectsNav = document.getElementById("subjects");
    subjectsNav.innerHTML = "";

    subjects.forEach((s) => {
        let btn = document.createElement("button");
        btn.textContent = s.name;
        btn.setAttribute("data-id", s.id);

        // Switch subject
        btn.onclick = () => {
            currentSubjectId = s.id;
            loadNotes(s.id);
        };

        // Right-click menu
        btn.oncontextmenu = (event) => {
            event.preventDefault();
            showContextMenu(event, s.id);
        };

        subjectsNav.appendChild(btn);
    });

    // Add Subject button
    let addBtn = document.createElement("button");
    addBtn.textContent = "+ ADD SUBJECT";
    addBtn.onclick = addSubject;
    subjectsNav.appendChild(addBtn);
}

// Load notes for a subject
function loadNotes(subjectId){
    fetch('/subjects')
        .then(res => res.json())
        .then(subjects => {
            const subject = subjects.find(s => s.id == subjectId);
            if(subject){
                leftTextArea.value = subject.left;
                rightTextArea.value = subject.right;
            }
        });
}

// Save notes for current subject
function saveNotes(){
    if(!currentSubjectId) return;
    fetch(`/subjects/${currentSubjectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            left: leftTextArea.value,
            right: rightTextArea.value
        })
    })
    .then(res => res.json())
    .then(subjects => renderSubjects(subjects))
    .catch(err => console.error("Save failed:", err));
}

// Add new subject
function addSubject(){
    let newName = prompt("Enter subject name:");
    if(newName && newName.trim()){
        fetch('/subjects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        })
        .then(res => {
            if(!res.ok) return res.json().then(err => { throw err; });
            return res.json();
        })
        .then(subjects => renderSubjects(subjects))
        .catch(err => alert(err.error));
    }
}

// Right-click menu for rename/delete
function showContextMenu(event, subjectId){
    let oldMenu = document.getElementById("contextMenu");
    if(oldMenu) oldMenu.remove();

    let menu = document.createElement("div");
    menu.id = "contextMenu";

    // Rename option
    let renameButton = document.createElement("button");
    renameButton.textContent = "Rename";
    renameButton.onclick = function(){
        let newName = prompt("Enter new subject name:");
        if(newName && newName.trim()){
            fetch(`/subjects/${subjectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName })
            })
            .then(res => {
                if(!res.ok) return res.json().then(err => { throw err; });
                return res.json();
            })
            .then(subjects => renderSubjects(subjects))
            .catch(err => alert(err.error));
        }
        menu.remove();
    };
    menu.appendChild(renameButton);

    // Delete option
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function(){
        if(confirm("Delete this subject?")){
            fetch(`/subjects/${subjectId}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(subjects => {
                renderSubjects(subjects);
                if(currentSubjectId == subjectId){
                    leftTextArea.value = "";
                    rightTextArea.value = "";
                    currentSubjectId = null;
                }
            });
        }
        menu.remove();
    };
    menu.appendChild(deleteButton);

    document.body.appendChild(menu); 
    menu.style.position = "fixed";
    menu.style.left = event.clientX + "px";
    menu.style.top = event.clientY + "px";

    document.body.addEventListener("click", function(){
        if(menu) menu.remove();
    }, { once: true });
}

// Auto-save notes while typing
[leftTextArea, rightTextArea].forEach(area => {
    area.addEventListener("input", () => saveNotes());
});

// Start: load subjects on page open
window.onload = () => {
    fetch('/subjects')
        .then(res => res.json())
        .then(subjects => {
            renderSubjects(subjects);
            if(subjects.length > 0){
                currentSubjectId = subjects[0].id;
                loadNotes(currentSubjectId);
            }
        });
};