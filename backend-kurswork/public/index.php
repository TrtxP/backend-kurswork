<?php

// Налаштування CORS доступу
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Аналізування та вивід помилок
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Початок сеаснсу
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Підключення файлу autoload.php для підключення класів model та controller
require_once __DIR__ . '/../vendor/autoload.php';

// Парсинг URL сторінки
$rawUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Заміна виводу бекенд частини через index.php на URL сторінки
$basePath = str_replace('/index.php', '', $_SERVER['SCRIPT_NAME']);
$uri = substr($rawUri, strlen($basePath));

// Вставляємо '/', якщо URL немає
if (empty($uri)) {
    $uri = '/';
}

// Обробка ендпоїнтів
if (strpos($uri, '/api/') === 0) {
    header('Content-Type: application/json; charset=utf8');

    $uriPath = parse_url($uri, PHP_URL_PATH);

    $db = new \app\Models\Database();
    $connection = $db->getConnection();

    $userModel = new \app\Models\UserModel($connection);
    $resultModel = new \app\Models\ResultModel($connection);
    $testModel = new \app\Models\TestModel($connection);
    $questionModel = new \app\Models\QuestionModel($connection);
    $answerModel = new \app\Models\AnswerModel($connection);

    $controller = new \app\Controllers\AuthController($userModel);
    $testContoller = new \app\Controllers\TestController($testModel, $questionModel, $answerModel, $resultModel);
    $id = $_GET['id'] ?? null;

    if ($uriPath === '/api/auth/check') {
        $controller->check();
        exit;
    }

    if ($uriPath === '/api/auth/register') {
        $controller->sign_up();
        exit;
    }

    if ($uriPath === '/api/auth/login' || $uriPath === '/api/auth') {
        $controller->login();
        exit;
    }

    if ($uriPath === '/api/auth/logout') {
        $controller->logout();
        exit;
    }

    if ($uriPath === '/api/tests') {
        $testContoller->index();
        exit;
    }

    if ($uriPath === '/api/tests/get') {
        $testContoller->getTest($id);
        exit;
    }

    if ($uriPath === '/api/tests/create') {
        $testContoller->create();
        exit;
    }

    if ($uriPath === '/api/tests/submit') {
        $testContoller->submit($id);
        exit;
    }

    if ($uriPath === '/api/tests/update') {
        $testContoller->update($id);
        exit;
    }

    if ($uriPath === '/api/tests/delete') {
        $testContoller->delete($id);
        exit;
    }

    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "API endpoint not found"]);
    exit;
}

// Вивід фронтенду
$htmlPath = '';

// Створення шляху до файлів
if ($uri === '/') {
    $htmlPath = __DIR__ . '/../build/index.html';
} else {
    $htmlPath = __DIR__ . '/../build' . $uri;
}

// Якщо це файл js та css - виводимо сторінку авторизації
if (file_exists($htmlPath) && !is_dir($htmlPath)) {

    if (str_ends_with($htmlPath, '.js')) {
        header('Content-Type: text/javascript');
    }

    if (str_ends_with($htmlPath, '.css')) {
        header('Content-Type: text/css');
    }

    echo file_get_contents($htmlPath);
    exit;
} else {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Route not found"]);
    exit;
}
