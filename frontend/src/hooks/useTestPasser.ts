import { useState } from "react";
import type { FullTest, UserAnswersState } from "../types";

export function useTestPasser() {
  const [activeTest, setActiveTest] = useState<FullTest | null>(null);
  const [answers, setAnswers] = useState<UserAnswersState>({});
  const [testResult, setTestResult] = useState<{
    score: string;
    correct: number;
    total: number;
  } | null>(null);

  const handleStartTest = (id: number) => {
    fetch(`http://localhost/backend-kurswork/public/api/tests/get?id=${id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: FullTest) => {
        setActiveTest(data);
        setAnswers({});
        setTestResult(null);
      });
  };

  const handleRadioSelect = (questionId: number, answerId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { question_id: questionId, selected_id: answerId },
    }));
  };

  const handleCheckboxSelect = (questionId: number, answerId: number) => {
    setAnswers((prev) => {
      const currentSelection: number[] = prev[questionId]?.selected_ids || [];
      const updatedSelection = currentSelection.includes(answerId)
        ? currentSelection.filter((id) => id !== answerId)
        : [...currentSelection, answerId];

      return {
        ...prev,
        [questionId]: {
          question_id: questionId,
          selected_ids: updatedSelection,
        },
      };
    });
  };

  const handleTextChange = (questionId: number, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { question_id: questionId, user_text: text },
    }));
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;

    fetch(
      `http://localhost/backend-kurswork/public/api/tests/submit?id=${activeTest.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: Object.values(answers) }),
        credentials: "include",
      },
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setTestResult({
            score: data.score,
            correct: data.correct,
            total: data.total,
          });
        } else {
          alert(data.message || "Помилка під час збереження результатів");
        }
      });
  };

  const handleCancelTest = () => {
    setActiveTest(null);
    setAnswers({});
    setTestResult(null);
  };

  return {
    activeTest,
    setActiveTest,
    answers,
    setAnswers,
    testResult,
    setTestResult,
    handleStartTest,
    handleRadioSelect,
    handleCheckboxSelect,
    handleTextChange,
    handleSubmitTest,
    handleCancelTest,
  };
}
