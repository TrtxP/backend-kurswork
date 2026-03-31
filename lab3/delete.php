<?php 

function deleteDir($dir) {
    if (!is_dir($dir)) return;

    $files = scandir($dir);

    foreach ($files as $file) {
        if ($file === ".." || $file === ".") continue;

        $path = $dir . DIRECTORY_SEPARATOR . $file;
        if (is_dir($path)) {
            deleteDir($path);
        } else {
            unlink($path);
        }
    }

    rmdir($dir);
}

if (isset($_POST['new_login'])) {
    $new_login = $_POST['new_login'];

    $dir = "users" . DIRECTORY_SEPARATOR . $new_login;

    if (is_dir($dir)) {
        deleteDir($dir);
        echo "Папку користувача видалено!";
    } else {
        echo "Папку користувача не знайдено.";
    }
}

echo "<br><br>";

?>

<form action="delete.php" method="post">
    Логін: <input type="text" name="new_login"><br>
    Пароль: <input type="password" name="new_password"><br>
    <button type="submit">Видалити</button>
</form>