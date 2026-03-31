<?php

echo "<h1>Завдання 1</h1>";

if (isset($_GET['size'])) {
    setcookie('font_size', $_GET['size'], time() + (3600 * 24 * 30));
    header("Location: index.php");
    exit();
}

$font_size = $_COOKIE['font_size'] ?? '20px';

?>

<a href="?size=25px">Великий шрифт</a><br>
<a href="?size=20px">Середній шрийт</a><br>
<a href="?size=15px">Малий шрифт</a><br>
<p style="font-size: <?= $font_size; ?>;">Текст зі змінною величиною шрифта через cookie</p>

<hr>

<?php

session_start();

echo "<h1>Завдання 2</h1>";

$error = '';

if (isset($_GET['logout'])) {
    $_SESSION = [];
    session_destroy();
    header("Location: index.php");
    exit;
}

if (isset($_POST['login'])) {
    if ($_POST['login'] === "Admin" && $_POST['password'] === "password") {
        $_SESSION['user'] = "Admin";
    } else {
        $error = "Невірний логін або пароль";
    }
}

?>

<?php if (isset($_SESSION['user'])): ?>
    <h2>Добрий день, <?= $_SESSION['user'] ?>!</h2>
    <a href="?logout=1">Вийти</a>
<?php else: ?>

    <form action="index.php" method="post">
        Логін: <input type="text" name="login"><br>
        Пароль: <input type="password" name="password"><br>
        <button type="submit">Увійти</button>
    </form>
    <p style="color: red;"><?= $error; ?></p>

<?php endif; ?>

<hr>

<?php

echo "<h1>Завдання 3</h1>";

$file = "comments.txt";

if (isset($_POST['name'])) {
    $line = $_POST['name'] . ' & ' . $_POST['comment'] . PHP_EOL;
    file_put_contents($file, $line, FILE_APPEND);
}

$rows = file_exists($file) ? file($file) : [];

?>

<form action="index.php" method="post">
    Ім'я: <input type="text" name="name"><br>
    Коментар: <textarea name="comment"></textarea><br>
    <button type="submit">Додати</button>
</form>

<h1>Таблиця з коментарями:</h1>

<table border="1">
    <tr>
        <th>Ім'я</th>
        <th>Коментар</th>
    </tr>
    <?php foreach ($rows as $row):
        list($name, $comment) = explode('&', $row);
    ?>
        <tr>
            <th><?= $name ?></th>
            <th><?= $comment ?></th>
        </tr>
    <?php endforeach; ?>
</table>

<?php

$file1 = file_exists("file1.txt") ? explode(" ", file_get_contents("file1.txt")) : [];
$file2 = file_exists("file2.txt") ? explode(" ", file_get_contents("file2.txt")) : [];

$only1 = array_diff($file1, $file2);
$both = array_intersect($file1, $file2);

$count1 = array_count_values($file1);
$count2 = array_count_values($file2);

$more2 = [];

foreach ($count1 as $word => $c1) {
    if ($c1 > 2 && $count2[$word] > 2) {
        $more2[] = $word;
    }
}

file_put_contents("only1.txt", implode(" ", $only1));
file_put_contents("both.txt", implode(" ", $both));
file_put_contents("more2.txt", implode(" ", $more2));

$spanMesaage = '';

if (isset($_POST['delete'])) {
    $filename = $_POST['filename'];
    $pattern = "/.txt/";
    if (file_exists($filename) && preg_match($pattern, $filename)) {
        unlink($filename);
        $spanMesaage = 'Файл видалено ' . $filename;
    } else {
        $spanMesaage = 'Файл для видалення не знайдено';
    }
}

if (file_exists("file1.txt")) {
    $words = explode(" ", file_get_contents("file1.txt"));
    natcasesort($words);
    file_put_contents("sorted.txt", implode(" ", $words));
}
?>

<br>

<form action="index.php" method="post">
    <input type="text" name="filename" placeholder="Введіть ім'я файлу для видалення" style="width: 230px;">
    <button type="submit" name="delete">Видалити файл</button><br>
    <span><?= $spanMesaage; ?></span>
</form>

<hr>

<?php
echo '<h1>Завдання 4</h1>';

$message = '';

$countPhotos = [];

if (isset($_POST['upload_photos'])) {
    $countPhotos = count($_FILES['photos']['name'] ?? []);

    for ($i = 0; $i < $countPhotos; $i++) {
        if ($_FILES['photos']['error'][$i] === 0) {
            $dir = "uploads/";
            if (!is_dir($dir)) mkdir($dir);

            $filePath = $dir . basename($_FILES['photos']['name'][$i]);
            move_uploaded_file($_FILES['photos']['tmp_name'][$i], $filePath);
        }
    }
}
?>

<form action="index.php" enctype="multipart/form-data" method="post">
    <input type="file" name="photos[]" multiple><br>
    <button type="submit" name="upload_photos">Завантажити</button><br>
</form>

<hr>

<?php

echo '<h1>Завдання 5</h1>';

if (isset($_POST['create_login_folder'])) {
    $new_login = $_POST['new_login'];
    $new_password = $_POST['new_password'];
    $dir = "users" . DIRECTORY_SEPARATOR . $new_login;

    if (is_dir($dir)) {
        echo "Папка вже існує!";
    } else {
        mkdir("$dir/video", 077, true);
        mkdir("$dir/photo", 077, true);
        mkdir("$dir/audio", 077, true);

        for ($i = 1; $i <= 3; $i++) {
            file_put_contents("$dir/video/test$i.txt", "Тестовий файл video $i");
            file_put_contents("$dir/photo/test$i.txt", "Тестовий файл photo $i");
            file_put_contents("$dir/audio/test$i.txt", "Тестовий файл audio $i");
        }

        echo "Користувача створено!";
    }
}

echo "<br><br>";

?>

<form action="index.php" method="post">
    Логін: <input type="text" name="new_login"><br>
    Пароль: <input type="password" name="new_password"><br>
    <button type="submit" name="create_login_folder">Додати</button>
</form>