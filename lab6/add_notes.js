import { editNoteHeader, editNoteContent } from "./edit_note.js";
import { deleteNote } from "./delete_note.js";

document.getElementById('add-notes').onsubmit = function (e) {
    e.preventDefault();

    let title = document.getElementById('title').value.trim();
    let content = document.getElementById('content').value.trim();

    if (!title || !content) {
        alert('Форма додавання замітки має бути заповнена!');
        return;
    }

    let formData = new FormData(this);

    fetch('add_notes.php', {
        method: 'POST',
        body: formData
    })
        .then(responce => responce.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                this.reset();
                loadNotes();
            }
        })
}

const notesList = document.getElementById('list-of-notes');
const addNote = document.getElementById('add-note');

export function loadNotes() {
    fetch('get_notes.php')
        .then(responce => responce.json())
        .then(data => {
            renderNotes(data);
        })
        .catch(error => {
            console.log(error);
        })
}

function renderNotes(notes) {
    notesList.innerHTML = notes.map(note => `
        <div class="note-item" data-id="${note.id}">
            <div class="block">
                <span><b>${note.title}</b></span>
                <button class="edit-title">Edit</button>
            </div>
            <div class="block">
                <textarea rows="5" cols="10">${note.content}</textarea>
                <button class="edit-content">Edit</button>
            </div>
            <button class="delete-note">Delete</button>
        </div>
        `).join('');
}

notesList.addEventListener('click', event => {
    const noteItem = event.target.closest('.note-item');
    if (!noteItem) return;

    const id = noteItem.dataset.id;
    const title = noteItem.querySelector('span');
    const content = noteItem.querySelector('textarea');

    title.contentEditable = false;
    content.readOnly = true;


    if (event.target.classList.contains('edit-title')) {
        title.contentEditable = true;
        title.focus();
        editNoteHeader(id, title);
    }

    if (event.target.classList.contains('edit-content')) {
        content.readOnly = false;
        content.focus();
        editNoteContent(id, content);
    }

    if (event.target.classList.contains('delete-note')) {
        deleteNote(id);
    }
});

loadNotes();