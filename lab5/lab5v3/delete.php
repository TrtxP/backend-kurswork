<?php 

require_once 'db.php';

$pdo = getDB();
$sql = "DELETE FROM employees WHERE id = :id";
$stmt = $pdo->prepare($sql);
if (isset($_POST['id'])) {
    $stmt->execute(['id' => $_POST['id']]);
}

header('Location: index.php');
exit;

?>