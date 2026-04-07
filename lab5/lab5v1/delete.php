<?php

session_start();
require_once 'db.php';

if (!isset($_SESSION['user'])) {
    header('Location: index.php');
    exit;
}

$message = '';

if (isset($_POST['delete'])) {
    $pdo = getDB();
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user']['id']]);
    $user = $_SESSION['user']['username'];
    $message = "<p>Користувача $user успішно видалено</p><br><a href='index.php'>На головну</a>";
    session_destroy();
} else if (isset($_POST['cancel'])) {
    header('Location: index.php');
    exit;
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <?php if ($message): echo $message; ?>
    <?php else: ?>
        <h2>Видалення акаунту <?= $_SESSION['user']['username']; ?></h2>
        <p>Ви дійсно хочете видалити акаунт?</p>
        <form method="post">
            <button type="submit" name="delete">Видалити</button>
            <button type="submit" name="cancel">Відміна</button>
        </form>
    <?php endif; ?>
</body>

</html>