<?php
require_once 'db.php';
header('Content-Type: application/json');

if (!$_SERVER['REQUEST_METHOD'] === 'POST') exit;

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (strlen($password) < 5) {
    echo json_encode(['status' => 'error', 'message' => 'Пароль повинен містити щонайменше 5 символів']);
    exit;
}

$pdo = getDB();
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
$stmt->execute(array($email));

if ($stmt->fetch()) {
    echo json_encode(['status' => 'error', 'message' => "Користувач {$name} з такою електронною поштою вже зареєстрований"]);
    exit;
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
$stmt->execute(array($name, $email, $hashed_password));

echo json_encode(['status' => 'success', 'message' => "Користувач {$name} успішно зарєстрований"]);
?>