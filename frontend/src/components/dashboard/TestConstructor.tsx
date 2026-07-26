import type { TestConstructorProps } from "../../types";

export default function TestConstructor({
  newTest,
  setNewTest,
  onAddQuestion,
  onRemoveQuestion,
  onQuestionChange,
  onAddAnswer,
  onRemoveAnswer,
  onAnswerChange,
  onSave,
  onCancel,
}: TestConstructorProps) {
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
                onClick={() => onRemoveQuestion(qIdx)}
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
                    onQuestionChange(qIdx, "question_text", e.target.value)
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
                    onQuestionChange(qIdx, "type", e.target.value)
                  }
                >
                  <option value="radio">Один правильний (Radio)</option>
                  <option value="checkbox">Кілька правильних (Checkbox)</option>
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
                    onQuestionChange(qIdx, "points", Number(e.target.value))
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
                    onQuestionChange(qIdx, "image_url", e.target.value)
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
                        onAnswerChange(qIdx, aIdx, "is_correct", true)
                      }
                    />
                  )}
                  {question.type === "checkbox" && (
                    <input
                      type="checkbox"
                      checked={answer.is_correct}
                      onChange={(e) =>
                        onAnswerChange(
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
                      onAnswerChange(
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

                  {question.type !== "text" && question.answers.length > 1 && (
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => onRemoveAnswer(qIdx, aIdx)}
                    >
                      x
                    </button>
                  )}
                </div>
              ))}

              {question.type !== "text" && (
                <button
                  className="btn btn-link btn-sm p-0 text-decoration-none mt-1"
                  onClick={() => onAddAnswer(qIdx)}
                >
                  Додати варіант відповіді
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          className="btn btn-outline-primary w-100 py-2 mb-4"
          onClick={onAddQuestion}
        >
          Додати нове запитання
        </button>

        <div className="d-flex justify-content-between border-top pt-3">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Скасувати
          </button>
          <button className="btn btn-success px-4" onClick={onSave}>
            Зберегти тест
          </button>
        </div>
      </div>
    </div>
  );
}
