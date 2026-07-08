<?php

namespace app\Models;

use PDO;
use app\Role;

class UserModel {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function findByLogin(string $login): mixed {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE login = ?");
        $stmt->execute([$login]);
        return $stmt->fetch();
    }

    public function findById(int $id): mixed {
        $stmt = $this->db->prepare("SELECT id, login, full_name, role, group_name FROM users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function add(string $login, string $password, string $full_name, Role $role, string $group_name): bool {
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $this->db->prepare("INSERT INTO users (login, password, full_name, role, group_name) VALUES (?, ?, ?, ?, ?)");
        return $stmt->execute([$login, $hashed_password, $full_name, $role->value, $group_name]);
    }

    public function update(int $id, string $login, string $password): bool {
        $stmt = $this->db->prepare("UPDATE users SET login = ?, password = ? WHERE id = ?");
        return $stmt->execute([$login, $password, $id]);

    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function getAll(): array {
        $stmt = $this->db->prepare("SELECT id, login, full_name, role, group_name FROM users");
        $stmt->execute();
        return $stmt->fetchAll();
    }
}

?>