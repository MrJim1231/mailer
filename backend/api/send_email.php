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
$email = $_POST['email'] ?? '';
$message = $_POST['message'] ?? ''; // Пустое сообщение теперь допустимо
$sender = $_POST['sender'] ?? '1'; // Получаем выбор отправителя

// Проверка данных
if (empty($email)) {
    echo json_encode(['status' => 'error', 'message' => 'Email обязателен для заполнения']);
    http_response_code(400);
    exit;
}

// Определяем учетные данные отправителя в зависимости от выбранного
if ($sender == '1') {
    $mailUsername = $_ENV['MAIL_USERNAME_1'];
    $mailPassword = $_ENV['MAIL_PASSWORD_1'];
    $adminEmail = $_ENV['ADMIN_EMAIL_1'];
} else {
    $mailUsername = $_ENV['MAIL_USERNAME_2'];
    $mailPassword = $_ENV['MAIL_PASSWORD_2'];
    $adminEmail = $_ENV['ADMIN_EMAIL_2'];
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
    $mail->Username = $mailUsername;
    $mail->Password = $mailPassword;
    $mail->SMTPSecure = $_ENV['MAIL_ENCRYPTION'];
    $mail->Port = $_ENV['MAIL_PORT'];

    $mail->CharSet = 'UTF-8';

    // Отправитель
    $mail->setFrom($mailUsername, 'Website');
    $mail->addAddress($email); // Получатель — тот, кто оставил свой email

    $mail->isHTML(true);
    $mail->Subject = "Новое сообщение с сайта";
    $mail->Body = "
        <h2>Новое сообщение с сайта</h2>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Сообщение:</strong></p>
        <p>" . ($message ?: 'Сообщение не было оставлено.') . "</p> <!-- Если сообщение пустое, выводится текст 'Сообщение не было оставлено' -->
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
