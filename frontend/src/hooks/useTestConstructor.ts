import { useState } from "react";
import type { CreativeTest } from "../types";

export function useTestConstructor(refreshTests: () => void) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTest, setNewTest] = useState<CreativeTest>({
    title: "",
    description: "",
    time_limit: 30,
    is_fullscreen: false,
    disable_copy: false,
    questions: [],
  });

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

    fetch("http://localhost/backend-kurswork/public/api/tests/create", {
      method: "POST",
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
            alert("Тест успішно створено");
            setIsCreating(false);
            setNewTest({
              title: "",
              description: "",
              time_limit: 30,
              is_fullscreen: false,
              disable_copy: false,
              questions: [],
            });
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
      });
    // .then((data) => {
    //   if (data.status === "success") {
    //     alert("Тест успішно створено");
    //     setIsCreating(false);
    //     setNewTest({
    //       title: "",
    //       description: "",
    //       time_limit: 30,
    //       is_fullscreen: false,
    //       disable_copy: false,
    //       questions: [],
    //     });
    //     refreshTests();
    //   } else {
    //     alert(data.message || "Помилка при збереженні тесту");
    //   }
    // })
    // .catch((err) => console.error(`Помилка: ${err}`));
  };

  return {
    isCreating,
    setIsCreating,
    newTest,
    setNewTest,
    handleAddQuestion,
    handleRemoveQuestion,
    handleQuestionChange,
    handleAddAnswer,
    handleRemoveAnswer,
    handleAnswerChange,
    handleSaveTest,
  };
}
