<?php 
require("Function/func.php");

$x = (float)($_POST['x'] ?? 0);
$y = (float)($_POST['y'] ?? 0);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="table.css">
</head>
<body>
    <table>
        <thead>
            <tr>
                <th>x<sup>y</sup></th>
                <th>x!</th>
                <th>my_tg(x)</th>
                <th>sin(x)</th>
                <th>cos(x)</th>
                <th>tg(x)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><?= power($x, $y); ?></td>
                <td><?= factorial($x); ?></td>
                <td><?= my_tg($x); ?></td>
                <td><?= sine($x); ?></td>
                <td><?= cosine($x); ?></td>
                <td><?= tg($x); ?></td>
            </tr>
        </tbody>
    </table>
</body>
</html>