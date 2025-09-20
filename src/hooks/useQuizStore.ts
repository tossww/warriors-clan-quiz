import { create } from 'zustand';
import { QuizState, Question, Answer, ColorTint, QuizResult } from '@/types';
import { questions, getRandomQuestions, shuffleAnswers } from '@/data/questions';
import { clans, getClanById } from '@/data/clans';

interface QuizStore extends QuizState {
  // Actions
  initializeQuiz: () => void;
  selectAnswer: (questionId: string, answerId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  resetQuiz: () => void;
  
  // Computed values
  getCurrentQuestion: () => Question | null;
  getCurrentAnswers: () => Answer[];
  getProgressPercentage: () => number;
  getCurrentColorTint: () => ColorTint | null;
  getQuizResult: () => QuizResult | null;
}

const initialState: QuizState = {
  currentQuestionIndex: 0,
  selectedAnswers: {},
  clanScores: {},
  isComplete: false,
  randomizedQuestions: [],
  randomizedAnswers: {},
};

export const useQuizStore = create<QuizStore>((set, get) => ({
  ...initialState,

  initializeQuiz: () => {
    // Get 10 random questions from the pool of 11
    const selectedQuestions = getRandomQuestions(10);
    
    // Initialize clan scores
    const clanScores: { [clanId: string]: number } = {};
    clans.forEach(clan => {
      clanScores[clan.id] = 0;
    });

    // Randomize answer order for each question
    const randomizedAnswers: { [questionId: string]: Answer[] } = {};
    selectedQuestions.forEach(question => {
      randomizedAnswers[question.id] = shuffleAnswers(question.answers);
    });

    set({
      currentQuestionIndex: 0,
      selectedAnswers: {},
      clanScores,
      isComplete: false,
      randomizedQuestions: selectedQuestions,
      randomizedAnswers,
    });
  },

  selectAnswer: (questionId: string, answerId: string) => {
    const state = get();
    const question = state.randomizedQuestions.find(q => q.id === questionId);
    if (!question) return;

    // Find the original answer (not the randomized display order)
    const answer = question.answers.find(a => a.id === answerId);
    if (!answer) return;

    // Update selected answers
    const newSelectedAnswers = {
      ...state.selectedAnswers,
      [questionId]: answerId,
    };

    // Update clan scores
    const newClanScores = { ...state.clanScores };
    
    // Remove previous score if answer was changed
    const previousAnswerId = state.selectedAnswers[questionId];
    if (previousAnswerId) {
      const previousAnswer = question.answers.find(a => a.id === previousAnswerId);
      if (previousAnswer) {
        newClanScores[previousAnswer.clanId] = Math.max(0, newClanScores[previousAnswer.clanId] - 1);
      }
    }

    // Add new score
    newClanScores[answer.clanId] += 1;

    set({
      selectedAnswers: newSelectedAnswers,
      clanScores: newClanScores,
    });
  },

  nextQuestion: () => {
    const state = get();
    const nextIndex = state.currentQuestionIndex + 1;
    
    if (nextIndex >= state.randomizedQuestions.length) {
      // Quiz complete
      set({ isComplete: true });
    } else {
      set({ currentQuestionIndex: nextIndex });
    }
  },

  previousQuestion: () => {
    const state = get();
    if (state.currentQuestionIndex > 0) {
      set({ currentQuestionIndex: state.currentQuestionIndex - 1 });
    }
  },

  resetQuiz: () => {
    set(initialState);
  },

  getCurrentQuestion: () => {
    const state = get();
    return state.randomizedQuestions[state.currentQuestionIndex] || null;
  },

  getCurrentAnswers: () => {
    const state = get();
    const currentQuestion = state.randomizedQuestions[state.currentQuestionIndex];
    if (!currentQuestion) return [];
    
    return state.randomizedAnswers[currentQuestion.id] || [];
  },

  getProgressPercentage: () => {
    const state = get();
    if (state.randomizedQuestions.length === 0) return 0;
    return Math.round(((state.currentQuestionIndex + 1) / state.randomizedQuestions.length) * 100);
  },

  getCurrentColorTint: () => {
    const state = get();
    const totalAnswered = Object.keys(state.selectedAnswers).length;
    
    if (totalAnswered === 0) return null;

    // Find the clan with the highest score
    let maxScore = 0;
    let leadingClanId = '';
    
    Object.entries(state.clanScores).forEach(([clanId, score]) => {
      if (score > maxScore) {
        maxScore = score;
        leadingClanId = clanId;
      }
    });

    if (maxScore === 0) return null;

    // Calculate intensity based on lead and total questions answered
    const secondHighest = Math.max(...Object.values(state.clanScores).filter(score => score !== maxScore));
    const lead = maxScore - secondHighest;
    const maxPossibleLead = totalAnswered;
    
    // Intensity ranges from 0.1 (10%) to 0.25 (25%) based on confidence
    const baseIntensity = 0.1;
    const maxIntensity = 0.25;
    const intensity = baseIntensity + (lead / maxPossibleLead) * (maxIntensity - baseIntensity);

    return {
      clanId: leadingClanId,
      intensity: Math.min(intensity, maxIntensity),
    };
  },

  getQuizResult: () => {
    const state = get();
    if (!state.isComplete) return null;

    // Find winning clan
    let maxScore = 0;
    let winningClanId = '';
    
    Object.entries(state.clanScores).forEach(([clanId, score]) => {
      if (score > maxScore) {
        maxScore = score;
        winningClanId = clanId;
      }
    });

    const winningClan = getClanById(winningClanId);
    if (!winningClan) return null;

    return {
      winningClan,
      scores: state.clanScores,
      totalQuestions: state.randomizedQuestions.length,
    };
  },
}));
