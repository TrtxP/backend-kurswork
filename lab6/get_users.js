import { deleteUser } from "./delete.js";
import { editUser } from "./edit.js";

const list = document.getElementById('user-list');
const updateBtn = document.getElementById('update-list-of-users'); 

export function loadUsers() {
    fetch('get_users.php')
    .then(responce => responce.json())
    .then(data => {
        renderUsers(data);
    })
    .catch(error => {
        console.log(error);
    })
}

function renderUsers(users) {
    list.innerHTML = users.map(user => `
        <div class="user-item" data-id="${user.id}">
            <span><b>${user.name}</b> ${user.email}</span>

            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `).join('');
}

list.addEventListener('click', event => {
    const userItem = event.target.closest('.user-item');
    if (!userItem) return;

    const id = userItem.dataset.id;
    const name = userItem.querySelector('b').textContent;
    const email = userItem.querySelector('span').textContent.replace(name, '').trim();

    if (event.target.classList.contains('edit-btn')) {
        editUser(id, name, email);
    }

    if (event.target.classList.contains('delete-btn')) {
        deleteUser(id);
    }
})

updateBtn.addEventListener('click', loadUsers);
loadUsers();