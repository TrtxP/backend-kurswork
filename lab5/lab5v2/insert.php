<?php

require_once 'db.php';

$error = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $price = trim($_POST['price'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $amount = trim($_POST['amount'] ?? '');

    if (empty($name) || empty($price) || empty($category) || empty($amount)) {
        $error[] = 'Заповніть всі поля';
    }

    if (empty($error)) {
        $pdo = getDB();
        $sql = "INSERT INTO tov (name, price, category, amount) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $price, $category, $amount]);
        $success = 'Дані успішно додані <a href="index.php">На головну</a>';
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
    <h2>Додавання товару</h2>
    <?php echo $success . "<br><br>"; ?>
    <form method="post">
        Назва товару: <input type="text" name="name" required><br>
        Ціна: <input type="text" name="price" required><br>
        Категорія: <input type="text" name="category" required><br>
        Кількість: <input type="text" name="amount" required><br>
        <input type="submit" value="Додати">
    </form>
</body>

</html>