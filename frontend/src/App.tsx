import { useState, useEffect } from "react";
import type { AuthCheckResponse, Test, FullTest } from "./types";
import Login from "./components/Login";
import Register from "./components/Register";

export default function App() {
  const [authState, setAuthState] = useState<AuthCheckResponse>({
    isLoggedIn: false,
  });

  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<Test[]>([]);

  const [activeTest, setActiveTest] = useState<FullTest | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number[]>([]);
  const [testResult, setTestResult] = useState<{
    score: string;
    correct: number;
    total: number;
  } | null>(null);

  const handleNavigateToRegister = () => {
    setIsRegistering(true);
  };

  const loadTests = () => {
    fetch("http://localhost/backend-kurswork/public/api/tests", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        return res.json();
      })
      .then((data) => setTests(Array.isArray(data) ? data : []))
      .catch((err) => console.error(`Помилка завантаження тестів: ${err}`));
  };

  useEffect(() => {
    fetch("http://localhost/backend-kurswork/public/api/auth/check", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => {
        if (res.status === 401) {
          return { isLoggedIn: false };
        }

        if (!res.ok) {
          throw new Error(`Помилка сервера: ${res.status}`);
        }

        return res.json();
      })
      .then((data: AuthCheckResponse) => {
        setAuthState(data);
        if (data.isLoggedIn) loadTests();
      })
      .catch((err) => {
        console.error(`Помилка аутентифікації або мережі: ${err}`);
        setAuthState({ isLoggedIn: false });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStartTest = (id: number) => {
    fetch(`/api/tests/get?id=${id}`)
      .then((res) => res.json())
      .then((data: FullTest) => {
        setActiveTest(data);
        setSelectedAnswer([]);
        setTestResult(null);
      });
  };

  const handleAnswerSelect = (answerId: number) => {
    setSelectedAnswer((prev) =>
      prev.includes(answerId)
        ? prev.filter((id) => id !== answerId)
        : [...prev, answerId],
    );
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;

    fetch(`/api/tests/submit?id=${activeTest.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: selectedAnswer }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setTestResult({
            score: data.score,
            correct: data.correct,
            total: data.total,
          });
        } else {
          alert(data.message);
        }
      });
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <h3>Завантаження системи...</h3>
      </div>
    );

  if (!authState.isLoggedIn) {
    if (isRegistering) {
      return (
        <Register
          onRegisterSuccess={() => setIsRegistering(false)}
          onCancel={() => setIsRegistering(false)}
        />
      );
    }

    return (
      <Login
        onLoginSuccess={loadTests}
        onNavigateToRegister={handleNavigateToRegister}
      />
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
                Правильних відповідей: {testResult.score} з {testResult.total}
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
                  <div className="mt-2">
                    {question.answers.map((answer) => (
                      <div className="form-check" key={answer.id}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`ans-${answer.id}`}
                          checked={selectedAnswer.includes(answer.id)}
                          onChange={() => handleAnswerSelect(answer.id)}
                        />
                        <label
                          className="form-check-input-label ms-2"
                          htmlFor={`ans-${answer.id}`}
                        >
                          {answer.answer_text}
                        </label>
                      </div>
                    ))}
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
            <strong>
              {authState.role === "admin" ? "Викладач" : "Студент"}
            </strong>
          </p>
        </div>
        <button
          className="btn btn-outline-danger"
          onClick={() =>
            fetch("/api/auth/logout").then(() => window.location.reload())
          }
        >
          Вийти
        </button>
      </div>

      {authState.role === "admin" && (
        <div className="card card-body mb-5 border-primary bg-white shadow-sm">
          <h5 className="text-primary">Панель уравління курсом</h5>
          <p className="small text-muted">
            Ви можете створювати нові тести, додавати до них питання, варіанти
            відповідей та виставляти критерії оцінювання.
          </p>
          <button
            className="btn btn-primary btn-sm w-auto align-self-start"
            onClick={() =>
              alert("Форма конструктора тестів у процесі розробки за планом")
            }
          >
            Створити тест за планом
          </button>
        </div>
      )}

      <h3 className="mb-4">Доступні модульні тести</h3>
      <div className="row">
        {tests.map((test) => (
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
                  {authState.role === "student" ? (
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
                            fetch(`/api/tests/delete?id=${test.id}`, {
                              method: "DELETE",
                            }).then(() => loadTests());
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
        {tests.length === 0 && (
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
