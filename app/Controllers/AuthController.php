<?php

namespace app\Controllers;

use app\Models\UserModel;
use app\Role;

class AuthController
{
    private UserModel $userModel;

    public function __construct(UserModel $userModel)
    {
        $this->userModel = $userModel;
    }

    public function login(): void
    {
        header('Content-Type: application/json');
        
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (isset($_SESSION['user_id'])) {
            http_response_code(200);
            echo json_encode(["status" => "success", "redirect" => "/"]);
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;

        $jsonRaw = file_get_contents('php://input');
        $data = json_decode($jsonRaw, true) ?: [];

        $login = trim($data['login'] ?? '');
        $password = $data['password'] ?? '';

        if (!$login || !$password) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Всі поля обов'язкові"]);
            exit;
        }

        $user = $this->userModel->findByLogin($login);

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];

            session_regenerate_id(true);

            http_response_code(200);
            echo json_encode(["status" => "success", "redirect" => "/"]);
            exit;
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Невірний логін або пароль"]);
        }
    }

    public function sign_up(): void
    {
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;

        $jsonRaw = file_get_contents('php://input');
        $data = json_decode($jsonRaw, true) ?: [];

        if ($this->userModel->findByLogin($data['login']) != null) {
            http_response_code(409);
            echo json_encode(["status" => "error", "message" => "Користувач з таким логіном вже існує"]);
            exit;
        }

        $login = trim($data['login'] ?? '');
        $password = $data['password'] ?? '';
        $fullName = trim($data['full_name'] ?? '');
        $groupName = trim($data['group_name'] ?? '');
        $role = $data['role'] === 'student' ? Role::Student : Role::Admin;

        $isSignedUp = $this->userModel->add($login, $password, $fullName, $role, $groupName);

        if ($isSignedUp) {
            http_response_code(201);
            echo json_encode(["status" => "success", "redirect" => "/login", "message" => "Реєстрація успішна"]);
            exit;
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Помилка реєстрації"]);
        }
    }

    public function logout(): void
    {
        header('Content-Type: application/json');

        $_SESSION = [];

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                "",
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }

        session_destroy();
        http_response_code(200);
        echo json_encode(["status" => "success"]);
    }

    public function check(): void
    {
        if (isset($_SESSION['user_id'])) {
            http_response_code(200);
            echo json_encode([
                "isLoggedIn" => true,
                "role" => $_SESSION['role']
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["isLoggedIn" => false]);
        }
        exit;
    }
}
