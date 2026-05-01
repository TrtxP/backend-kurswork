import { loadUsers } from "./get_users.js";

export function editUser(id, oldName, oldEmail) {
    const newName = prompt('Введіть нове ім\'я', oldName);
    const newEmail = prompt('Введіть новий email', oldEmail);

    if (!newName || !newEmail) return;

    let formData = new FormData();
    formData.append('id', id);
    formData.append('name', newName);
    formData.append('email', newEmail);

    fetch('edit.php', {
        method: 'POST',
        body: formData
    })
        .then(responce => responce.json())
        .then(() => {
            loadUsers();
        })
}