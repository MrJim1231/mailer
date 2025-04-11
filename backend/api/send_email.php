<?php
require_once __DIR__ . '/../vendor/autoload.php'; // Подключение autoload

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
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
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$message = $_POST['message'] ?? '';

// Проверка данных
if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(['status' => 'error', 'message' => 'Все поля обязательны для заполнения']);
    http_response_code(400);
    exit;
}

// Обработка загрузки файла
if (isset($_FILES['file']) && $_FILES['file']['error'] == 0) {
    $uploadDir = __DIR__ . '/../uploads/';
    $fileTmpPath = $_FILES['file']['tmp_name'];
    $fileName = $_FILES['file']['name'];
    $fileSize = $_FILES['file']['size'];
    $fileType = $_FILES['file']['type'];

    $allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!in_array($fileType, $allowedTypes)) {
        echo json_encode(['status' => 'error', 'message' => 'Неверный тип файла']);
        http_response_code(400);
        exit;
    }

    $destPath = $uploadDir . $fileName;
    if (!move_uploaded_file($fileTmpPath, $destPath)) {
        echo json_encode(['status' => 'error', 'message' => 'Не удалось загрузить файл']);
        http_response_code(500);
        exit;
    }
} else {
    $destPath = null;
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = $_ENV['MAIL_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['MAIL_USERNAME'];
    $mail->Password = $_ENV['MAIL_PASSWORD'];
    $mail->SMTPSecure = $_ENV['MAIL_ENCRYPTION'];
    $mail->Port = $_ENV['MAIL_PORT'];

    $mail->CharSet = 'UTF-8';

    $mail->setFrom($_ENV['MAIL_USERNAME'], 'Sender Name');
    $mail->addAddress($email, $name);

    $mail->isHTML(true);
    $mail->Subject = "Новое сообщение от $name";
    $mail->Body = "
        <h2>Новое сообщение с сайта</h2>
        <p><strong>Имя:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Сообщение:</strong></p>
        <p>$message</p>
    ";

    // Прикрепляем файл
    if ($destPath) {
        $mail->addAttachment($destPath, $fileName); // Добавляем файл в письмо
    }

    if ($mail->send()) {
        echo json_encode(['status' => 'success', 'message' => 'Сообщение успешно отправлено']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Не удалось отправить сообщение']);
        http_response_code(500);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => "Ошибка при отправке: {$mail->ErrorInfo}"]);
    http_response_code(500);
}
?>
