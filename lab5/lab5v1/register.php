<?php
require_once 'db.php';

session_start();

if (isset($_SESSION['user'])) {
    header('Location: index.php');
    exit;
}

$error = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $repeatPass = trim($_POST['repeatPass'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $first_name = trim($_POST['first_name'] ?? '');
    $last_name = trim($_POST['last_name'] ?? '');
    $birthday = trim($_POST['birthday'] ?? '');
    $gender = $_POST['gender'] ?? 'не вказано';
    $phone = trim($_POST['phone'] ?? '');
    $country = $_POST['country'] ?? '';

    if (empty($username)) {
        $error[] = 'Ім\'я користувача є обов\'язковим';
    }
    if (strlen($username) < 4) {
        $error[] = 'Ім\'я користувача має містити більше 4 символів';
    }
    if (empty($password)) {
        $error[] = 'Пароль є обов\'язковим';
    }
    if (strlen($password) < 8) {
        $error[] = 'Пароль має містити більше 8 символів';
    }
    if (empty($repeatPass)) {
        $error[] = 'Введіть повторно пароль!';
    }
    if ($password !== $repeatPass) {
        $error[] = 'Паролі не співпадають';
    }
    if (empty($email)) {
        $error[] = 'Email є обов\'язковим';
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error[] = 'Невірний формат email';
    }
    
    $pattern="/^\+380-(50|63|66|67|68|73|91|92|93|94|95|96|97|98|99)-[0-9]{3}-[0-9]{2}-[0-9]{2}$/";

    if (!preg_match($pattern, $phone)) {
        $error[] = 'Невірний формат номеру телефону';
    }

    if (empty($error)) {
        $pdo = getDB();
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$username]);

        if ($stmt->fetch()) {
            $error[] = 'Користувач з таким ім\'ям вже існує';
        } else {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO users 
                                (username, password, email, first_name, last_name, birthday, gender, phone, country)
                                VAlUES
                                (?, ?, ?, ?, ?, ?, ?, ?, ?)");

            $stmt->execute([$username, $hash, $email, $first_name, $last_name, $birthday, $gender, $phone, $country]);

            $success = 'Реєстрація успішна <a href="index.php">Увійти</a>';
        }
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

<h2>Реєстрація користувача</h2>

<form method="post">
    Ім'я користувача: <input type="text" name="username" required><br>
    Пароль: <input type="password" name="password" required><br>
    Пароль (ще раз): <input type="password" name="repeatPass" required><br>
    Email: <input type="email" name="email" required><br>
    Ім'я: <input type="text" name="first_name"><br>
    Прізвище: <input type="text" name="last_name"><br>
    Дата народження: <input type="date" name="birthday"><br>
    Стать: <div>
        <div><input type="radio" name="gender" value="чоловіча"><label for="чоловіча">чоловіча</label></div>
        <div><input type="radio" name="gender" value="жіноча"><label for="жіноча">жіноча</label></div>
    </div><br>
    Номер телефону: <input type="tel" name="phone" pattern="^\+380-(50|63|66|67|68|73|91|92|93|94|95|96|97|98|99)-[0-9]{3}-[0-9]{2}-[0-9]{2}$" required><br>
    Країна: <select name="country">
        <option value="Україна">Україна</option>
        <option value="Польща">Польща</option>
        <option value="Німеччина">Німеччина</option>
        <option value="Італія">Італія</option>
        <option value="Франція">Франція</option>
        <option value="Інша країна">Інша країна</option>
    </select><br>
    <input type="submit" value="Зареєструватися">
</form>

<br>

<a href="index.php">Назад</a>