<?php 

require_once 'db.php';

$pdo = getDB();
$sql_avg = "SELECT AVG(salary) AS avg_salary FROM employees";
$avg_res = $pdo->query($sql_avg)->fetch();
$average = $avg_res['avg_salary'];

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
            <th>Середня зарплата</th>
        </tr>
        <tr>
            <td><?php echo $average; ?></td>
        </tr>
    </table>
</body>
</html>