<?php 
require_once 'db.php';
header('Content-Type: application/json');

$pdo = getDB();
$query = $pdo->query('SELECT id, title, content FROM notes');
$notes = $query->fetchAll();

echo json_encode($notes);

?>