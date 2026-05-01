document.getElementById('login-form').onsubmit = function(e) {
    e.preventDefault();

    let formData = new FormData(this);

    fetch('login.php', {
        method: 'POST',
        body: formData
    })
    .then(responce => responce.json())
    .then(data => {
        alert(data.message);
    })
}