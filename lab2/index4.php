<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Document</title>
</head>

<body>
    <form action="index4.php" method="post" class="math-form">
        <div class="input-group">
            <label class="mg-labels">x</label>
            <input type="number" name="x" value="<?= $_POST['x'] ?? 0; ?>">
        </div>
        <div class="input-group">
            <label class="mg-labels">y</label>
            <input type="number" name="y" value="<?= $_POST['y'] ?? 0; ?>">
        </div>
        <button type="submit" class="submit-btn">=</button>
    </form>
</body>

</html>

<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo '<br>';
    require("calculate.php");
}
?>