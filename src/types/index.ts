// Core types for Warriors Clan Quiz
export interface Clan {
  id: string;
  name: string;
  traits: string[];
  characteristics: string[];
  color: string;
  icon: string;
  description: string;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  text: string;
  clanId: string; // Maps to clan ID for scoring
}

export interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: { [questionId: string]: string }; // questionId -> answerId
  clanScores: { [clanId: string]: number };
  isComplete: boolean;
  randomizedQuestions: Question[];
  randomizedAnswers: { [questionId: string]: Answer[] }; // Randomized display order
}

export interface ColorTint {
  clanId: string;
  intensity: number; // 0-1, where 1 is maximum tinting
}

export interface QuizResult {
  winningClan: Clan;
  scores: { [clanId: string]: number };
  totalQuestions: number;
}
