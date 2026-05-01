<?php 
require_once 'db.php';
header('Content-Type: application/json');

$id = $_POST['id'] ?? '';

if ($id) {
    $pdo = getDB();
    $stmt = $pdo->prepare('DELETE FROM notes WHERE id = ?');
    $stmt->execute(array($id));
    echo json_encode(['status' => 'success']);
}

?>