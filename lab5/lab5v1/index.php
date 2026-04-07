<?php

session_start();
require_once 'db.php';

$error = '';

if (isset($_POST['username']) && isset($_POST['password'])) {
    $pdo = getDB();

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$_POST['username']]);
    $user = $stmt->fetch();

    if ($user && password_verify($_POST['password'], $user['password'])) {
        $_SESSION['user'] = $user;
        header('Location: index.php');
        exit;
    } else {
        $error = 'Невірне ім\'я користувача або пароль';
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: index.php');
    exit;
}

?>

<!DOCTYPE html>
<html lang="uk">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lab 5</title>
</head>

<body>
    <?php if (isset($_SESSION['user'])): $u = $_SESSION['user']; ?>
        <h2>Вітаємо, <?= $u['username']; ?></h2>

        <table>
            <tr>
                <td>Ім'я:</td>
                <td><?= $u['first_name']; ?></td>
                <td><a href="edit.php">Змінити дані</a></td>
            </tr>
        </table>

        <a href="index.php?logout=1">Вийти з акаунту</a><br>
        <a href="delete.php">Видалити акаунт</a>
</body>

</html>

<?php else: ?>
    <h2>Вхід на сайт</h2>

    <?php
        if ($error) {
            echo "<p style='color: red;'>$error</p>";
        }
    ?>

    <form method="post">
        <div>
            <label>Логін:</label>
            <input type="text" name="username">
        </div>
        <div>
            <label>Пароль:</label>
            <input type="password" name="password">
        </div><br>
        <input type="submit" value="Увійти">
    </form>

    <br>

    <a href="register.php">Перейти на сторінку реєстрації</a>

<?php endif; ?>