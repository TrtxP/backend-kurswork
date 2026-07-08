<?php

namespace app\Models;

use PDO;

class AnswerModel
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function getByQuestionId(int $questionId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM answers WHERE question_id = ?");
        $stmt->execute([$questionId]);
        return $stmt->fetchAll();
    }

    public function create(int $questionId, string $answer_text, int $is_correct): bool
    {
        $stmt = $this->db->prepare("INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)");
        return $stmt->execute([$questionId, $answer_text, $is_correct]);
    }

    public function deleteByQuestionIds(int $testId): bool
    {
        $stmt = $this->db->prepare("DELETE answers FROM answers JOIN questions ON answers.question_id = questions.id WHERE questions.test_id = ?");
        return $stmt->execute([$testId]);
    }

    public function is_correct(int $id): bool
    {
        $stmt = $this->db->prepare("SELECT is_correct FROM answers WHERE id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? (bool)$result['is_correct'] : false;
    }
}
