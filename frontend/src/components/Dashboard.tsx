import { useEffect } from "react";
import type { DashboardProps } from "../types";
import { useTestConstructor } from "../hooks/useTestConstructor";
import { useTestPasser } from "../hooks/useTestPasser";
import TestList from "./dashboard/TestList";
import TestPasser from "./dashboard/TestPasser";
import TestConstructor from "./dashboard/TestConstructor";

export default function Dashboard({
  role,
  initialTests: tests,
  refreshTests,
}: DashboardProps) {
  // const refreshTests = () => {
  //   fetch("http://localhost/backend-kurswork/public/api/tests/all", {
  //     credentials: "include",
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error(`Помилка завантаження тестів`);
  //       return res.json();
  //     })
  //     .then((data) => {
  //       if (Array.isArray(data)) {
  //         setTests(data);
  //       } else if (data.status === "success" && Array.isArray(data.tests)) {
  //         setTests(data.tests);
  //       }
  //     })
  //     .catch((err) => console.error(`Помилка при отриманні тестів: ${err}`));
  // };

  useEffect(() => {
    refreshTests();
  }, [refreshTests]);

  const constructor = useTestConstructor(refreshTests);
  const passer = useTestPasser();

  const handleLogout = () => {
    fetch("http://localhost/backend-kurswork/public/api/auth/logout", {
      credentials: "include",
    }).then(() => window.location.reload());
  };

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
        onCancel={() => constructor.setIsCreating(false)}
      />
    );
  }

  if (passer.activeTest) {
    return (
      <TestPasser
        test={passer.activeTest}
        answers={passer.answers}
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
        refreshTests={refreshTests}
      />
    </div>
  );
}
