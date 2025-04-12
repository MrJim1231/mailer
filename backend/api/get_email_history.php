<?php
require_once __DIR__ . '/../includes/db.php'; // Подключаем файл для подключения к базе данных

// Добавляем CORS заголовки, чтобы разрешить доступ с фронтенда
header("Access-Control-Allow-Origin: *"); // Разрешить доступ с любых доменов
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Если используете Authorization или другие заголовки
header('Content-Type: application/json');

// Обработка предварительных запросов OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Запрос к базе данных для получения всех отправленных сообщений
$sql = "SELECT id, sender_name, sender_email, recipient_email, message, send_time, status FROM email_history ORDER BY send_time DESC";
$result = $conn->query($sql);

// Проверяем, что запрос выполнен успешно
if ($result) {
    $emails = [];
    
    // Извлекаем все строки и формируем массив
    while ($row = $result->fetch_assoc()) {
        $emails[] = $row;
    }
    
    // Отправляем результат в формате JSON
    echo json_encode($emails, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Не удалось получить данные из базы']);
}
?>
