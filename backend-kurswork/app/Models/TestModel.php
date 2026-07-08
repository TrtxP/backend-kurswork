<?php 

namespace app\Models;

use PDO;

class TestModel {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function getAll(): array {
        $sql = "SELECT * FROM tests ORDER BY created_at DESC";
        $result = $this->db->query($sql);
        return $result->fetchAll();
    }

    public function getById(int $id): array|false {
        $stmt = $this->db->prepare("SELECT * FROM tests WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create(string $title, string $description, int $time_limit, int $is_fullscreen, int $disable_copy): int {
        $stmt = $this->db->prepare("INSERT INTO tests (title, description, time_limit, is_fullscreen, disable_copy) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$title, $description, $time_limit, $is_fullscreen, $disable_copy]);
        return (int) $this->db->lastInsertId();
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM tests WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function update(int $id, string $title, string $description, int $time_limit, int $is_fullscreen, int $disable_copy): bool {
        $stmt = $this->db->prepare("UPDATE tests SET title = ?, description = ?, time_limit = ?, is_fullscreen = ?, disable_copy = ? WHERE id = ?");
        return $stmt->execute([$title, $description, $time_limit, $is_fullscreen, $disable_copy, $id]);
    }
}

?>