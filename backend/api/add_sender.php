<?php
require_once __DIR__ . '/../vendor/autoload.php'; // Подключение autoload
use Dotenv\Dotenv;

// Заголовки для CORS
header("Access-Control-Allow-Origin: *"); // Разрешить доступ с любых доменов
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Загрузка .env файла из текущей директории (если он в папке api)
$dotenv = Dotenv::createImmutable(__DIR__); 
$dotenv->load();

// Получаем данные из POST-запроса
$data = json_decode(file_get_contents('php://input'), true); // Декодируем JSON

// Логирование для отладки
error_log(print_r($data, true)); // Печатает в лог

$senderName = $data['senderName'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Проверка данных
if (empty($senderName) || empty($email) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Все поля обязаны быть заполнены.']);
    http_response_code(400);
    exit;
}

// Получаем текущие переменные из .env
$envContent = file_get_contents(__DIR__ . '/.env'); // Используем правильный путь

// Извлекаем все строки из .env, чтобы определить следующий индекс
preg_match_all('/MAIL_USERNAME_(\d+)="([^"]+)"/', $envContent, $matches);

// Определяем следующий индекс
$lastIndex = !empty($matches[1]) ? max($matches[1]) : 0;
$nextIndex = $lastIndex + 1;

// Добавляем новые данные отправителя
$newSender = "\nMAIL_USERNAME_{$nextIndex}=\"$email\"\nMAIL_PASSWORD_{$nextIndex}=\"$password\"\nSENDER_NAME_{$nextIndex}=\"$senderName\"";
$envContent .= $newSender;

// Сохраняем изменения в .env файле
if (file_put_contents(__DIR__ . '/.env', $envContent)) { // Путь корректен
    echo json_encode(['status' => 'success', 'message' => 'Отправитель успешно добавлен']);
    http_response_code(200);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Не удалось сохранить данные отправителя.']);
    http_response_code(500);
}
?>
