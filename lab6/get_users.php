<?php 
require_once 'db.php';
header('Content-Type: application/json');

$pdo = getDB();
$query = $pdo->query('SELECT id, name, email FROM users');
$users = $query->fetchAll();

echo json_encode($users);

?>