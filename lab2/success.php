<?php
session_start();

$userData = $_SESSION['data'] ?? "";

if (
    !$userData['login']
    || !$userData['password']
    || !$userData['repeatPass']
) {
    echo 'Дані не заповнені. <br><a href="index3.php">Повернутися на головну сторінку</a>';
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="success.css">
</head>

<body>
    <div class="success-group">
        <p class="p-gray">Логін: </p>
        <span><?php echo $userData['login']; ?></span>
    </div>
    <div class="success-group">
        <p class="p-gray">Пароль: </p>
        <span><?php if ($userData['password'] !== $userData['repeatPass']) {
                    echo 'не співпадає (перший - ' . strlen($userData['password']) . ' символів, другий - ' . strlen($userData['repeatPass']) . ' символів)';
                } else {
                    echo 'співпадає';
                } ?></span>
    </div>
    <div class="success-group">
        <p class="p-gray">Стать: </p>
        <span><?php echo $userData['gender']; ?></span>
    </div>
    <div class="success-group">
        <p class="p-gray">Місто: </p>
        <span><?php echo $userData['city']; ?></span>
    </div>
    <div class="success-group">
        <p class="p-gray">Улюблені ігри: </p>
        <span><?php if (!empty($userData['games'])) {
                    echo implode("<br>", $userData['games']);
                } else {
                    echo 'не вказано';
                } ?></span>
    </div>
    <div class="success-group">
        <p class="p-gray">Про себе: </p>
        <span><?php if (!empty($userData['aboutSelf'])) {
                    echo nl2br($userData['aboutSelf']);
                } else {
                    echo 'не вказано';
                } ?></span>
    </div>
    <div class="success-group centered">
        <p class="p-gray">Фотографія: </p>
        <?php if (isset($userData['photo'])): ?>
            <img src="<?= $userData['photo']; ?>" alt="User Photo">
        <?php else: ?>
            <span>не вказано</span>
        <?php endif; ?>
    </div>
    <a href="index3.php">Повернутися на головну сторінку</a>
</body>

</html>