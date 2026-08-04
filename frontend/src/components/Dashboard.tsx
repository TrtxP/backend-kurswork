import { useEffect, useState } from "react";
import type { DashboardProps, User } from "../types";
import { useTestConstructor } from "../hooks/useTestConstructor";
import { useTestPasser } from "../hooks/useTestPasser";
import TestList from "./dashboard/TestList";
import TestPasser from "./dashboard/TestPasser";
import TestConstructor from "./dashboard/TestConstructor";
import UserProfile from "./dashboard/UserProfile";
import Messenger from "./dashboard/Messenger";

export default function Dashboard({
  role,
  full_name,
  initialTests: tests,
  refreshTests,
}: DashboardProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [showMessenger, setShowMessenger] = useState(false);
  
  // Ми створюємо об'єкт currentUser з доступних пропсів (оскільки повний об'єкт тут відсутній, 
  // але ID ми знаємо на бекенді через сесію. Для Messenger нам треба знати хоча б id поточного користувача. 
  // В App.tsx ми його не отримуємо з AuthCheckResponse. 
  // Тому для підключення до WebSockets ми можемо звернутися до /api/profile або використовувати ID з іншого джерела.
  // Але оскільки в Messenger.tsx є props currentUser, краще отримувати currentUser всередині Messenger, 
  // або в Dashboard). Оновимо це зараз.
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    refreshTests();
    // Отримуємо профіль для отримання власного ID
    fetch("http://localhost/backend-kurswork/public/api/profile", { credentials: "include" })
      .then(res => res.json())
      .then(data => setCurrentUser(data))
      .catch(() => {});
  }, [refreshTests]);

  const constructor = useTestConstructor(refreshTests);
  const passer = useTestPasser();

  const handleLogout = () => {
    fetch("http://localhost/backend-kurswork/public/api/auth/logout", {
      credentials: "include",
    }).then(() => window.location.reload());
  };

  if (showProfile) {
    return <UserProfile onClose={() => setShowProfile(false)} />;
  }

  if (showMessenger) {
    return <Messenger onClose={() => setShowMessenger(false)} currentUser={currentUser} />;
  }

  if (constructor.isCreating) {
    return (
      <TestConstructor
        newTest={constructor.newTest}
        setNewTest={constructor.setNewTest}
        onAddQuestion={constructor.handleAddQuestion}
        onRemoveQuestion={constructor.handleRemoveQuestion}
        onQuestionChange={constructor.handleQuestionChange}
        onAddAnswer={constructor.handleAddAnswer}
        onRemoveAnswer={constructor.handleRemoveAnswer}
        onAnswerChange={constructor.handleAnswerChange}
        onSave={constructor.handleSaveTest}
        onCancel={constructor.handleCancel}
      />
    );
  }

  if (passer.activeTest) {
    return (
      <TestPasser
        test={passer.activeTest}
        answers={passer.answers}
        timeLeft={passer.timeLeft}
        fullscreenPhase={passer.fullscreenPhase}
        violationCount={passer.violationCount}
        testResult={passer.testResult}
        onRadioSelect={passer.handleRadioSelect}
        onCheckboxSelect={passer.handleCheckboxSelect}
        onTextChange={passer.handleTextChange}
        onSubmit={passer.handleSubmitTest}
        onCancel={passer.handleCancelTest}
      />
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2">Освітня платформа</h1>
          <p className="text-muted mb-2">
            {role === "admin" ? "Викладач: " : "Студент: "}
            {full_name || "Невідомо"}
          </p>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-info btn-sm"
              onClick={() => setShowProfile(true)}
            >
              Переглянути профіль
            </button>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowMessenger(true)}
            >
              Повідомлення
            </button>
          </div>
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
            onClick={() => constructor.setIsCreating(true)}
          >
            Створити новий тест
          </button>
        </div>
      )}

      <TestList
        role={role}
        tests={tests}
        onStart={passer.handleStartTest}
        onEdit={constructor.handleEditTest}
        refreshTests={refreshTests}
      />
    </div>
  );
}
