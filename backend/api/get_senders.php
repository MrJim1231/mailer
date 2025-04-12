<?php
require_once __DIR__ . '/../vendor/autoload.php'; // Подключаем autoload

use Dotenv\Dotenv;

// Заголовки для CORS
header("Access-Control-Allow-Origin: *"); // Разрешить доступ с любых доменов
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

// Массив для хранения отправителей
$senders = [];

// Цикл для получения всех отправителей из .env файла
for ($i = 1; $i <= 10; $i++) {
    $mailUsername = $_ENV['MAIL_USERNAME_' . $i] ?? null;
    $mailPassword = $_ENV['MAIL_PASSWORD_' . $i] ?? null;
    $senderName = $_ENV['SENDER_NAME_' . $i] ?? null;

    // Если все данные для отправителя есть, добавляем в массив
    if ($mailUsername && $mailPassword && $senderName) {
        $senders[] = [
            'id' => $i,
            'mailUsername' => $mailUsername,
            'mailPassword' => $mailPassword,
            'senderName' => $senderName,
        ];
    }
}

// Отправляем данные на фронт в формате JSON
echo json_encode(['status' => 'success', 'senders' => $senders]);

?>
