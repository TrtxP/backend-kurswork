<?php

echo "<h1>Завдання 1.1</h1>";

$text = $_POST['text'] ?? '';
$find = $_POST['find'] ?? '';
$replace = $_POST['replace'] ?? '';
$error = '';
if (empty($text) || empty($find) || empty($replace)) {
    $error = 'Будь ласка, заповніть всі поля.';
    $result = '';
} else if (mb_strlen($find) > 1 || mb_strlen($replace) > 1) {
    $error = 'Обидва поля мають містити лише один символ.';
    $result = '';
} else {
    $result = str_replace($find, $replace, $text);
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
    <form action="index.php" method="post">
        Текст: <input type="text" name="text" value="<?= $text; ?>"><br>
        Знайти: <input type="text" name="find" value="<?= $find; ?>"><br>
        Замінити: <input type="text" name="replace" value="<?= $replace; ?>"><br>
        Результат: <input type="text" name="result" value="<?= $result; ?>" readonly><br>
        <button type="submit">Вивети результат</button><br>
        <span style="color: red;"><?php if ($error) {
                                        echo $error;
                                    } ?></span>
    </form>
</body>

</html>

<hr>

<?php

echo "<h1>Завдання 1.2</h1>";

$cities = $_POST['cities'] ?? '';
$arrayCities = explode(' ', trim($cities));
$arrayCities = array_filter($arrayCities);
natcasesort($arrayCities);
$result = implode(' ', $arrayCities);

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
    <form action="index.php" method="post">
        Міста: <br><input type="text" name="cities" style="width: 450px;" value="<?= $cities; ?>"><br>
        Відсортовані міста за алфавітом:<br><input type="text" name="result" value="<?= $result; ?>" style="width: 450px;" readonly><br>
        <button type="submit">Вивести результат</button>
    </form>
</body>

</html>

<hr>

<?php

echo "<h1>Завдання 1.3</h1>";

$filePath = $_POST['filePath'] ?? '';
$filenameWithoutExtension = pathinfo($filePath, PATHINFO_FILENAME);

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
    <form action="index.php" method="post">
        Повний шлях файлу: <br><input type="text" name="filePath" style="width: 450px;" value="<?= $filePath; ?>"><br>
        Ім'я файлу без розширення: <br><input type="text" name="filenameWithoutExtension" style="width: 450px;" value="<?= $filenameWithoutExtension; ?>" readonly><br>
        <button type="submit">Вивести ім'я файлу без розширення</button>
    </form>
</body>

</html>

<hr>

<?php

echo "<h1>Завдання 1.4</h1>";

$input = $_POST['firstDate'] ?? '';
$input2 = $_POST['secondDate'] ?? '';
$error2 = '';
if (empty($input) || empty($input2)) {
    $error2 = 'Будь ласка, заповніть обидва поля.';
} else {
    $firstDate = new DateTime($input);
    $secondDate = new DateTime($input2);
    $diff = $firstDate->diff($secondDate);
    $result = $diff->days;
}


?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
    <form action="index.php" method="post">
        Перша дата: <br><input type="text" name="firstDate" value="<?= $input; ?>"><br>
        Друга дата: <br><input type="text" name="secondDate" value="<?= $input2; ?>"><br>
        Різниця в кількості днів між датами: <br><input type="text" name="result" value="<?= $result; ?>"><br>
        <button type="submit">Вивести результат</button><br>
        <span style="color: red;"><?php if ($error2) {
                                        echo $error2;
                                    } ?></span>
    </form>
</body>

</html>

<hr>

<?php

echo "<h1>Завдання 1.5</h1>";

$password = '';
$message = '';
$lengthPass = 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $lengthPass = $_POST['lengthPass'] ?? 0;

    if ($lengthPass > 0) {
        $password = generatePassword($lengthPass);
    }
}

function generatePassword($length)
{
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    $res = '';
    for ($i = 0; $i < $length; $i++) {
        $res .= $chars[rand(0, strlen($chars) - 1)];
    }
    return $res;
}

function checkPassword($password)
{
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $password !== '') {
        $errors = [];

        if (strlen($password) < 8) {
            $errors[] = 'Пароль повинен містити хоча б 8 символів.';
        } else {
            if (!preg_match('/[A-Z]/', $password)) {
                $errors[] = 'Пароль повинен містити хоча б одну велику літеру.';
            }
            if (!preg_match('/[a-z]/', $password)) {
                $errors[] = 'Пароль повинен містити хоча б одну маленьку літеру.';
            }
            if (!preg_match('/[0-9]/', $password)) {
                $errors[] = 'Пароль повинен містити хоча б одну цифру.';
            }
            if (!preg_match('/[!@#$%^&*()]/', $password)) {
                $errors[] = 'Пароль повинен містити хоча б один спеціальний символ.';
            }
        }

        if (empty($errors)) {
            return '<b style="color: green;">Пароль міцний!</b>';
        } else {
            return '<b style="color: red;">Слабкий пароль: ' . implode(' ', $errors) . '</b>';
        }
    }
}

$message = checkPassword($password);

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
    <form action="index.php" method="post">
        Довжина паролю для генерації: <br><input type="number" name="lengthPass" value="<?= $lengthPass; ?>"><br>
        Згенерований пароль: <br><input type="text" name="password" style="width: 450px;" value="<?= $password; ?>" readonly><br>
        <button type="submit">Згенерувати пароль:</button><br>
        <span><?php echo $message; ?></span>
    </form>
</body>

</html>

<hr>