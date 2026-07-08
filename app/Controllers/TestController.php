<?php

namespace app\Controllers;

use app\Models\TestModel;
use app\Models\QuestionModel;
use app\Models\AnswerModel;
use app\Models\ResultModel;
use app\Role;

class TestController
{
    private TestModel $testModel;
    private QuestionModel $questionModel;
    private AnswerModel $answerModel;
    private ResultModel $resultModel;

    public function __construct(
        TestModel $testModel,
        QuestionModel $questionModel,
        AnswerModel $answerModel,
        ResultModel $resultModel
    ) {
        $this->testModel = $testModel;
        $this->questionModel = $questionModel;
        $this->answerModel = $answerModel;
        $this->resultModel = $resultModel;
    }

    public function index(): void
    {
        header('Content-Type: application/json');

        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Спочатку авторизуйтеся, щоб переглянути тести"]);
            return;
        }

        http_response_code(200);
        echo json_encode($this->testModel->getAll());
    }

    public function getTest(int $id): void
    {
        header('Content-Type: application/json');

        $test = $this->testModel->getById($id);

        if (!$test) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Тест не знайдено"]);
            return;
        }

        $questions = $this->questionModel->getByTestId($id);

        foreach ($questions as $question) {
            $question['answers'] = $this->answerModel->getByQuestionId($question['id']);
        }

        $test['questions'] = $questions;

        http_response_code(200);
        echo json_encode($test);
    }

    public function submit(int $test_id): void
    {
        header('Content-Type: application/json');

        $data = json_decode(file_get_contents('php://input'), true);
        $selectedAnswerIds = $data['answers'] ?? [];

        $questions = $this->questionModel->getByTestId($test_id);
        $totalQuestions = count($questions);

        if ($totalQuestions === 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Тест порожній"]);
            return;
        }

        $correctAnswersCount = 0;

        foreach ($selectedAnswerIds as $answerId) {
            if ($this->answerModel->is_correct($answerId)) {
                $correctAnswersCount++;
            }
        }

        $finalScore = ($correctAnswersCount / $totalQuestions) * 100;

        $user_id = $_SESSION['user_id'];

        $this->resultModel->add($user_id, $test_id, $finalScore);

        echo json_encode([
            "status" => "success",
            "score" => number_format($finalScore, 2),
            "correct" => $correctAnswersCount,
            "total" => $totalQuestions
        ]);
    }

    public function create(): void
    {
        header('Content-Type: application/json');

        if ($_SESSION['role'] !== Role::Admin) {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Доступ заборонено"]);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $testId = $this->testModel->create($data['title'], $data['description'], $data['time_limit'], $data['is_fullscreen'], $data['disable_copy']);

        foreach ($data['questions'] as $qData) {
            $qId = $this->questionModel->create($testId, $qData['question_text'], $qData['points']);

            foreach ($qData['answers'] as $aData) {
                $this->answerModel->create($qId, $aData['answer_text'], $aData['is_correct']);
            }
        }

        echo json_encode(["status" => "success", "test_id" => $testId]);
    }

    public function update(int $id): void
    {
        header('Content-Type: application/json');

        if ($_SESSION['role'] !== Role::Admin) {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Доступ заборонено"]);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $this->testModel->update($id, $data['title'], $data['description'], $data['time_limit'], $data['is_fullscreen'], $data['disable_copy']);

        $this->answerModel->deleteByQuestionIds($id);
        $this->questionModel->deleteByTestId($id);

        foreach ($data['questions'] as $qData) {
            $newQuestionId = $this->questionModel->create($id, $qData['question_text'], $qData['points']);

            foreach ($qData['answers'] as $aData) {
                $this->answerModel->create($newQuestionId, $aData['answer_text'], $aData['is_correct']);
            }
        }

        echo json_encode(["status" => "success", "test_id" => $id]);
    }

    public function delete(int $id): void
    {
        header('Content-Type: application/json');

        if ($_SESSION['role'] !== Role::Admin) {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Доступ заборонено"]);
            return;
        }

        $success = $this->testModel->delete($id);

        if ($success) {
            http_response_code(200);
            echo json_encode(["status" => "success"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Помилка видалення тесту"]);
        }
    }
}
