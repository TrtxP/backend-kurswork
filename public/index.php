<?php
ob_start(); // Увімкнення буферизації виводу

// Налаштування CORS доступу
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
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

    // ==========================================
    // ЛОГІКА БУФЕРИЗАЦІЇ ТА КЕШУВАННЯ
    // ==========================================
    $cacheDir = __DIR__ . '/../cache/';
    if (!is_dir($cacheDir)) {
        mkdir($cacheDir, 0777, true);
    }

    $cacheableRoutes = [
        '/api/tests' => 120, // 2 хвилини
        '/api/profile/history' => 60 // 1 хвилина
    ];

    $isCacheable = ($_SERVER['REQUEST_METHOD'] === 'GET' && array_key_exists($uriPath, $cacheableRoutes));
    $cacheFile = '';
    $cacheTime = 0;

    if ($isCacheable) {
        $userId = $_SESSION['user_id'] ?? 'guest';
        $cacheKey = md5($uriPath . '_' . $userId);
        $cacheFile = $cacheDir . $cacheKey . '.json';
        $cacheTime = $cacheableRoutes[$uriPath];

        if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTime)) {
            header('X-Cache: HIT');
            echo file_get_contents($cacheFile);
            exit;
        }
    }

    // Реєстрація функції, яка виконається в кінці скрипта
    register_shutdown_function(function() use ($isCacheable, $cacheFile) {
        $output = ob_get_clean();
        $status = http_response_code();
        
        // Кешуємо тільки успішні відповіді (200 OK)
        if ($isCacheable && $status === 200 && !empty($output)) {
            file_put_contents($cacheFile, $output);
            header('X-Cache: MISS'); // Хоча заголовки можуть бути вже відправлені, PHP дозволяє це якщо буфер ще не виведено (але ми вже вивели? Ні, ми його тільки зараз виводимо)
            // header() тут може не спрацювати, якщо exit викликано раніше, але збереження у файл працюватиме ідеально.
        }
        
        echo $output;
    });
    // ==========================================

    $db = new \app\Models\Database();
    $connection = $db->getConnection();

    $userModel = new \app\Models\UserModel($connection);
    $resultModel = new \app\Models\ResultModel($connection);
    $testModel = new \app\Models\TestModel($connection);
    $questionModel = new \app\Models\QuestionModel($connection);
    $answerModel = new \app\Models\AnswerModel($connection);

    $chatModel = new \app\Models\ChatModel($connection);
    $messageModel = new \app\Models\MessageModel($connection);

    $controller = new \app\Controllers\AuthController($userModel);
    $testContoller = new \app\Controllers\TestController($testModel, $questionModel, $answerModel, $resultModel);
    $chatController = new \app\Controllers\ChatController($chatModel, $messageModel, $userModel);
    $id = $_GET['id'] ?? null;

    $userController = new \app\Controllers\UserController($userModel, $resultModel);

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

    // Додаткова перевірка авторизації
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Користувач не авторизований"]);
        return;
    }

    if ($uriPath === '/api/auth/logout') {
        $controller->logout();
        exit;
    }

    if ($uriPath === '/api/profile') {
        $userController->get_profile();
        exit;
    }

    if ($uriPath === '/api/profile/history') {
        $userController->get_history();
        exit;
    }

    if ($uriPath === '/api/profile/avatar/upload') {
        $userController->upload_avatar();
        exit;
    }

    if ($uriPath === '/api/profile/avatar/delete') {
        $userController->delete_avatar();
        exit;
    }

    if ($uriPath === '/api/chats') {
        $chatController->get_chats();
        exit;
    }

    if ($uriPath === '/api/chats/messages') {
        $chatController->get_messages();
        exit;
    }

    if ($uriPath === '/api/chats/start') {
        $chatController->start_chat();
        exit;
    }

    if ($uriPath === '/api/users/search') {
        $chatController->search_users();
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

    if ($uriPath === '/api/tests/all') {
        $testContoller->getAllTests();
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
