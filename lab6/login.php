<?php 
require_once 'db.php';
header('Content-Type: application/json');

$pdo = getDB();

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

$stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
$stmt->execute(array($email));

$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    echo json_encode(['status' => 'success', 'message' => "Вхід успішний. Вітаємо, {$user['name']}!"]);
} else {
    echo json_encode(['status' => 'error', 'message' => "Невірна електронна адреса або пароль"]);
}


?>