<?php

require_once 'db.php';

session_start();

if (isset($_GET['id'])) {
    $pdo = getDB();
    $sql = "SELECT * FROM employees WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_GET["id"]]);
    $employee = $stmt->fetch();
    $_SESSION['employee'] = $employee;
}

$error = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $position = trim($_POST['position'] ?? '');
    $salary = trim($_POST['salary'] ?? '');

    if (empty($name) || empty($position) || empty($salary)) {
        $error[] = 'Заповніть всі поля';
    }

    if (empty($error)) {
        $pdo = getDB();
        $sql = "UPDATE employees SET name = ?, position = ?, salary = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $position, $salary, $_SESSION['employee']['id']]);

        $_SESSION['employee']['name'] = $name;
        $_SESSION['employee']['position'] = $position;
        $_SESSION['employee']['salary'] = $salary;

        $success = 'Дані успішно оновлено <a href="index.php">На головну</a>';
    }

    if ($success) {
        echo "<p>$success</p><br>";
    }
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
    <h2>Редагування працівника <?= $_SESSION['employee']['name']; ?></h2>
    <form method="post">
        Ім'я: <input type="text" name="name" value="<?= $_SESSION['employee']['name']; ?>"><br>
        Посада: <input type="text" name="position" value="<?= $_SESSION['employee']['position']; ?>"><br>
        Зарплата: <input type="text" name="salary" value="<?= $_SESSION['employee']['salary']; ?>"><br>
        <input type="submit" value="Зберегти зміни">
    </form>
</body>
</html>