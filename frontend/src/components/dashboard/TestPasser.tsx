import type { TestPasserProps } from "../../types";
import { formatTime } from "../../utils/formatTime";

export default function TestPasser({
  test,
  answers,
  timeLeft,
  testResult,
  onRadioSelect,
  onCheckboxSelect,
  onTextChange,
  onSubmit,
  onCancel,
}: TestPasserProps) {
  return (
    <div
      className="container mt-5"
      style={{ userSelect: test.disable_copy ? "none" : "auto" }}
    >
      <div className="card shadow p-4">
        <h2>{test.title}</h2>
        <p className="text-muted">{test.description}</p>

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
