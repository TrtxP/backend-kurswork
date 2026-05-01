import { loadNotes } from "./add_notes.js";

export function editNoteHeader(id, titleElement) {
    titleElement.addEventListener('blur', () => {
        const newTitle = titleElement.textContent.trim();

        titleElement.contentEditable = false;

        if (!newTitle) return;

        let formData = new FormData();
        formData.append('id', id);
        formData.append('title', newTitle);

        fetch('edit_note.php', {
            method: 'POST',
            body: formData
        })
        .then(responce => responce.json())
        .then(() => {
            loadNotes();
        });
    }, { once: true })
}

export function editNoteContent(id, textareaElement) {
    const saveContent = () => {
        const newContent = textareaElement.value.trim();

        textareaElement.readOnly = true;

        if (!newContent) return;

        let formData = new FormData();
        formData.append('id', id);
        formData.append('content', newContent);

        fetch('edit_note.php', {
            method: 'POST',
            body: formData
        })
        .then(responce => responce.json())
        .then(() => {
            loadNotes();
        });
    }

    textareaElement.addEventListener('blur', saveContent, { once: true });

    textareaElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            textareaElement.blur();
        }
    })
}