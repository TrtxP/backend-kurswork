import { useEffect, useRef } from "react";
import type { TestPasserProps } from "../../types";
import { formatTime } from "../../utils/formatTime";

// ── Стилі оверлеїв (inline, без Bootstrap) ─────────────────────────────────
const overlayBase: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1.5rem",
};

const enteringOverlay: React.CSSProperties = {
  ...overlayBase,
  background: "radial-gradient(ellipse at center, #0d0d1a 0%, #000 100%)",
  animation: "fsEnterFade 0.8s ease forwards",
};

const violatedOverlay: React.CSSProperties = {
  ...overlayBase,
  background: "rgba(200, 0, 0, 0.92)",
  backdropFilter: "blur(6px)",
  animation: "fsPulse 0.4s ease",
};

const annulledOverlay: React.CSSProperties = {
  ...overlayBase,
  background: "rgba(10, 10, 10, 0.97)",
};

// ── Компонент ──────────────────────────────────────────────────────────────
export default function TestPasser({
  test,
  answers,
  timeLeft,
  fullscreenPhase,
  violationCount,
  testResult,
  onRadioSelect,
  onCheckboxSelect,
  onTextChange,
  onSubmit,
  onCancel,
}: TestPasserProps) {
  const isFullscreenTest = Boolean(Number(test.is_fullscreen));

  // Додаємо keyframes лише один раз
  const styleInjected = useRef(false);
  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes fsEnterFade {
        0%   { opacity: 0; transform: scale(1.08); }
        60%  { opacity: 1; transform: scale(1.00); }
        100% { opacity: 1; transform: scale(1.00); }
      }
      @keyframes fsPulse {
        0%   { transform: scale(1.00); }
        40%  { transform: scale(1.03); }
        100% { transform: scale(1.00); }
      }
      @keyframes fsSpinner {
        to { transform: rotate(360deg); }
      }
      .fs-spinner {
        width: 64px; height: 64px;
        border: 5px solid rgba(255,255,255,0.2);
        border-top-color: #fff;
        border-radius: 50%;
        animation: fsSpinner 0.9s linear infinite;
      }
      .fs-warning-icon {
        font-size: 4rem;
        animation: fsPulse 0.6s ease infinite alternate;
      }
    `;
    document.head.appendChild(style);
  }, []);

  // ── Оверлей: анімація входу у fullscreen ──────────────────────────────────
  if (fullscreenPhase === "entering") {
    return (
      <div style={enteringOverlay}>
        <div className="fs-spinner" />
        <p style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 600, letterSpacing: "0.05em" }}>
          Переходимо у повноекранний режим…
        </p>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem" }}>
          Будь ласка, зачекайте
        </p>
      </div>
    );
  }

  // ── Оверлей: порушення (вийшов з fullscreen) ──────────────────────────────
  if (fullscreenPhase === "violated") {
    return (
      <div style={violatedOverlay}>
        <div className="fs-warning-icon">⚠️</div>
        <h2 style={{ color: "#fff", fontWeight: 800, textAlign: "center", margin: 0 }}>
          Ви вийшли з повноекранного режиму!
        </h2>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.1rem", textAlign: "center", margin: 0 }}>
          Порушень: <strong>{violationCount}</strong>
        </p>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", textAlign: "center" }}>
          Результати будуть <strong>анульовані</strong> через 1 секунду…
        </p>
      </div>
    );
  }

  // ── Оверлей: результати анульовані ────────────────────────────────────────
  if (fullscreenPhase === "annulled") {
    return (
      <div style={annulledOverlay}>
        <div style={{ fontSize: "5rem" }}>🚫</div>
        <h2 style={{ color: "#ff4d4d", fontWeight: 800, textAlign: "center" }}>
          Результати анульовано
        </h2>
        <p style={{ color: "rgba(255,255,255,0.7)", textAlign: "center", maxWidth: 460 }}>
          Ви порушили умови тестування, вийшовши з повноекранного режиму.
          Результати цього тестування не зараховуються.
        </p>
        <button
          className="btn btn-outline-light mt-3"
          onClick={onCancel}
        >
          Повернутися до списку тестів
        </button>
      </div>
    );
  }

  // ── Основний інтерфейс тесту ──────────────────────────────────────────────
  return (
    <div
      className="container mt-5"
      style={{ userSelect: test.disable_copy ? "none" : "auto" }}
    >
      <div className="card shadow p-4">
        <h2>{test.title}</h2>
        <p className="text-muted">{test.description}</p>

        {isFullscreenTest && fullscreenPhase === "active" && (
          <div
            className="alert py-2 mb-3 d-flex align-items-center gap-2"
            style={{ background: "#fff3cd", borderColor: "#ffc107", color: "#856404" }}
          >
            <span>🔒</span>
            <span>
              Повноекранний режим активний. Вихід з нього призведе до{" "}
              <strong>анулювання результатів</strong>.
            </span>
          </div>
        )}

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
              onClick={onCancel}
            >
              Повернутися до списку тестів
            </button>
          </div>
        ) : (
          <div>
            <div className="alert alert-info py-2">
              Часу залишилося: {formatTime(timeLeft)}
            </div>

            {test.questions.map((question, qIdx) => (
              <div
                key={question.id}
                className="mb-4 p-3 border rounded bg-white"
              >
                <h5>
                  {qIdx + 1} . {question.question_text}{" "}
                  <span className="text-muted small">
                    ({question.points} б.)
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
                    question.answers?.map((answer) => (
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
                            onRadioSelect(question.id, answer.id)
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
                            onCheckboxSelect(question.id, answer.id)
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

                  {question.type === "text" && (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Введіть відповідь тексту вручну..."
                      value={answers[question.id]?.user_text ?? ""}
                      onChange={(e) =>
                        onTextChange(question.id, e.target.value)
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
                    onCancel();
                }}
              >
                Скасувати
              </button>
              <button className="btn btn-success" onClick={onSubmit}>
                Здати тест
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
