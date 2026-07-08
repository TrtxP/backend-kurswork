<?php

namespace app\Models;

use PDO;

class ResultModel
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function add(int $user_id, int $test_id, float $score): bool
    {
        $stmt = $this->db->prepare("INSERT INTO results (user_id, test_id, score) VALUES (?, ?, ?)");
        return $stmt->execute([$user_id, $test_id, $score]);
    }

    public function getResults(int $user_id): array
    {
        $sql = "SELECT r.score, r.completed_at, t.title as test_title 
                FROM results r
                JOIN tests t ON r.test_id = t.id
                WHERE r.user_id = ?
                ORDER BY r.completed_at DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$user_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
