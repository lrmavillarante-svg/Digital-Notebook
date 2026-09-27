
// ****************** ARRAY *************************** //
let subjects = [
    { name: "SUBJECT 1", left: "", right: "" },
    { name: "SUBJECT 2", left: "", right: "" },
    { name: "SUBJECT 3", left: "", right: "" },
    { name: "SUBJECT 4", left: "", right: "" },
    { name: "SUBJECT 5", left: "", right: "" }
    
];

// name is for the subject buttons, left and right are for the text areas.



// ****************** CURRENT SUBJECT *************************** //

let currentSubjectIndex = 0;
let leftTextArea = document.getElementById("leftTextArea");
let rightTextArea = document.getElementById("rightTextArea");

//Once the app opens, it should go to Subject 1 right away which is position 0 on array.
// Also, connects the text areas from html to javascript.



// ****************** LOADING FUNCTION ************************** //

function loadNotes(){
    leftTextArea.value = subjects[currentSubjectIndex].left;
    rightTextArea.value = subjects[currentSubjectIndex].right;
}

// Once the subject switched, this functions shows the text areas corresponding to
// the selected subject as well.
// 

// ****************** SAVING FUNCTION ************************** //

function saveNotes(){
    subjects[currentSubjectIndex].left = leftTextArea.value;
    subjects[currentSubjectIndex].right = rightTextArea.value;
}

// Once the user type anything on either text area, this function save it to the array.
// This will ensure that the user's work will be saved on the correct subject.
// During initial testing, notes are disappearing so I added this function.




// ****************** RIGHT-CLICK FUNCTION ************************** //

// When the user right clicked to any subject buttons, two options should show up.
// Rename or delete.

// --- Avoid duplicate menu --- //

function showContextMenu(event, button, index){
    let oldMenu = document.getElementById("contextMenu");
    if(oldMenu) oldMenu.remove();

    // At first, right clicking multiple times will show multiple menus.
    // This functions deletes the old menu once new one was created.


// --- Create menu --- //

    let menu = document.createElement("div");
    menu.id = "contextMenu";

    //On my previous Java Swing program, I create the element and hide it until I need it.
    //Here, learned that we can create and delete the element only when needed.

// --- Rename option --- //

    let renameButton = document.createElement("button");
    renameButton.textContent = "Rename";
    renameButton.onclick = function(){
        let newName = prompt("Enter new subject name:");
        if(newName){
            subjects[index].name = newName;
            button.textContent = newName;
        }
        menu.remove();
    };
    menu.appendChild(renameButton);

    //This function let's the user rename a subject and removes the menu after the process.
    //At first, I was using addEventListener but not doing anything.
    //I found samples online where they use onclick like this.

    //appendChild syntax
    //This helps to add the rename function on the contextmenu
    //This is similar on Java Swing's adding of component to their respective panel/frame.

    

// --- Delete option --- //
let deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";
deleteButton.onclick = function(){
    if(confirm("Delete this subject?")){
        // Clear the subject’s notes instead of removing the whole object
        subjects[index].left = "";
        subjects[index].right = "";
        subjects[index].name = "(Deleted)";

        button.remove();

        // If we deleted the active subject, clear text areas
        if(currentSubjectIndex === index){
            leftTextArea.value = "";
            rightTextArea.value = "";
        }
    }
    menu.remove();
};
menu.appendChild(deleteButton);

//This function deletes a subject and their respective notes all together.
//At first, after I delete a subject, the notes stays because they aren't deleted in array.
// This breaks the array and the connection between subject > notes becomes inconsistent already.
// So from old idea of subject[index] = null >> which is setting the deleted info to null,
// I learned that we can just clear the data instead. (Googled this part).
// appendChild is to add the delete button to the main menu as a component.



// --- Connect the contextMenu (Right-click) to HTML --- //
    document.body.appendChild(menu); 
    menu.style.position = "fixed";
    menu.style.left = event.clientX + "px";
    menu.style.top = event.clientY + "px";

    //At first, right clicking won't do anything even though we have the function for it.
    //So I appended it to the document itself to make it show up.
    //However, after right click, the menu goes on the lower left corner.
    //The menu.style lines fixed it on the right side of the arrow after clicking.



// --- Remove the Right-Click Menu if not needed --- //

    document.body.addEventListener("click", function(){
        if(menu) menu.remove();
    }, { once: true });
}

//At first, once right click was created, it won't disappear unless the user delets or rename something.
//This will delete the menu if the user click somewhere else.
// The syntax {one: true} makes it possible | Learned it through googling the problem.
// Adding this syntax will make the listener runs only once.




// ****************** ADD NEW SUBJECT ************************** //
let addButton = document.getElementById("addSubject");
addButton.onclick = function(){
    let newName = prompt("Enter subject name:");
    if(newName){
        let newIndex = subjects.length;
        subjects[newIndex] = { name: newName, left: "", right: "" };

        //This adds the newly created subject to the array.

        let newButton = document.createElement("button");
        newButton.textContent = newName;

        //This creates as new button for the new subject created.

// --- Switching --- //
        newButton.onclick = function(){
            saveNotes();
            currentSubjectIndex = newIndex;
            loadNotes();
        };
        //Earlier tests found that new subjects doesn't switch.
        // Added this to give it the same function as well.


// --- Right-click --- //
        newButton.oncontextmenu = function(event){
            event.preventDefault();
            showContextMenu(event, newButton, newIndex);
        };

        //Earlier tests found that new subjects doesn't respond to right click.
        // Added this to give it the same function as well.

// --- Add new button to nav ID = Subjects in HTML to give it the same styling --- //
        let subjectsNav = document.getElementById("subjects");
        subjectsNav.insertBefore(newButton, addButton);
    }

    //At first, I used appendChild to connect the new subject button to the nav Subjects but
    // it's going on the right side of "+ Add subject" button so I had to insert it before.
};








// ****************** INITIAL SUBJECT BUTTONS ************************** //
function setupButton(button, index){
    button.onclick = function(){
        saveNotes();
        currentSubjectIndex = index;
        loadNotes();
    };
    button.oncontextmenu = function(event){
        event.preventDefault();
        showContextMenu(event, button, index);
    };
}

//This function is for the first 5 subjects.
//To help them switch and make sure to save the notes first before loading the next one.

setupButton(document.getElementById("subject1"), 0);
setupButton(document.getElementById("subject2"), 1);
setupButton(document.getElementById("subject3"), 2);
setupButton(document.getElementById("subject4"), 3);
setupButton(document.getElementById("subject5"), 4);

// ****************** START ************************** //
loadNotes();

//This loads the first subjects notes when the app opens.