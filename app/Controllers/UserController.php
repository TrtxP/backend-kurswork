<?php

namespace app\Controllers;

use app\Models\UserModel;
use app\Models\ResultModel;

class UserController
{
    private UserModel $userModel;
    private ResultModel $resultModel;

    public function __construct(UserModel $userModel, ResultModel $resultModel)
    {
        $this->userModel = $userModel;
        $this->resultModel = $resultModel;
    }

    public function get_profile(): void
    {
        header('Content-Type: application/json');

        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Неавторизовано"]);
            exit;
        }

        $user = $this->userModel->findById($_SESSION['user_id']);

        if ($user) {
            unset($user['password']);
            http_response_code(200);
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Користувача не знайдено"]);
        }
        exit;
    }

    public function get_history(): void
    {
        header('Content-Type: application/json');

        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Неавторизовано"]);
            exit;
        }

        $results = $this->resultModel->getResults($_SESSION['user_id']);

        http_response_code(200);

        echo json_encode($results);
        exit;
    }

    public function update_profile(): void
    {
        header('Content-Type: application/json');

        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Неавторизовано"]);
            exit;
        }

        $updateData = json_decode(file_get_contents('php://input'), true);

        $hashedPassword = password_hash($updateData['password'], PASSWORD_DEFAULT);

        $updateData['password'] = $hashedPassword;

        $success = $this->userModel->update($_SESSION['user_id'], $updateData['login'], $updateData['password']);

        if ($success) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Дані оновлено"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Помилка оновлення даних"]);
        }
    }

    public function upload_avatar(): void
    {
        header('Content-Type: application/json');

        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Неавторизовано"]);
            exit;
        }

        if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Файл не завантажено або сталася помилка"]);
            exit;
        }

        $file = $_FILES['avatar'];
        
        // Перевірка розміру (2 МБ макс)
        if ($file['size'] > 2 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Файл занадто великий. Максимальний розмір 2 МБ."]);
            exit;
        }

        $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        $mimeType = mime_content_type($file['tmp_name']);

        if (!in_array($mimeType, $allowedMimeTypes)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Дозволені лише зображення JPEG, PNG, WEBP."]);
            exit;
        }

        $uploadDir = __DIR__ . '/../../public/uploads/avatars/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        if (!$extension) {
            // Визначити розширення за mime
            $extension = match ($mimeType) {
                'image/jpeg' => 'jpg',
                'image/png' => 'png',
                'image/webp' => 'webp',
                default => 'jpg'
            };
        }

        $fileName = 'user_' . $_SESSION['user_id'] . '_' . time() . '.' . $extension;
        $destination = $uploadDir . $fileName;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $user = $this->userModel->findById($_SESSION['user_id']);
            
            // Видалення старого файлу, якщо він є
            if (!empty($user['avatar_url'])) {
                $oldFile = __DIR__ . '/../../public/' . ltrim($user['avatar_url'], '/');
                if (file_exists($oldFile)) {
                    unlink($oldFile);
                }
            }

            $avatarUrl = '/uploads/avatars/' . $fileName;
            $this->userModel->updateAvatar($_SESSION['user_id'], $avatarUrl);

            http_response_code(200);
            echo json_encode(["status" => "success", "avatar_url" => "http://localhost/backend-kurswork/public" . $avatarUrl]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Помилка при збереженні файлу"]);
        }
        exit;
    }

    public function delete_avatar(): void
    {
        header('Content-Type: application/json');

        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Неавторизовано"]);
            exit;
        }

        $user = $this->userModel->findById($_SESSION['user_id']);
        
        if (!empty($user['avatar_url'])) {
            $oldFile = __DIR__ . '/../../public/' . ltrim($user['avatar_url'], '/');
            if (file_exists($oldFile)) {
                unlink($oldFile);
            }
        }

        $this->userModel->updateAvatar($_SESSION['user_id'], null);

        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Аватар видалено"]);
        exit;
    }
}
