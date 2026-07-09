import { useState } from "react";
import type {
  FullTest,
  DashboardProps,
  UserAnswersState,
  CreativeTest,
} from "../types";

export default function Dashboard({
  role,
  initialTests,
  refreshTests,
}: DashboardProps) {
  const [activeTest, setActiveTest] = useState<FullTest | null>(null);
  const [answers, setAnswers] = useState<UserAnswersState>({});
  const [testResult, setTestResult] = useState<{
    score: string;
    correct: number;
    total: number;
  } | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [newTest, setNewTest] = useState<CreativeTest>({
    title: "",
    description: "",
    time_limit: 30,
    is_fullscreen: false,
    disable_copy: false,
    questions: [],
  });

  const handleAddQuestion = () => {
    setNewTest((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question_text: "",
          points: 1,
          type: "radio",
          image_url: "",
          answers: [{ answer_text: "", is_correct: false }],
        },
      ],
    }));
  };

  const handleRemoveQuestion = (qIdx: number) => {
    setNewTest((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, idx) => idx !== qIdx),
    }));
  };

  const handleQuestionChange = (
    qIdx: number,
    field: "question_text" | "points" | "type" | "image_url",
    value: string | number | null,
  ) => {
    setNewTest((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIdx] = { ...updatedQuestions[qIdx], [field]: value };

      if (field === "type" && value === "text") {
        updatedQuestions[qIdx].answers = [
          { answer_text: "", is_correct: true },
        ];
      }
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleAddAnswer = (qIdx: number) => {
    setNewTest((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIdx].answers.push({
        answer_text: "",
        is_correct: false,
      });
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleRemoveAnswer = (qIdx: number, aIdx: number) => {
    setNewTest((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIdx].answers = updatedQuestions[qIdx].answers.filter(
        (_, idx) => idx !== aIdx,
      );
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleAnswerChange = (
    qIdx: number,
    aIdx: number,
    field: "answer_text" | "is_correct",
    value: string | boolean,
  ) => {
    setNewTest((prev) => {
      const updatedQuestions = [...prev.questions];
      const answers = [...updatedQuestions[qIdx].answers];

      if (field === "is_correct" && updatedQuestions[qIdx].type === "radio") {
        answers.forEach((ans, idx) => {
          ans.is_correct = idx === aIdx;
        });
      } else {
        answers[aIdx] = { ...answers[aIdx], [field]: value };
      }

      updatedQuestions[qIdx].answers = answers;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleSaveTest = () => {
    if (!newTest.title.trim()) {
      alert("Будь ласка, введіть назву тесту");
      return;
    }
    if (newTest.questions.length === 0) {
      alert("Додайте хоча б одне запитання");
      return;
    }

    fetch("http://localhost/backend-kurswork/public/api/tests/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTest),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert("Тест успішно створено");
          setIsCreating(false);
          setNewTest({
            title: "",
            description: "",
            time_limit: 30,
            is_fullscreen: false,
            disable_copy: false,
            questions: [],
          });
          refreshTests();
        } else {
          alert(data.message || "Помилка при збереженні тесту");
        }
      })
      .catch((err) => console.error(`Помилка: ${err}`));
  };

  const handleStartTest = (id: number) => {
    fetch(`http://localhost/backend-kurswork/public/api/tests/get?id=${id}`)
      .then((res) => res.json())
      .then((data: FullTest) => {
        setActiveTest(data);
        setAnswers({});
        setTestResult(null);
      });
  };

  const handleRadioSelect = (questionId: number, answerId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { question_id: questionId, selected_id: answerId },
    }));
  };

  const handleCheckboxSelect = (questionId: number, answerId: number) => {
    setAnswers((prev) => {
      const currentSelection: number[] = prev[questionId]?.selected_ids || [];
      const updatedSelection = currentSelection.includes(answerId)
        ? currentSelection.filter((id) => id !== answerId)
        : [...currentSelection, answerId];

      return {
        ...prev,
        [questionId]: {
          question_id: questionId,
          selected_ids: updatedSelection,
        },
      };
    });
  };

  const handleTextChange = (questionId: number, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { question_id: questionId, user_text: text },
    }));
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;

    fetch(
      `http://localhost/backend-kurswork/public/api/tests/submit?id=${activeTest.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: Object.values(answers) }),
      },
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setTestResult({
            score: data.score,
            correct: data.correct,
            total: data.total,
          });
        } else {
          alert(data.message || "Помилка під час збереження результатів");
        }
      });
  };

  const handleLogout = () => {
    fetch("http://localhost/backend-kurswork/public/api/auth/logout").then(() =>
      window.location.reload(),
    );
  };

  if (isCreating) {
    return (
      <div className="container mt-5 mb-5">
        <div className="card shadow p-4 bg-white">
          <h2 className="text-primary mb-4">Конструктор нового тесту</h2>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label font-weight-bold">Назва тесту</label>
              <input
                type="text"
                className="form-control"
                value={newTest.title}
                onChange={(e) =>
                  setNewTest({ ...newTest, title: e.target.value })
                }
                placeholder="Введіть назву тесту..."
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Обмеження часу (хв)</label>
              <input
                type="number"
                className="form-control"
                value={newTest.time_limit}
                onChange={(e) =>
                  setNewTest({ ...newTest, time_limit: Number(e.target.value) })
                }
              />
            </div>
            <div className="col-12">
              <label className="form-label">Опис тесту</label>
              <textarea
                className="form-control"
                rows={2}
                value={newTest.description}
                onChange={(e) =>
                  setNewTest({ ...newTest, description: e.target.value })
                }
                placeholder="Введіть опис тесту..."
              ></textarea>
            </div>
            <div className="col-12 d-flex gap-4 mt-3">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="switchFs"
                  checked={newTest.is_fullscreen}
                  onChange={(e) =>
                    setNewTest({ ...newTest, is_fullscreen: e.target.checked })
                  }
                />
                <label className="form-check-label ms-1" htmlFor="switchFs">
                  Повноекранний режим (Strict Fullscreen)
                </label>
              </div>
              <div className="form check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="switchCopy"
                  checked={newTest.disable_copy}
                  onChange={(e) =>
                    setNewTest({ ...newTest, disable_copy: e.target.checked })
                  }
                />
                <label className="form-check-label ms-1" htmlFor="switchCopy">
                  Заборонити копіювання тексту (No Copy)
                </label>
              </div>
            </div>
          </div>

          <hr />

          <h3 className="h4 text-dark mb-3">Запитання тексту</h3>
          {newTest.questions.map((question, qIdx) => (
            <div
              key={qIdx}
              className="card p-3 mb-4 bg-light border-left border-primary"
              style={{ borderLeftWidth: "5px" }}
            >
              <div className="d-flex justify-content-between aligh-items-center mb-3">
                <h5 className="text-secondary mb-0">Запитання №{qIdx + 1}</h5>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleRemoveQuestion(qIdx)}
                >
                  Видалити питання
                </button>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-7">
                  <label className="form-label JSON-sub-label small">
                    Текст питання
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={question.question_text}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIdx,
                        "question_text",
                        e.target.value,
                      )
                    }
                    placeholder="Введіть формулювання питання..."
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small">Тип питання</label>
                  <select
                    className="form-select"
                    value={question.type}
                    onChange={(e) =>
                      handleQuestionChange(qIdx, "type", e.target.value)
                    }
                  >
                    <option value="radio">Один правильний (Radio)</option>
                    <option value="checkbox">
                      Кілька правильних (Checkbox)
                    </option>
                    <option value="text">Ввід текст вручну (Text)</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label small">Бали</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    value={question.points}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIdx,
                        "points",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small">
                    URL-посилання на картинку (необов'язково)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={question.image_url ?? ""}
                    onChange={(e) =>
                      handleQuestionChange(qIdx, "image_url", e.target.value)
                    }
                    placeholder="Введіть URL-посилання картинки..."
                  />
                </div>
              </div>

              <div className="ms-4">
                <label className="form-label font-weight-bold small text-dark">
                  Варіанти відповідей:
                </label>

                {question.answers.map((answer, aIdx) => (
                  <div
                    key={aIdx}
                    className="d-flex align-items-center gap-2 mb-2"
                  >
                    {question.type === "radio" && (
                      <input
                        type="radio"
                        name={`new-q-radio-${qIdx}`}
                        checked={answer.is_correct}
                        onChange={() =>
                          handleAnswerChange(qIdx, aIdx, "is_correct", true)
                        }
                      />
                    )}
                    {question.type === "checkbox" && (
                      <input
                        type="checkbox"
                        checked={answer.is_correct}
                        onChange={(e) =>
                          handleAnswerChange(
                            qIdx,
                            aIdx,
                            "is_correct",
                            e.target.checked,
                          )
                        }
                      />
                    )}
                    {question.type === "text" && (
                      <span className="badge bg-success text-white">Ключ</span>
                    )}

                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={answer.answer_text}
                      onChange={(e) =>
                        handleAnswerChange(
                          qIdx,
                          aIdx,
                          "answer_text",
                          e.target.value,
                        )
                      }
                      placeholder={
                        question.type === "text"
                          ? "Введіть правильне еталонне слово..."
                          : `Варіант №${aIdx + 1}`
                      }
                    />

                    {question.type !== "text" &&
                      question.answers.length > 1 && (
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleRemoveAnswer(qIdx, aIdx)}
                        >
                          x
                        </button>
                      )}
                  </div>
                ))}

                {question.type !== "text" && (
                  <button
                    className="btn btn-link btn-sm p-0 text-decoration-none mt-1"
                    onClick={() => handleAddAnswer(qIdx)}
                  >
                    Додати варіант відповіді
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            className="btn btn-outline-primary w-100 py-2 mb-4"
            onClick={handleAddQuestion}
          >
            Додати нове запитання
          </button>

          <div className="d-flex justify-content-between border-top pt-3">
            <button
              className="btn btn-secondary"
              onClick={() => setIsCreating(false)}
            >
              Скасувати
            </button>
            <button className="btn btn-success px-4" onClick={handleSaveTest}>
              Зберегти тест
            </button>
            <button></button>
          </div>
        </div>
      </div>
    );
  }

  if (activeTest) {
    return (
      <div
        className="container mt-5"
        style={{ userSelect: activeTest.disable_copy ? "none" : "auto" }}
      >
        <div className="card shadow p-4">
          <h2>{activeTest.title}</h2>
          <p className="text-muted">{activeTest.description}</p>

          {testResult ? (
            <div className="alert alert-success mt-4">
              <h4>Тест завершено!</h4>
              <p>
                Ваш результат: <strong>{testResult.score}%</strong>
              </p>
              <p>
                Правильних відповідей: {testResult.correct} з {testResult.total}
              </p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => setActiveTest(null)}
              >
                Повернутися до списку тестів
              </button>
            </div>
          ) : (
            <div>
              <div className="alert alert-warning py-2">
                Обмеження часу: {activeTest.time_limit} хв
              </div>

              {activeTest.questions.map((question, qIdx) => (
                <div
                  key={question.id}
                  className="mb-4 p-3 border rounded bg-white"
                >
                  <h5>
                    {qIdx + 1} . {question.question_text}{" "}
                    <span className="text-muted small">
                      ({question.points} 6.)
                    </span>
                  </h5>
                  {question.image_url && (
                    <div className="my-3">
                      <img
                        src={question.image_url}
                        alt="Запитання"
                        className="img-fluid rounded border"
                        style={{ maxHeight: "300px" }}
                      />
                    </div>
                  )}
                  <div className="mt-2">
                    {question.type === "radio" &&
                      question.answers.map((answer) => (
                        <div className="form-check" key={answer.id}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`question-${question.id}`}
                            id={`ans-${answer.id}`}
                            checked={
                              answers[question.id]?.selected_id === answer.id
                            }
                            onChange={() =>
                              handleRadioSelect(question.id, answer.id)
                            }
                          />
                          <label
                            className="form-check-label ms-2"
                            htmlFor={`ans-${answer.id}`}
                          >
                            {answer.answer_text}
                          </label>
                        </div>
                      ))}

                    {question.type === "checkbox" &&
                      question.answers.map((answer) => (
                        <div className="form-check" key={answer.id}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`ans-${answer.id}`}
                            checked={
                              answers[question.id]?.selected_ids?.includes(
                                answer.id,
                              ) || false
                            }
                            onChange={() =>
                              handleCheckboxSelect(question.id, answer.id)
                            }
                          />
                          <label className="form-check-label ms-2" htmlFor={`ans-${answer.id}`}>{answer.answer_text}</label>
                        </div>
                      ))}

                    {question.type === "text" && (
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Введіть відповідь тексту вручну..."
                        value={answers[question.id]?.user_text ?? ""}
                        onChange={(e) =>
                          handleTextChange(question.id, e.target.value)
                        }
                      />
                    )}
                  </div>
                </div>
              ))}

              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    if (confirm("Перервати тест? Результати не збережуться."))
                      setActiveTest(null);
                  }}
                >
                  Скасувати
                </button>
                <button className="btn btn-success" onClick={handleSubmitTest}>
                  Здати тест
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2">Освітня платформа</h1>
          <p className="text-muted">
            Роль у системі:{" "}
            <strong>{role === "admin" ? "Викладач" : "Студент"}</strong>
          </p>
        </div>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Вийти
        </button>
      </div>

      {role === "admin" && (
        <div className="card card-body mb-5 border-primary bg-white shadow-sm">
          <h5 className="text-primary">Панель уравління курсом</h5>
          <p className="small text-muted">
            Ви можете створювати нові тести, додавати до них питання, варіанти
            відповідей та виставляти критерії оцінювання.
          </p>
          <button
            className="btn btn-primary btn-sm w-auto align-self-start"
            onClick={() =>
              setIsCreating(true)
            }
          >
            Створити тест за планом
          </button>
        </div>
      )}

      <h3 className="mb-4">Доступні модульні тести</h3>
      <div className="row">
        {initialTests.map((test) => (
          <div className="col-md-4" key={test.id}>
            <div className="card mb-4 shadow-sm h-100 d-flex flex-column justify-content-between">
              <div className="card-body">
                <h5 className="card-title text-dark">{test.title}</h5>
                <p className="card-text text-muted small">{test.description}</p>
                <div className="mb-2">
                  <span className="badge bg-light text-dark border me-2">
                    {test.time_limit} хв
                  </span>
                  {test.is_fullscreen && (
                    <span className="badge bg-info text-white me-1">
                      Fullscreen
                    </span>
                  )}
                  {test.disable_copy && (
                    <span className="badge bg-danger text-white">No copy</span>
                  )}
                </div>
                <div className="card-footer bg-transparent border-top-0 p-3">
                  {role === "student" ? (
                    <button
                      className="btn btn-success w-100"
                      onClick={() => handleStartTest(test.id)}
                    >
                      Розпочати тестування
                    </button>
                  ) : (
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-warning btn-sm flex-grow-1">
                        Редагувати
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          if (
                            confirm(
                              `Видалити цей тест та всі зв'язані питання?`,
                            )
                          ) {
                            fetch(
                              `http://localhost/backend-kurswork/public/api/tests/delete?id=${test.id}`,
                              {
                                method: "DELETE",
                              },
                            ).then(() => refreshTests());
                          }
                        }}
                      >
                        Видалити
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {initialTests.length === 0 && (
          <div className="col-12">
            <div className="alert alert-info">
              Наразі немає активних тестів для вашої групи
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
