<?php 

require_once 'db.php';

session_start();

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
        $sql = "INSERT INTO employees (name, position, salary) VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $position, $salary]);
        $success = 'Дані успішно додані <a href="index.php">На головну</a>';
    }
}
?>

<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h2>Додавання працівника</h2>
    <?php echo $success . "<br><br>"; ?>
    <form method="post">
        Ім'я: <input type="text" name="name" required><br>
        Посада: <input type="text" name="position" required><br>
        Зарплата: <input type="text" name="salary" required><br>
        <input type="submit" value="Додати">
    </form>
</body>
</html>