<?php 

require_once 'db.php';

$pdo = getDB();
$sql_group_positions = "SELECT position, COUNT(*) AS total FROM employees GROUP BY position";
$stats_result = $pdo->query($sql_group_positions);

?>

<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <table border="1" cellspacing="0">
        <tr>
            <th>Посада</th>
            <th>Кількість працівників</th>
        </tr>
        <?php 
            foreach ($stats_result as $row) {
                echo "<tr>";
                echo "<td>" . $row['position'] . "</td>";
                echo "<td>" . $row['total'] . "</td>";
                echo "</tr>";
            }
        ?>
    </table>
</body>
</html>