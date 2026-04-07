<?php

require_once 'db.php';

session_start();

if (!isset($_SESSION['user'])) {
    header('Location: index.php');
    exit;
}

$error = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $first_name = trim($_POST['first_name'] ?? '');
    $last_name = trim($_POST['last_name'] ?? '');
    $birthday = trim($_POST['birthday'] ?? '');
    $gender = $_POST['gender'] ?? 'не вказано';
    $phone = trim($_POST['phone'] ?? '');
    $country = $_POST['country'] ?? '';

    if (empty($username)) {
        $error[] = 'Введіть ім\'я користувача';
    }
    if (strlen($username) < 4) {
        $error[] = 'Ім\'я користувача має містити більше 4 символів';
    }
    if (empty($password)) {
        $error[] = 'Введіть пароль';
    }
    if (strlen($password) < 8) {
        $error[] = 'Пароль має містити більше 8 символів';
    }

    if (empty($error)) {
        $pdo = getDB();
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET username = ?, password = ?, phone = ?, country = ? WHERE id = ?");
        $stmt->execute([$username, $hash, $phone, $country, $_SESSION['user']['id']]);

        $_SESSION['user']['username'] = $username;
        $_SESSION['user']['password'] = $hash;
        $_SESSION['user']['phone'] = $phone;
        $_SESSION['user']['country'] = $country;

        $success = 'Дані успішно оновлено <a href="index.php">На головну</a>';
    }

    if ($success):
        echo "<p>$success</p><br>";
    else:
        foreach ($error as $err) {
            echo "<p>$err</p>";
        }
    endif;
}


?>

<h2>Профіль користувача <?= $_SESSION['user']['username']; ?></h2>

<form method="post">
    Ім'я користувача: <input type="text" name="username" value="<?= $_SESSION['user']['username']; ?>"><br>
    Пароль: <input type="password" name="password" value="<?= $_SESSION['user']['password']; ?>"><br>
    Email: <input type="email" name="email" value="<?= $_SESSION['user']['email']; ?>" readonly><br>
    Ім'я: <input type="text" name="first_name" value="<?= $_SESSION['user']['first_name']; ?>" readonly><br>
    Прізвище: <input type="text" name="last_name" value="<?= $_SESSION['user']['last_name']; ?>" readonly><br>
    Дата народження: <input type="date" name="birthday" value="<?= $_SESSION['user']['birthday']; ?>" readonly><br>
    Стать: <div>
        <div><input type="radio" name="gender" value="чоловіча" <?= $_SESSION['user']['gender'] === 'чоловіча' ? 'checked' : ''; ?> readonly><label for="чоловіча">чоловіча</label></div>
        <div><input type="radio" name="gender" value="жіноча" <?= $_SESSION['user']['gender'] === 'жіноча' ? 'checked' : ''; ?> readonly><label for="жіноча">жіноча</label></div>
    </div><br>
    Номер телефону: <input type="tel" name="phone" pattern="[+380]-[50|63|66|67|68|73|91|92|93|94|95|96|97|98|99]-[0-9]{3}-[0-9]{2}-[0-9]{2}" value="<?= $_SESSION['user']['phone']; ?>"><br>
    Країна: <select name="country">
        <option value="Україна" <?= $_SESSION['user']['country'] === 'Україна' ? 'selected' : ''; ?>>Україна</option>
        <option value="Польща" <?= $_SESSION['user']['country'] === 'Польша' ? 'selected' : ''; ?>>Польща</option>
        <option value="Німеччина" <?= $_SESSION['user']['country'] === 'Німеччина' ? 'selected' : ''; ?>>Німеччина</option>
        <option value="Італія" <?= $_SESSION['user']['country'] === 'Італія' ? 'selected' : ''; ?>>Італія</option>
        <option value="Франція" <?= $_SESSION['user']['country'] === 'Франція' ? 'selected' : ''; ?>>Франція</option>
        <option value="Інша країна" <?= $_SESSION['user']['country'] === 'Інша країна' ? 'selected' : ''; ?>>Інша країна</option>
    </select><br>
    <input type="submit" value="Зберегти дані">
</form>