<?php

namespace app\Controllers;

use app\Models\ChatModel;
use app\Models\MessageModel;
use app\Models\UserModel;

class ChatController
{
    private ChatModel $chatModel;
    private MessageModel $messageModel;
    private UserModel $userModel;

    public function __construct(ChatModel $chatModel, MessageModel $messageModel, UserModel $userModel)
    {
        $this->chatModel = $chatModel;
        $this->messageModel = $messageModel;
        $this->userModel = $userModel;
    }

    private function requireAuth(): int
    {
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Неавторизовано"]);
            exit;
        }
        return $_SESSION['user_id'];
    }

    public function get_chats(): void
    {
        header('Content-Type: application/json');
        $userId = $this->requireAuth();
        
        $chats = $this->chatModel->getUserChats($userId);
        
        http_response_code(200);
        echo json_encode(["status" => "success", "chats" => $chats]);
        exit;
    }

    public function get_messages(): void
    {
        header('Content-Type: application/json');
        $userId = $this->requireAuth();
        
        $chatId = $_GET['chat_id'] ?? null;
        if (!$chatId) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Вкажіть chat_id"]);
            exit;
        }

        // Позначаємо повідомлення як прочитані
        $this->messageModel->markAsRead($chatId, $userId);

        $messages = $this->messageModel->getChatMessages((int)$chatId);
        
        http_response_code(200);
        echo json_encode(["status" => "success", "messages" => $messages]);
        exit;
    }

    public function search_users(): void
    {
        header('Content-Type: application/json');
        $userId = $this->requireAuth();
        
        $query = $_GET['q'] ?? '';
        
        $allUsers = $this->userModel->getAll();
        
        $results = array_filter($allUsers, function($u) use ($query, $userId) {
            if ($u['id'] == $userId) return false;
            if (empty($query)) return true;
            return mb_stripos($u['full_name'], $query) !== false || mb_stripos($u['login'], $query) !== false;
        });

        http_response_code(200);
        echo json_encode(["status" => "success", "users" => array_values($results)]);
        exit;
    }

    public function start_chat(): void
    {
        header('Content-Type: application/json');
        $userId = $this->requireAuth();

        $data = json_decode(file_get_contents('php://input'), true);
        $partnerId = $data['partner_id'] ?? null;

        if (!$partnerId) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Вкажіть partner_id"]);
            exit;
        }

        $chatId = $this->chatModel->findOrCreateChat($userId, $partnerId);
        
        http_response_code(200);
        echo json_encode(["status" => "success", "chat_id" => $chatId]);
        exit;
    }
}
