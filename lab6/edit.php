<?php 
require_once 'db.php';
header('Content-Type: application/json');

$pdo = getDB();

$id = $_POST['id'] ?? '';
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');

if ($id && $name && $email) {
    $query = $pdo->prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
    $query->execute(array($name, $email, $id));
    echo json_encode(['status' => 'success']);
}

?>