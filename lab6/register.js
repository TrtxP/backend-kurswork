document.getElementById('register-form').onsubmit = function(e) {
    e.preventDefault();

    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();

    if (!name || !email || !password) {
        alert('Всі поля повинні бути заповнені');
        return;
    }

    let formData = new FormData(this);

    fetch('register.php', {
        method: 'POST',
        body: formData
    })
    .then(responce => responce.json())
    .then(data => {
        alert(data.message);
        if (data.status === 'success') {
            this.reset();
        }
    })
}