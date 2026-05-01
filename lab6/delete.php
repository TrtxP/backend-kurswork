<?php 
require_once 'db.php';
header('Content-Type: application/json');

$id = $_POST['id'] ?? '';

if ($id) {
    $pdo = getDB();
    $query = $pdo->prepare('DELETE FROM users WHERE id = ?');
    $query->execute(array($id));
    echo json_encode(['status' => 'success', 'message' => "Користувач з id {$id} успішно видалений"]);

}
?>