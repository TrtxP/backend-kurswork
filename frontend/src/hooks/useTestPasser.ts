import { useEffect, useRef, useState } from "react";
import type { FullTest, UserAnswersState } from "../types";

export function useTestPasser() {
  const [activeTest, setActiveTest] = useState<FullTest | null>(null);
  const [answers, setAnswers] = useState<UserAnswersState>({});
  const [testResult, setTestResult] = useState<{
    score: string;
    correct: number;
    total: number;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const internalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleStartTest = (id: number) => {
    fetch(`http://localhost/backend-kurswork/public/api/tests/get?id=${id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: FullTest) => {
        setActiveTest(data);
        startTimer(data.time_limit)
        setAnswers({});
        setTestResult(null);
      });
  };

  const startTimer = (minutes: number) => {
    stopTimer();
    setTimeLeft(minutes * 60);

    internalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev == null) return null;

        if (prev <= 1) {
          stopTimer();
          handleSubmitTest();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (internalRef.current) {
      clearInterval(internalRef.current);
      internalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (internalRef.current) {
        clearInterval(internalRef.current);
      }
    };
  }, []);

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
    setTimeLeft(null);
    stopTimer();
  };

  return {
    activeTest,
    setActiveTest,
    answers,
    setAnswers,
    testResult,
    setTestResult,
    timeLeft,
    handleStartTest,
    handleRadioSelect,
    handleCheckboxSelect,
    handleTextChange,
    handleSubmitTest,
    handleCancelTest,
  };
}
