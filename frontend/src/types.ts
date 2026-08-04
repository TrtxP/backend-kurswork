export interface RegisterCheckResponse {
  isSignedUp: boolean;
  role?: "admin" | "student";
}

export interface AuthCheckResponse {
  isLoggedIn: boolean;
  role?: "admin" | "student";
}

export interface User {
  id: number;
  login: string;
  password: string;
  full_name: string;
  role: string;
  group_name: string;
  created_at: string;
}

export interface Test {
  id: number;
  title: string;
  description: string;
  time_limit: number;
  created_at: Date;
  is_fullscreen: boolean;
  disable_copy: boolean;
}

export interface Question {
  id: number;
  test_id: number;
  question_text: string;
  points: number;
  type: "radio" | "text" | "checkbox";
  image_url: string | null;
}

export interface Answer {
  id: number;
  question_id: number;
  answer_text: string;
  is_correct?: boolean;
}

export interface Result {
  id: number;
  user_id: number;
  test_id: number;
  score: number;
  completed_at: Date;
}

export interface QuestionWithAnswers extends Question {
  answers: Answer[];
}

export interface FullTest extends Test {
  questions: QuestionWithAnswers[];
}

export interface DashboardProps {
  role: "admin" | "student";
  initialTests: Test[];
  refreshTests: () => void;
}

// Інтерфейси для стейту відповідей
export interface UserAnswerItem {
  question_id: number;
  selected_id?: number | null;
  selected_ids?: number[] | null;
  user_text?: string;
}
export interface UserAnswersState {
  [questionId: number]: UserAnswerItem;
}

export type CreativeQuestion = Omit<Question, "id" | "test_id"> & {
  answers: Omit<Answer, "id" | "question_id">[];
};

export type CreativeTest = Omit<Test, "id" | "created_at"> & {
  questions: CreativeQuestion[];
};

export interface TestListProps {
  role: string;
  tests: Test[];
  onStart: (id: number) => void;
  onEdit: (id: number) => void;
  refreshTests: () => void;
}

export interface TestPasserProps {
  test: FullTest;
  answers: UserAnswersState;
  timeLeft: number | null;
  fullscreenPhase: import("./hooks/useTestPasser").FullscreenPhase;
  violationCount: number;
  testResult: {
    score: string;
    correct: number;
    total: number;
  } | null;
  onRadioSelect: (questionId: number, answerId: number) => void;
  onCheckboxSelect: (questionId: number, answerId: number) => void;
  onTextChange: (questionId: number, text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export interface TestConstructorProps {
  newTest: CreativeTest;
  setNewTest: React.Dispatch<React.SetStateAction<CreativeTest>>;
  onAddQuestion: () => void;
  onRemoveQuestion: (qIdx: number) => void;
  onQuestionChange: (qIdx: number, field: "question_text" | "points" | "type" | "image_url", value: string | number | null) => void;
  onAddAnswer: (qIdx: number) => void;
  onRemoveAnswer: (qIdx: number, aIdx: number) => void;
  onAnswerChange: (qIdx: number, aIdx: number, field: "answer_text" | "is_correct", value: string | boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}
