export interface RegisterCheckResponse {
    isSignedUp: boolean,
    role?: string
}

export interface AuthCheckResponse {
    isLoggedIn: boolean,
    role?: string
}

export interface User {
    id: number,
    login: string,
    password: string,
    full_name: string,
    role?: string,
    group_name?: string | null,
    created_at: Date
}

export interface Test {
    id: number,
    title: string,
    description: string,
    time_limit: number,
    created_at: Date,
    is_fullscreen: boolean,
    disable_copy: boolean
}

export interface Question {
    id: number,
    test_id: number,
    question_text: string,
    points: number
}

export interface Answer {
    id: number,
    question_id: number,
    answer_text: string,
    is_correct: boolean
}

export interface Result {
    id: number,
    user_id: number,
    test_id: number,
    score: number,
    completed_at: Date
}

export interface QuestionWithAnswers extends Question {
    answers: Answer[]
}

export interface FullTest extends Test {
    questions: QuestionWithAnswers[]
}