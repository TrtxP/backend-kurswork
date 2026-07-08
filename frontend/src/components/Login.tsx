import { useState } from "react";

export default function Login({
  onLoginSuccess,
  onNavigateToRegister,
}: {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("http://localhost/backend-kurswork/public/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        if (data.status === "success") onLoginSuccess();
        else alert(data.message || "Невірний логін або пароль");
      })
      .catch((err) => console.error(`Помилка входу: ${err}`));
  };

  return (
    <div className="container">
      <div
        className="row justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="col-md-4">
          <div className="card p-4 shadow border-0">
            <h3 className="mb-3 text-center fw-bold">Вхід у систему</h3>
            <p className="text-muted text-center small mb-4">
              Введіть свої дані для доступу до тестів
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Логін</label>
                <input
                  type="text"
                  className="form-control"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold">Пароль</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold"
              >
                Авторизуватися
              </button>
              <div className="text-center mt-3 small">
                <span className="text-muted">Немає акаунту? </span>
                <a
                  href="#"
                  className="text-decoration-none fw-bold"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToRegister();
                  }}
                >
                  Зареєструватися
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
