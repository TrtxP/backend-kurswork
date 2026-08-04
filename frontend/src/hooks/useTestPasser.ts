import { useCallback, useEffect, useRef, useState } from "react";
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

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeTestRef = useRef<FullTest | null>(null);
  const answersRef = useRef<UserAnswersState>({});
  const hasSubmittedRef = useRef(false);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const submitCurrentTest = useCallback(() => {
    const test = activeTestRef.current;

    if (!test || hasSubmittedRef.current) return;

    hasSubmittedRef.current = true;
    stopTimer();

    fetch(
      `http://localhost/backend-kurswork/public/api/tests/submit?id=${test.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: Object.values(answersRef.current) }),
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
          return;
        }

        hasSubmittedRef.current = false;
        alert(data.message || "Помилка під час збереження результатів");
      })
      .catch(() => {
        hasSubmittedRef.current = false;
        alert("Не вдалося зберегти результати. Спробуйте здати тест ще раз.");
      });
  }, [stopTimer]);

  const startTimer = (minutes: number) => {
    stopTimer();
    setTimeLeft(minutes * 60);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev == null ? null : Math.max(prev - 1, 0)));
    }, 1000);
  };

  const handleStartTest = (id: number) => {
    fetch(`http://localhost/backend-kurswork/public/api/tests/get?id=${id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: FullTest) => {
        hasSubmittedRef.current = false;
        setActiveTest(data);
        activeTestRef.current = data;
        setAnswers({});
        answersRef.current = {};
        setTestResult(null);
        startTimer(data.time_limit);
      });
  };

  useEffect(() => stopTimer, [stopTimer]);

  useEffect(() => {
    if (timeLeft === 0) submitCurrentTest();
  }, [timeLeft, submitCurrentTest]);

  const handleRadioSelect = (questionId: number, answerId: number) => {
    setAnswers((prev) => {
      const next = {
        ...prev,
        [questionId]: { question_id: questionId, selected_id: answerId },
      };
      answersRef.current = next;
      return next;
    });
  };

  const handleCheckboxSelect = (questionId: number, answerId: number) => {
    setAnswers((prev) => {
      const currentSelection = prev[questionId]?.selected_ids || [];
      const selectedIds = currentSelection.includes(answerId)
        ? currentSelection.filter((id) => id !== answerId)
        : [...currentSelection, answerId];
      const next = {
        ...prev,
        [questionId]: { question_id: questionId, selected_ids: selectedIds },
      };
      answersRef.current = next;
      return next;
    });
  };

  const handleTextChange = (questionId: number, text: string) => {
    setAnswers((prev) => {
      const next = {
        ...prev,
        [questionId]: { question_id: questionId, user_text: text },
      };
      answersRef.current = next;
      return next;
    });
  };

  const handleCancelTest = () => {
    stopTimer();
    hasSubmittedRef.current = false;
    setActiveTest(null);
    activeTestRef.current = null;
    setAnswers({});
    answersRef.current = {};
    setTestResult(null);
    setTimeLeft(null);
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
    handleSubmitTest: submitCurrentTest,
    handleCancelTest,
  };
}
