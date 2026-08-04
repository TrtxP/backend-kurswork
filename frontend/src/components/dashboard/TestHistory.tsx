import { useEffect, useState } from "react";
import type { Result } from "../../types";

export default function TestHistory({ onClose }: { onClose: () => void }) {
  const [history, setHistory] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost/backend-kurswork/public/api/profile/history", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Не вдалося завантажити історію");
        }
        return res.json();
      })
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Історія пройдених тестів</h2>
        <button className="btn btn-outline-secondary" onClick={onClose}>
          Повернутися назад
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Завантаження...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : history.length === 0 ? (
        <div className="alert alert-info">Ви ще не проходили жодного тесту.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Назва тесту</th>
                <th scope="col">Оцінка</th>
                <th scope="col">Дата проходження</th>
              </tr>
            </thead>
            <tbody>
              {history.map((result, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{result.test_title}</td>
                  <td>
                    <span
                      className={`badge rounded-pill ${result.score >= 50 ? "bg-success" : "bg-danger"
                        }`}
                      style={{ fontSize: "0.9rem" }}
                    >
                      {result.score}%
                    </span>
                  </td>
                  <td>{new Date(result.completed_at).toLocaleString("uk-UA")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
