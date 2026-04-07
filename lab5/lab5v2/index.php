<?php

require_once 'db.php';

$pdo = getDB();
$sql = "SELECT * FROM tov";
$result = $pdo->query($sql);

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1>Створення бази даних</h1>
    <table border="1" cellspacing="0">
        <tr>
            <th>ID</th>
            <th>Назва</th>
            <th>Ціна</th>
            <th>Категорія</th>
            <th>Кількість</th>
        </tr>
        <?php
        foreach ($result as $row) {
            echo "<tr>";
            echo "<td>" . $row['id'] . "</td>";
            echo "<td>" . $row['name'] . "</td>";
            echo "<td>" . $row['price'] . "</td>";
            echo "<td>" . $row['category'] . "</td>";
            echo "<td>" . $row['amount'] . "</td>";
            echo "</tr>";
        }
        ?>
    </table>

    <br>

    <a href="insert.php">
        <button type="submit" style="width: 120px; height: 29px;">Додати запис</button>
    </a>

    <br>
    <br>

    <form action="delete.php" method="post">
        <button type="submit" style="width: 135px; height: 29px;">Вилучити запис</button>
        <input type="text" name="id" style="width: 175px; height: 24px;" required>
    </form>
</body>

</html>