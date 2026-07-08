import { useState } from "react";

export default function Register({
  onRegisterSuccess,
  onCancel,
}: {
  onRegisterSuccess: () => void;
  onCancel: () => void;
}) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [groupName, setGroupName] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("http://localhost/backend-kurswork/public/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login,
        password,
        full_name: fullName,
        role,
        group_name: groupName,
      }),
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") onRegisterSuccess();
        else alert(data.message || "Невірні дані");
      })
      .catch((err) => console.error(`Помилка реєстрації: ${err}`));
  };

  return (
    <div className="container">
      <div
        className="row justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="col-md-4">
          <div className="card p-4 shadow border-0">
            <h3 className="mb-3 text-center fw-bold">Реєстрація у систему</h3>
            <p className="text-muted text-center small mb-4">
              Введіть свої дані для реєстрації нового користувача
            </p>
            <form onSubmit={handleRegister}>
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
              <div className="mb-4">
                <label className="form-label small fw-bold">ПІБ</label>
                <input
                  type="text"
                  className="form-control"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold">Роль</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="role"
                    id="student"
                    value="student"
                    checked={role === "student"}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  />
                  <label htmlFor="student">студент</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="role"
                    id="admin"
                    value="admin"
                    checked={role === "admin"}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  />
                  <label htmlFor="admin">викладач</label>
                </div>
                {role && (
                  <label className="form-label small">
                    Ваша обрана роль: <strong>{role}</strong>
                  </label>
                )}
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold">Назва групи</label>
                <input
                  type="text"
                  className="form-control"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold"
              >
                Зареєструватися
              </button>
              <div className="text-center mt-3 small">
                <span className="text-muted">Вже є акаунт?</span>{" "}
                <a
                  href="#"
                  className="text-decoration-none fw-bold"
                  onClick={(e) => {
                    e.preventDefault();
                    onCancel();
                  }}
                >
                  Увійти
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
