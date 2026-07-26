import type { TestListProps } from "../../types";

export default function TestList({
  role,
  tests,
  onStart,
  refreshTests,
}: TestListProps) {
  return (
    <>
      <h3 className="mb-4">Доступні модульні тести</h3>
      <div className="row">
        {tests.map((test) => (
          <div className="col-md-4" key={test.id}>
            <div className="card mb-4 shadow-sm h-100 d-flex flex-column justify-content-between">
              <div className="card-body">
                <h5 className="card-title text-dark">{test.title}</h5>
                <p className="card-text text-muted small">{test.description}</p>
                <div className="card-footer bg-transparent border-top-0 p-3">
                  {role === "student" ? (
                    <button
                      className="btn btn-success w-100"
                      onClick={() => onStart(test.id)}
                    >
                      Розпочати тестування
                    </button>
                  ) : (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-warning btn-sm flex-grow-1"
                        onClick={() => {
                          fetch(
                            `http://localhost/backend-kurswork/public/api/tests/update?id=${test.id}`,
                            {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              credentials: "include",
                            },
                          ).then(() => refreshTests());
                        }}
                      >
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
                                headers: { "Content-Type": "application/json" },
                                credentials: "include",
                              },
                            ).then(() => refreshTests());
                          }
                        }}
                      >
                        Видалити
                      </button>
                      <button
                        className="btn btn-success w-100"
                        onClick={() => onStart(test.id)}
                      >
                        Розпочати тестування
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
    </>
  );
}
