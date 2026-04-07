<?php

require_once 'db.php';

$pdo = getDB();
$sql = "SELECT * FROM employees";
$result = $pdo->query($sql);

?>

<!DOCTYPE html>
<html lang="uk">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1>База даних працівників IT-шників</h1>
    <table border="1" cellspacing="0">
        <tr>
            <th>ID</th>
            <th>Ім'я</th>
            <th>Посада</th>
            <th>Зарплата</th>
        </tr>
        <?php
        foreach ($result as $row) {
            echo "<tr>";
            echo "<td>" . $row['id'] . "</td>";
            echo "<td>" . $row['name'] . "</td>";
            echo "<td>" . $row['position'] . "</td>";
            echo "<td>" . $row['salary'] . "</td>";
            echo "<td><a href='edit.php?id=" . $row['id'] . "'>Редагувати</a></td>";
            echo "</tr>";
        }
        ?>
    </table>

    <br>

    <a href="insert.php">
        <button type="submit" style="width: 140px; height: 29px;">Додати працівника</button>
    </a>

    <br>
    <br>

    <a href="avg.php">
        <button type="button" style="width: 190px; height: 40px;">Переглянути середню зарплату працівників</button>
    </a>

    <br>
    <br>

    <a href="group-positions.php">
        <button type="button" style="width: 190px; height: 40px;">Переглянути кількість працівників за посадами</button>
    </a>

    <br>
    <br>

    <form action="delete.php" method="post">
        <h3>Видалення працівника</h3>
        <button type="submit" style="width: 150px; height: 29px;">Видалити працівника</button>
        <input type="text" name="id" style="width: 175px; height: 24px;" required>
    </form>
</body>

</html>