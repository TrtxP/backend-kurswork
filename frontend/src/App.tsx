import { useState, useEffect } from "react";
import type { AuthCheckResponse, Test } from "./types";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [authState, setAuthState] = useState<AuthCheckResponse>({
    isLoggedIn: false,
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<Test[]>([]);

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

  const checkAuth = () => {
    fetch("http://localhost/backend-kurswork/public/api/auth/check", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <h3>Завантаження системи...</h3>
      </div>
    );

  if (!authState.isLoggedIn) {
    return isRegistering ? (
      <Register
        onRegisterSuccess={() => setIsRegistering(false)}
        onCancel={() => setIsRegistering(false)}
      />
    ) : (
      <Login
        onLoginSuccess={checkAuth}
        onNavigateToRegister={handleNavigateToRegister}
      />
    );
  }

  return (
    <Dashboard
      role={authState.role ?? "student"}
      initialTests={tests}
      refreshTests={loadTests}
    />
  );
}
