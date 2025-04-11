<?php
require_once __DIR__ . '/../vendor/autoload.php'; // Подключение autoload

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// Заголовки для CORS
header("Access-Control-Allow-Origin: http://localhost:5173"); // Разрешаем запросы с вашего фронтенда
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Разрешаем методы POST, GET, OPTIONS
header("Access-Control-Allow-Headers: Content-Type"); // Разрешаем заголовок Content-Type

// Если это предварительный запрос (OPTIONS), просто верните статус 200
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Включаем отображение ошибок
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Загружаем переменные из .env файла
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Получаем данные из POST-запроса
$data = json_decode(file_get_contents('php://input'), true);

// Проверка данных
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$message = $data['message'] ?? '';

if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(['status' => 'error', 'message' => 'Все поля обязательны для заполнения']);
    http_response_code(400);  // Ответ с ошибкой 400
    exit;
}

// Создаем объект PHPMailer
$mail = new PHPMailer(true);

try {
    // Настройки SMTP из .env файла
    $mail->isSMTP();
    $mail->Host = $_ENV['MAIL_HOST']; // SMTP-сервер из .env
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['MAIL_USERNAME']; // Логин из .env
    $mail->Password = $_ENV['MAIL_PASSWORD']; // Пароль из .env
    $mail->SMTPSecure = $_ENV['MAIL_ENCRYPTION']; // Шифрование из .env
    $mail->Port = $_ENV['MAIL_PORT']; // Порт из .env

    // Включаем вывод дебага для PHPMailer
    $mail->SMTPDebug = 2; // Включаем подробный вывод
    $mail->Debugoutput = 'html'; // Выводим логи в формате HTML

    // Устанавливаем кодировку
    $mail->CharSet = 'UTF-8'; // Устанавливаем кодировку для письма

    // От кого и кому
    $mail->setFrom($_ENV['MAIL_USERNAME'], 'Sender Name'); // От кого
    $mail->addAddress($email, $name); // Кому (email из формы)

    // Тема и тело письма
    $mail->isHTML(true);
    $mail->Subject = "Новое сообщение от $name";
    $mail->Body = "
        <h2>Новое сообщение с сайта</h2>
        <p><strong>Имя:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Сообщение:</strong></p>
        <p>$message</p>
    ";

    // Отправка письма
    if ($mail->send()) {
        echo json_encode(['status' => 'success', 'message' => 'Сообщение успешно отправлено']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Не удалось отправить сообщение']);
        http_response_code(500);  // Ответ с ошибкой 500
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => "Ошибка при отправке: {$mail->ErrorInfo}"]);
    http_response_code(500);  // Ответ с ошибкой 500
}
?>
