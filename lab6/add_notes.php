<?php 
require_once 'db.php';
header('Content-Type: application/json');

$pdo = getDB();

$title = trim($_POST['title'] ?? '');
$content = trim($_POST['content'] ?? '');

if (strlen($content) < 8) {
    echo json_encode(['status' => 'error', 'message' => 'Введіть більший зміст тексту щонайманше на 8 символів!']);
    exit;
}

$stmt = $pdo->prepare('SELECT * FROM notes WHERE title = ?');
$stmt->execute(array($title));

if ($stmt->fetch()) {
    echo json_encode(['status' => 'error', 'message' => "Заголовок замітки {$title} вже існує"]);
    exit;  
}

$stmt = $pdo->prepare('INSERT INTO notes (title, content) VALUES (?, ?)');
$stmt->execute(array($title, $content));

echo json_encode(['status' => 'success', 'message' => 'Замітка успішно додана!']);

?>