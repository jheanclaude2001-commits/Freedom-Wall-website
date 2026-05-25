<?php
include 'db.php';

header('Content-Type: application/json');

$stmt = $conn->prepare("SELECT * FROM messages ORDER BY id DESC");
$stmt->execute();
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($messages);
?>