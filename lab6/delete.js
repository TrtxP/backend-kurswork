import { loadUsers } from "./get_users.js";

export function deleteUser(id) {
    if (!confirm('Ви точно хочете видалити користувача?')) return;

    const formData = new FormData();
    formData.append('id', id);

    fetch('delete.php', {
        method: 'POST',
        body: formData
    })
        .then(responce => responce.json())
        .then(() => {
            loadUsers();
        })
}