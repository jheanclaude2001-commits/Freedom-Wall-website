<?php
include 'db.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $message = $_POST['message'];
    $color   = $_POST['color'];
    $rotation = $_POST['rotation'];

    $stmt = $conn->prepare("INSERT INTO messages (message, note_color, rotation) VALUES (:msg, :col, :rot)");
    
    if($stmt->execute(array(':msg' => $message, ':col' => $color, ':rot' => $rotation))) {
        $lastId = $conn->lastInsertId();
        echo json_encode(["status" => "success", "id" => $lastId, "time" => "Just now"]);
    } else {
        echo json_encode(["status" => "error"]);
    }
}
?>