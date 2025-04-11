<?php
require_once __DIR__ . '/../vendor/autoload.php'; // Подключение autoload
use Dotenv\Dotenv;

// Заголовки для CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Получаем данные из POST-запроса
$senderName = $_POST['senderName'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$adminEmail = $_POST['adminEmail'] ?? '';

// Проверка данных
if (empty($senderName) || empty($email) || empty($password) || empty($adminEmail)) {
    echo json_encode(['status' => 'error', 'message' => 'Все поля обязаны быть заполнены.']);
    http_response_code(400);
    exit;
}

// Получаем текущие переменные из .env
$envContent = file_get_contents(__DIR__ . '/../.env');

// Добавляем новые данные отправителя
$newSender = "\nMAIL_USERNAME_{$senderName}=\"$email\"\nMAIL_PASSWORD_{$senderName}=\"$password\"\nADMIN_EMAIL_{$senderName}=\"$adminEmail\"";
$envContent .= $newSender;

// Сохраняем изменения в .env файле
file_put_contents(__DIR__ . '/../.env', $envContent);

echo json_encode(['status' => 'success', 'message' => 'Отправитель успешно добавлен']);
http_response_code(200);
