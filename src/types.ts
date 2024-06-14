export interface QuizError extends Error {
  title: string;
  message: string;
  response_code: number;
}

export type QuizState = {
  selected_count: boolean;
  active: boolean;
};

export type Settings = {
  difficulty: string;
  category: string;
};

export interface Questions {
  id: string;
  question: string;
  correct: string;
  incorrect: string[];
  options: string[];
  category: string;
  selected: string;
}

export interface QABlockProps {
  data: Questions[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  quizState: QuizState;
}

export interface SingleQuestion {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}
