import { useCallback, useEffect, useRef, useState } from "react";
import type { FullTest, UserAnswersState } from "../types";

export type FullscreenPhase =
  | "idle"        // звичайний стан, тест ще не розпочато
  | "entering"    // анімація входу у fullscreen
  | "active"      // повноекранний режим активний
  | "violated"    // студент вийшов — показуємо попередження
  | "annulled";   // результати анульовані

export function useTestPasser() {
  const [activeTest, setActiveTest] = useState<FullTest | null>(null);
  const [answers, setAnswers] = useState<UserAnswersState>({});
  const [testResult, setTestResult] = useState<{
    score: string;
    correct: number;
    total: number;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [fullscreenPhase, setFullscreenPhase] = useState<FullscreenPhase>("idle");
  const [violationCount, setViolationCount] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeTestRef = useRef<FullTest | null>(null);
  const answersRef = useRef<UserAnswersState>({});
  const hasSubmittedRef = useRef(false);
  const annulTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFullscreenTestRef = useRef(false);   // чи потрібен fullscreen для цього тесту
  const isTestActiveRef = useRef(false);        // чи тест зараз проходиться

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ── Вихід з fullscreen (cleanup) ─────────────────────────────────────────
  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // ── Здача тесту ──────────────────────────────────────────────────────────
  const submitCurrentTest = useCallback(
    (annulled = false) => {
      const test = activeTestRef.current;
      if (!test || hasSubmittedRef.current) return;
      hasSubmittedRef.current = true;
      stopTimer();

      if (annulled) {
        // Не надсилаємо результати — просто скидаємо стан
        exitFullscreen();
        setFullscreenPhase("annulled");
        return;
      }

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
            exitFullscreen();
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
    },
    [stopTimer, exitFullscreen],
  );

  // ── Слухач зміни fullscreen ───────────────────────────────────────────────
  const handleFullscreenChange = useCallback(() => {
    // Якщо тест не активний або не потребує fullscreen — ігноруємо
    if (!isTestActiveRef.current || !isFullscreenTestRef.current) return;

    const isNowFullscreen = !!document.fullscreenElement;

    if (!isNowFullscreen) {
      // Студент вийшов з fullscreen
      if (hasSubmittedRef.current) return; // вже здано — ок

      setViolationCount((prev) => prev + 1);
      setFullscreenPhase("violated");

      // Анулюємо через 1 секунду
      annulTimerRef.current = setTimeout(() => {
        setFullscreenPhase("annulled");
        submitCurrentTest(true);
      }, 1000);
    } else {
      // Повернувся у fullscreen — скасовуємо таймер анулювання
      if (annulTimerRef.current) {
        clearTimeout(annulTimerRef.current);
        annulTimerRef.current = null;
      }
      setFullscreenPhase("active");
    }
  }, [submitCurrentTest]);

  // ── Блокування клавіш виходу з fullscreen ────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isTestActiveRef.current || !isFullscreenTestRef.current) return;
    // Блокуємо Escape (не завжди вдається, але показуємо хоча б попередження)
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
    }
    // F11 — теж блокуємо
    if (e.key === "F11") {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [handleFullscreenChange, handleKeyDown]);

  // ── Таймер ───────────────────────────────────────────────────────────────
  const startTimer = (minutes: number) => {
    stopTimer();
    setTimeLeft(minutes * 60);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev == null ? null : Math.max(prev - 1, 0)));
    }, 1000);
  };

  useEffect(() => stopTimer, [stopTimer]);
  useEffect(() => {
    if (timeLeft === 0) submitCurrentTest(false);
  }, [timeLeft, submitCurrentTest]);

  // ── Запуск тесту ─────────────────────────────────────────────────────────
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
        setViolationCount(0);

        const needsFullscreen = Boolean(Number(data.is_fullscreen));
        isFullscreenTestRef.current = needsFullscreen;
        isTestActiveRef.current = true;

        if (needsFullscreen) {
          // Показуємо анімацію переходу
          setFullscreenPhase("entering");

          // Запитуємо fullscreen через невелику затримку (для анімації)
          setTimeout(() => {
            const el = document.documentElement;
            el.requestFullscreen()
              .then(() => {
                setFullscreenPhase("active");
                startTimer(data.time_limit);
              })
              .catch(() => {
                // Якщо браузер відмовив — стартуємо без fullscreen
                setFullscreenPhase("idle");
                startTimer(data.time_limit);
              });
          }, 800);
        } else {
          setFullscreenPhase("idle");
          startTimer(data.time_limit);
        }
      });
  };

  // ── Відповіді ─────────────────────────────────────────────────────────────
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

  // ── Скасування тесту ─────────────────────────────────────────────────────
  const handleCancelTest = () => {
    stopTimer();
    if (annulTimerRef.current) {
      clearTimeout(annulTimerRef.current);
      annulTimerRef.current = null;
    }
    hasSubmittedRef.current = false;
    isTestActiveRef.current = false;
    isFullscreenTestRef.current = false;
    setActiveTest(null);
    activeTestRef.current = null;
    setAnswers({});
    answersRef.current = {};
    setTestResult(null);
    setTimeLeft(null);
    setFullscreenPhase("idle");
    setViolationCount(0);
    exitFullscreen();
  };

  return {
    activeTest,
    setActiveTest,
    answers,
    setAnswers,
    testResult,
    setTestResult,
    timeLeft,
    fullscreenPhase,
    violationCount,
    handleStartTest,
    handleRadioSelect,
    handleCheckboxSelect,
    handleTextChange,
    handleSubmitTest: () => submitCurrentTest(false),
    handleCancelTest,
  };
}
