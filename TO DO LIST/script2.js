let notes = [];
let counter = 0;
let editItemId = -1;

class Note {
    constructor(title, description, checked) {
        this.title = title;
        this.description = description;
        this.checked = checked;
    }
}

window.addEventListener('load', () => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        notes.forEach((n, index) => {
            createElementNote(n, index);
        });
        counter = notes.length;
    }
});

function saveToJson() {

    localStorage.setItem('notes', JSON.stringify(notes));

    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "notes.json";
    link.click();
}

function loadFromJson() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.addEventListener('change', () => {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result); // Parsowanie JSON
                    const dataInModel = data.map(item => new Note(item.title, item.description, item.checked));
                    notes = dataInModel;
                    
                    deleteNotes();  // Usuwamy wszystkie istniejące notatki
                    data.forEach((n, index) => {  // Działamy na danych
                        createElementNote(n, index); // Tworzymy elementy dla każdej notatki
                    });
                    counter = notes.length;
                } catch (error) {
                    console.error('Parsing JSON error: ', error);
                    return;
                }
            };
            
            reader.readAsText(file);
        }
    });

    input.click();
}

function deleteNotes() {
    const divElement = document.getElementById("square");
    // Usuwanie wszystkich dzieci   
    while (divElement.firstChild) {
        divElement.removeChild(divElement.firstChild);
    }
}

function deleteNote(id) {
    const sekcja = document.getElementById(id);
    const index = parseInt(id.split('-')[1]);
    notes.splice(index, 1);
    sekcja.remove();
    refreshIndexes();
    localStorage.setItem('notes', JSON.stringify(notes));
}

function showAddWindow(title, description) {
    const titleInput = document.getElementById('input');
    const descriptionInput = document.getElementById('txtarea');
    titleInput.value = title;
    descriptionInput.value = description;
    document.getElementById('addWindow').style.display = 'block';
}

function hideAddWindow() {
    const titleInput = document.getElementById('input');
    const descriptionInput = document.getElementById('txtarea');
    titleInput.value = '';
    descriptionInput.value = '';
    document.getElementById('addWindow').style.display = 'none';
}

function addNewNote() {
    const titleInput = document.getElementById('input');
    const descriptionInput = document.getElementById('txtarea');
    if (!titleInput.value.trim()) {
        playAlert();
        return;
    }
    if(editItemId < 0) {
        const newNote = new Note(titleInput.value, descriptionInput.value, false);
        notes.push(newNote);
        createElementNote(newNote, notes.length - 1);
        console.log(newNote);
    }
    else {
        editNode(editItemId, titleInput.value,descriptionInput.value);
    }
    saveDataToLocalStorage();
    hideAddWindow();
}

function saveDataToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function showNoteToEdit(id) {
    const itemToEdit = notes[id];
    editItemId = id;
    showAddWindow(itemToEdit.title, itemToEdit.description);
}

function editNode(id, title, description) {
    notes[id].title = title;
    notes[id].description = description;
    let htmlTask = document.getElementById("Task-"+id);
    htmlTask.querySelector('.Title1').textContent = title;
    htmlTask.querySelector('.Description1').textContent = description;
    editItemId = -1;
}

function checkNode(id) {
    const sekcja = document.getElementById(id);
    const index = parseInt(id.split('-')[1]);
    const przycisk = sekcja.querySelector('.checkButton i');

    notes[index].checked = !notes[index].checked;

    if (notes[index].checked) {
        sekcja.classList.add('cheked');
        przycisk.classList.replace('fa-regular', 'fa-solid');
        przycisk.classList.replace('fa-circle-check', 'fa-check-circle');
    } else {
        sekcja.classList.remove('cheked');
        przycisk.classList.replace('fa-solid', 'fa-regular');
        przycisk.classList.replace('fa-check-circle', 'fa-circle-check');
    }
    saveDataToLocalStorage();
}

function createElementNote(note, index) {
    counter++;
    //add main container
    const mainContainer = document.createElement('section');
    mainContainer.id = 'Task-' + index;
    mainContainer.className = 'section';

    if (note.checked) mainContainer.classList.add('checked');
    document.getElementById('square').appendChild(mainContainer);

    //add title
    let title = document.createElement('h2');
    title.className = 'Title1';
    title.textContent = note.title;
    mainContainer.appendChild(title);

    //add description
    let description = document.createElement('p');
    description.className = 'Description1';
    description.textContent = note.description;
    mainContainer.appendChild(description);


    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'buttons';
    mainContainer.appendChild(buttonContainer);

    let editButton = document.createElement('button');
    editButton.classList.add('editButton');
    editButton.addEventListener('click', () => showNoteToEdit(index));
    buttonContainer.appendChild(editButton);

    let editIcon = document.createElement('i');
    editIcon.classList.add('fa-solid', 'fa-pen');
    editButton.appendChild(editIcon);

    let deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteButton');
    deleteButton.addEventListener('click', () => deleteNote(mainContainer.id));
    buttonContainer.appendChild(deleteButton);

    let deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-solid', 'fa-trash');
    deleteButton.appendChild(deleteIcon);

    let checkButton = document.createElement('button');
    checkButton.classList.add('checkButton');
    checkButton.addEventListener('click', () => checkNode(mainContainer.id));
    buttonContainer.appendChild(checkButton);

    let checkIcon = document.createElement('i');
    checkIcon.classList.add('fa-regular', 'fa-circle-check');
    checkButton.appendChild(checkIcon);
}

function refreshIndexes() {
    const sekcje = document.querySelectorAll('.section');
    sekcje.forEach((sekcja, index) => {
        sekcja.id = 'Task-' + index;
    });
}

function playAlert() {
    Swal.fire({
        title: 'Title is required!',
        text: 'Please enter correct data!',
        icon: 'error',
        confirmButtonText: 'OK',
    });
}