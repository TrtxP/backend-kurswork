<?php

namespace app\Models;

use PDO;

class ChatModel {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function getUserChats(int $userId): array {
        $stmt = $this->db->prepare("
            SELECT c.id, 
                   IF(c.user1_id = ?, c.user2_id, c.user1_id) as partner_id,
                   u.full_name as partner_name,
                   u.avatar_url as partner_avatar,
                   c.updated_at,
                   (SELECT message_text FROM messages m WHERE m.chat_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message
            FROM chats c
            JOIN users u ON u.id = IF(c.user1_id = ?, c.user2_id, c.user1_id)
            WHERE c.user1_id = ? OR c.user2_id = ?
            ORDER BY c.updated_at DESC
        ");
        $stmt->execute([$userId, $userId, $userId, $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findOrCreateChat(int $user1Id, int $user2Id): int {
        // Завжди сортуємо ID, щоб user1_id був меншим за user2_id (уникаємо дублів)
        $u1 = min($user1Id, $user2Id);
        $u2 = max($user1Id, $user2Id);

        $stmt = $this->db->prepare("SELECT id FROM chats WHERE user1_id = ? AND user2_id = ?");
        $stmt->execute([$u1, $u2]);
        $chat = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($chat) {
            return (int)$chat['id'];
        }

        $stmt = $this->db->prepare("INSERT INTO chats (user1_id, user2_id) VALUES (?, ?)");
        $stmt->execute([$u1, $u2]);
        return (int)$this->db->lastInsertId();
    }
}
