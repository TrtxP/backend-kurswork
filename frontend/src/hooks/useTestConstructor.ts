import { useState } from "react";
import type { CreativeTest } from "../types";

const EMPTY_TEST: CreativeTest = {
  title: "",
  description: "",
  time_limit: 30,
  is_fullscreen: false,
  disable_copy: false,
  questions: [],
};

export function useTestConstructor(refreshTests: () => void) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingTestId, setEditingTestId] = useState<number | null>(null);
  const [newTest, setNewTest] = useState<CreativeTest>(EMPTY_TEST);

  // Відкриває конструктор для редагування існуючого тесту
  const handleEditTest = async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost/backend-kurswork/public/api/tests/get?id=${id}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Не вдалося завантажити тест");
      const data = await res.json();

      setNewTest({
        title: data.title,
        description: data.description,
        time_limit: Number(data.time_limit),
        is_fullscreen: Boolean(Number(data.is_fullscreen)),
        disable_copy: Boolean(Number(data.disable_copy)),
        questions: (data.questions ?? []).map((q: any) => ({
          question_text: q.question_text,
          points: Number(q.points),
          type: q.type,
          image_url: q.image_url ?? null,
          answers: (q.answers ?? []).map((a: any) => ({
            answer_text: a.answer_text,
            is_correct: Boolean(Number(a.is_correct)),
          })),
        })),
      });

      setEditingTestId(id);
      setIsCreating(true);
    } catch (err) {
      alert("Помилка при завантаженні тесту для редагування");
      console.error(err);
    }
  };

  const handleAddQuestion = () => {
    setNewTest((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question_text: "",
          points: 1,
          type: "radio",
          image_url: "",
          answers: [{ answer_text: "", is_correct: false }],
        },
      ],
    }));
  };

  const handleRemoveQuestion = (qIdx: number) => {
    setNewTest((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, idx) => idx !== qIdx),
    }));
  };

  const handleQuestionChange = (
    qIdx: number,
    field: "question_text" | "points" | "type" | "image_url",
    value: string | number | null,
  ) => {
    setNewTest((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIdx] = { ...updatedQuestions[qIdx], [field]: value };

      if (field === "type" && value === "text") {
        updatedQuestions[qIdx].answers = [
          { answer_text: "", is_correct: true },
        ];
      }
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleAddAnswer = (qIdx: number) => {
    setNewTest((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIdx].answers.push({
        answer_text: "",
        is_correct: false,
      });
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleRemoveAnswer = (qIdx: number, aIdx: number) => {
    setNewTest((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIdx].answers = updatedQuestions[qIdx].answers.filter(
        (_, idx) => idx !== aIdx,
      );
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleAnswerChange = (
    qIdx: number,
    aIdx: number,
    field: "answer_text" | "is_correct",
    value: string | boolean,
  ) => {
    setNewTest((prev) => {
      const updatedQuestions = [...prev.questions];
      const answers = [...updatedQuestions[qIdx].answers];

      if (field === "is_correct" && updatedQuestions[qIdx].type === "radio") {
        answers.forEach((ans, idx) => {
          ans.is_correct = idx === aIdx;
        });
      } else {
        answers[aIdx] = { ...answers[aIdx], [field]: value };
      }

      updatedQuestions[qIdx].answers = answers;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleSaveTest = () => {
    if (!newTest.title.trim()) {
      alert("Будь ласка, введіть назву тесту");
      return;
    }
    if (newTest.questions.length === 0) {
      alert("Додайте хоча б одне запитання");
      return;
    }

    // Якщо редагуємо існуючий тест — PATCH, якщо новий — POST
    const isEditing = editingTestId !== null;
    const url = isEditing
      ? `http://localhost/backend-kurswork/public/api/tests/update?id=${editingTestId}`
      : "http://localhost/backend-kurswork/public/api/tests/create";
    const method = isEditing ? "PATCH" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newTest),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        }
        return res.text();
      })
      .then((text) => {
        try {
          const data = JSON.parse(text);
          if (data.status === "success") {
            alert(isEditing ? "Тест успішно оновлено" : "Тест успішно створено");
            setIsCreating(false);
            setEditingTestId(null);
            setNewTest(EMPTY_TEST);
            refreshTests();
          } else {
            alert(data.message);
          }
        } catch (err) {
          console.error(
            "Бекенд повернув не JSON! Ось що він повернув:\n",
            text, err
          );
        }
      })
      .catch((err) => console.error(`Помилка: ${err}`));
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingTestId(null);
    setNewTest(EMPTY_TEST);
  };

  return {
    isCreating,
    setIsCreating,
    editingTestId,
    newTest,
    setNewTest,
    handleEditTest,
    handleAddQuestion,
    handleRemoveQuestion,
    handleQuestionChange,
    handleAddAnswer,
    handleRemoveAnswer,
    handleAnswerChange,
    handleSaveTest,
    handleCancel,
  };
}
