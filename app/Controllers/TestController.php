<?php

namespace app\Controllers;

use app\Models\TestModel;
use app\Models\QuestionModel;
use app\Models\AnswerModel;
use app\Models\ResultModel;
use app\Role;
use app\Type;

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

    public function getAllTests(): void {
        header('Content-Type: application/json');

        $tests = $this->testModel->getAll();
        http_response_code(200);
        echo json_encode($tests);
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

        foreach ($questions as $key => $question) {
            $answers = $this->answerModel->getByQuestionId($question['id']) ?: [];
            $questions[$key]['answers'] = $answers ?: [];
        }

        $test['questions'] = $questions;

        http_response_code(200);
        echo json_encode($test);
    }

    public function submit(int $test_id): void
    {
        header('Content-Type: application/json');

        $data = json_decode(file_get_contents('php://input'), true);
        $userAnswers = $data['answers'] ?? [];

        $questions = $this->questionModel->getByTestId($test_id);

        $totalPossiblePoints = 0; // Загальна кількість балів за тест
        $earnedPoints = 0; // Бали, які набрав студент 

        // Індексація питань за ID
        $questionIndexed = [];
        foreach ($questions as $q) {
            $questionIndexed[$q['id']] = $q;
            $totalPossiblePoints += (float)$q['points']; // Сумуємо вагу кожного питання з бази
        }

        foreach ($userAnswers as $userAnswer) {
            $qId = $userAnswer['question_id'];

            if (!isset($questionIndexed[$qId])) {
                continue;
            }

            $question = $questionIndexed[$qId];
            $realType = $question['type'];
            $questionPoints = (float)$question['points']; // Вага поточного питання

            switch ($realType) {
                case Type::Radio->value:
                    $selectedId = $userAnswer['selected_id'] ?? null;
                    if ($selectedId && $this->answerModel->is_correct($selectedId)) {
                        $earnedPoints += $questionPoints; // Додаємо бал за питання
                    }
                    break;

                case Type::CheckBox->value:
                    // 1. Отримування з фронтенду масив обраних студентом ID
                    $selectedIds = $userAnswer['selected_ids'] ?? []; // обробка стейту selected_ids
                    if (!is_array($selectedIds)) {
                        $selectedIds = [];
                    }

                    // 2. Витягування усіх варіантів відповідей для цього питання з бази
                    $allAnswers = $this->answerModel->getByQuestionId($qId) ?: [];

                    // 3. Формуємо масив ID тих відповідей, які насправді є правильними в базі
                    $correctIdsFromDb = [];
                    foreach ($allAnswers as $ans) {
                        if (!empty($ans['is_correct'])) {
                            $correctIdsFromDb[] = (int)$ans['id'];
                        }
                    }

                    // Перетворюємо масив студента в цілі числа для безпечного порівняння
                    $selectedIds = array_map('intval', $selectedIds);

                    // 4. Перевірка: масиви мають бути ідентичними (сортуємо їх для точного порівняння)
                    sort($selectedIds);
                    sort($correctIdsFromDb);

                    // Якщо обрані ID точно збігаються з правильними ID з бази — зараховуємо бал
                    if ($selectedIds === $correctIdsFromDb && !empty($correctIdsFromDb)) {
                        $earnedPoints += $questionPoints;
                    }
                    break;

                case Type::Text->value:
                    $correctAnswerRow = $this->answerModel->getByQuestionId($qId)[0] ?? null;
                    $userText = trim($userAnswer['user_text'] ?? '');

                    if ($correctAnswerRow && mb_strtolower($userText) === mb_strtolower($correctAnswerRow['answer_text'])) {
                        $earnedPoints += $questionPoints;
                    }
                    break;
            }
        }

        $finalScore = ($totalPossiblePoints > 0) ? ($earnedPoints / $totalPossiblePoints) * 100 : 0;

        $user_id = $_SESSION['user_id'];
        $this->resultModel->add($user_id, $test_id, $finalScore);

        echo json_encode([
            "status" => "success",
            "score" => number_format($finalScore, 2),
            "correct" => $earnedPoints,
            "total" => $totalPossiblePoints
        ]);
    }

    public function create(): void
    {
        header('Content-Type: application/json');

        if ($_SESSION['role'] !== Role::Admin->value) {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Доступ заборонено"]);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $testId = $this->testModel->create($data['title'], $data['description'], $data['time_limit'], $data['is_fullscreen'], $data['disable_copy']);

        foreach ($data['questions'] as $qData) {
            $imageUrl = $qData['image_url'] ?? null;
            $enumType = Type::from($qData['type']);

            $qId = $this->questionModel->create($testId, $qData['question_text'], $qData['points'], $enumType, $imageUrl);

            foreach ($qData['answers'] as $aData) {
                $this->answerModel->create($qId, $aData['answer_text'], $aData['is_correct']);
            }
        }

        echo json_encode(["status" => "success", "test_id" => $testId]);
    }

    public function update(int $id): void
    {
        header('Content-Type: application/json');

        if ($_SESSION['role'] !== Role::Admin->value) {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Доступ заборонено"]);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $this->testModel->update($id, $data['title'], $data['description'], $data['time_limit'], $data['is_fullscreen'], $data['disable_copy']);

        $this->answerModel->deleteByQuestionIds($id);
        $this->questionModel->deleteByTestId($id);

        foreach ($data['questions'] as $qData) {
            $enumType = Type::from($qData['type']);
            $imageUrl = $qData['image_url'] ?? null;
            $newQuestionId = $this->questionModel->create($id, $qData['question_text'], $qData['points'], $enumType, $imageUrl);

            foreach ($qData['answers'] as $aData) {
                $this->answerModel->create($newQuestionId, $aData['answer_text'], $aData['is_correct']);
            }
        }

        echo json_encode(["status" => "success", "test_id" => $id]);
    }

    public function delete(int $id): void
    {
        header('Content-Type: application/json');

        if ($_SESSION['role'] !== Role::Admin->value) {
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
