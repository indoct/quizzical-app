export interface IntroProps {
  handleSettingsChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleStart: () => void;
}

export type QuizState = {
  selected_count: boolean;
  game_over: boolean;
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
  selected: string;
}

export interface QAProps {
  key: string;
  qid: string;
  qnum: string;
  selected: string;
  question: string;
  options: string[];
  correct: string;
  handleChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  quizState: QuizState;
  isDarkMode: boolean;
}
