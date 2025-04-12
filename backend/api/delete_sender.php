<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;

// Заголовки для CORS
header("Access-Control-Allow-Origin: *"); // Разрешить доступ с любых доменов
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Включаем отображение ошибок и логгирование
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');

// Загрузка .env файла
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Получаем данные из POST-запроса
$data = json_decode(file_get_contents('php://input'), true);
$senderId = $data['senderId'] ?? '';

if (empty($senderId)) {
    echo json_encode(['status' => 'error', 'message' => 'Не указан ID отправителя для удаления.']);
    http_response_code(400);
    exit;
}

// Получаем содержимое .env
$envFilePath = __DIR__ . '/.env';
$envContent = file_get_contents($envFilePath);

if ($envContent === false) {
    echo json_encode(['status' => 'error', 'message' => 'Не удалось прочитать файл .env.']);
    http_response_code(500);
    exit;
}

// Регулярное выражение для удаления блока с отправителем
$pattern = "/MAIL_USERNAME_{$senderId}=\"[^\"]+\"\s*MAIL_PASSWORD_{$senderId}=\"[^\"]+\"\s*SENDER_NAME_{$senderId}=\"[^\"]+\"\s*/s";
$envContentUpdated = preg_replace($pattern, '', $envContent, -1, $count);

// Логируем результат
error_log("Удалено блоков: $count");

if ($count === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Не найден отправитель с указанным ID.']);
    http_response_code(404);
    exit;
}

// Сохраняем изменения
if (file_put_contents($envFilePath, $envContentUpdated)) {
    echo json_encode(['status' => 'success', 'message' => 'Отправитель успешно удален']);
    http_response_code(200);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Не удалось сохранить изменения в .env.']);
    http_response_code(500);
}
?>
