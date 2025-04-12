<?php
require_once __DIR__ . '/../vendor/autoload.php'; // Подключение autoload

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
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

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Подключаем файл с настройками для подключения к базе данных
require_once __DIR__ . '/../includes/db.php';

// Получаем данные из POST-запроса
$email = $_POST['email'] ?? '';
$subject = $_POST['subject'] ?? 'Новое сообщение с сайта';
$message = $_POST['message'] ?? '';
$sender = $_POST['sender'] ?? '1';

if (empty($email)) {
    echo json_encode(['status' => 'error', 'message' => 'Email обязателен для заполнения']);
    http_response_code(400);
    exit;
}

// Формируем данные отправителя
$mailUsername = $_ENV['MAIL_USERNAME_' . $sender];
$mailPassword = $_ENV['MAIL_PASSWORD_' . $sender];
$senderName = $_ENV['SENDER_NAME_' . $sender];

// Обработка файла
if (isset($_FILES['file']) && $_FILES['file']['error'] == 0) {
    $uploadDir = __DIR__ . '/../uploads/';
    $fileTmpPath = $_FILES['file']['tmp_name'];
    $fileName = $_FILES['file']['name'];
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
    $mail->Username = $mailUsername;
    $mail->Password = $mailPassword;
    $mail->SMTPSecure = $_ENV['MAIL_ENCRYPTION'];
    $mail->Port = $_ENV['MAIL_PORT'];
    $mail->CharSet = 'UTF-8';

    $mail->setFrom($mailUsername, $senderName);
    $mail->addAddress($email);
    $mail->isHTML(true);
    $mail->Subject = $subject;

    // Проверка, если поле message пустое
    $body = '';
    if (!empty($message)) {
        $body .= "<p>$message</p>";
    } else {
        // Если message пустое, добавляем стандартное сообщение
        $body .= "<p></p>";
    }

    $mail->Body = $body;

    if ($destPath) {
        $mail->addAttachment($destPath, $fileName);
    }

    if ($mail->send()) {
        $stmt = $conn->prepare("INSERT INTO email_history (sender_name, sender_email, recipient_email, message, status) VALUES (?, ?, ?, ?, ?)");
        $status = 'sent';
        $stmt->bind_param("sssss", $senderName, $mailUsername, $email, $message, $status);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Сообщение успешно отправлено и сохранено в истории']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Ошибка при записи в базу данных']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Не удалось отправить сообщение']);
        http_response_code(500);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => "Ошибка при отправке: {$mail->ErrorInfo}"]);
    http_response_code(500);
}
?>
