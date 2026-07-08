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
}
