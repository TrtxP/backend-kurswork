<?php 
require_once 'db.php';
header('Content-Type: application/json');

$pdo = getDB();

$id = $_POST['id'] ?? '';
$title = isset($_POST['title']) ? trim($_POST['title']) : null;
$content = isset($_POST['content']) ? trim($_POST['content']) : null;

if ($id && $title) {
    $query = $pdo->prepare('UPDATE notes SET title = ? WHERE id = ?');
    $query->execute(array($title, $id));
    echo json_encode(['status' => 'success']);
    exit;
}

if ($id && $content) {
    $query = $pdo->prepare('UPDATE notes SET content = ? WHERE id = ?');
    $query->execute(array($content, $id));
    echo json_encode(['status' => 'success']);
    exit;
}

?>