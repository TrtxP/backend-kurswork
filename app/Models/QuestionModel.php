<?php

namespace app\Models;

use app\Type;
use PDO;

class QuestionModel
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function getByTestId(int $testId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM questions WHERE test_id = ?");
        $stmt->execute([$testId]);
        return $stmt->fetchAll();
    }

    public function create(int $testId, string $questionText, int $points, Type $type, string $imageUrl): int
    {
        $stmt = $this->db->prepare("INSERT INTO questions (test_id, question_text, points, type, image_url) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$testId, $questionText, $points, $type->value, $imageUrl]);
        return (int) $this->db->lastInsertId();
    }

    public function deleteByTestId(int $testId): bool
    {
        $stmt = $this->db->prepare("DELETE FROM questions WHERE test_id = ?");
        return $stmt->execute([$testId]);
    }
}
