import { loadNotes } from "./add_notes.js";

export function deleteNote(id) {
    const formData = new FormData();
    formData.append('id', id);

    fetch('delete_note.php', {
        method: 'POST',
        body: formData
    })
        .then(responce => responce.json())
        .then(() => {
            loadNotes();
        })

}