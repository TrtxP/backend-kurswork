<?php

namespace app\Models;

use PDO;

class MessageModel {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function getChatMessages(int $chatId): array {
        $stmt = $this->db->prepare("SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC");
        $stmt->execute([$chatId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function sendMessage(int $chatId, int $senderId, string $text): mixed {
        $stmt = $this->db->prepare("INSERT INTO messages (chat_id, sender_id, message_text) VALUES (?, ?, ?)");
        if ($stmt->execute([$chatId, $senderId, $text])) {
            $msgId = $this->db->lastInsertId();
            
            // Оновлюємо updated_at в чаті
            $updStmt = $this->db->prepare("UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $updStmt->execute([$chatId]);

            $fetchStmt = $this->db->prepare("SELECT * FROM messages WHERE id = ?");
            $fetchStmt->execute([$msgId]);
            return $fetchStmt->fetch(PDO::FETCH_ASSOC);
        }
        return false;
    }

    public function markAsRead(int $chatId, int $receiverId): bool {
        $stmt = $this->db->prepare("UPDATE messages SET is_read = 1 WHERE chat_id = ? AND sender_id != ?");
        return $stmt->execute([$chatId, $receiverId]);
    }
}
