import { create } from 'zustand';
import { QuizState, Question, Answer, ColorTint, QuizResult } from '@/types';
import { getRandomQuestions, shuffleAnswers } from '@/data/questions';
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
    // Get 3 random questions from the pool for testing (was 10)
    const selectedQuestions = getRandomQuestions(3);
    
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

    console.log('nextQuestion called - current index:', state.currentQuestionIndex, 'next index:', nextIndex, 'total questions:', state.randomizedQuestions.length);

    if (nextIndex >= state.randomizedQuestions.length) {
      // Ensure all questions have been answered before completing
      const answeredCount = Object.keys(state.selectedAnswers).length;
      const questionCount = state.randomizedQuestions.length;

      console.log(`Quiz completion check - Answered ${answeredCount} out of ${questionCount} questions`);

      if (answeredCount < questionCount) {
        console.warn('Not all questions answered, but reaching end of quiz');
      }

      // Quiz complete
      console.log('Quiz complete! Setting isComplete to true');
      console.log('Final scores:', state.clanScores);
      console.log('Selected answers:', state.selectedAnswers);
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
    // Reset to initial state and immediately reinitialize
    set(initialState);
    // Use setTimeout to ensure state has been reset before reinitializing
    setTimeout(() => {
      get().initializeQuiz();
    }, 0);
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
    console.log('getQuizResult called - state:', {
      isComplete: state.isComplete,
      clanScores: state.clanScores,
      selectedAnswers: state.selectedAnswers,
      randomizedQuestions: state.randomizedQuestions?.length,
      currentQuestionIndex: state.currentQuestionIndex
    });

    if (!state.isComplete) {
      console.log('Quiz not complete yet');
      return null;
    }

    // Ensure we have scores and questions
    if (!state.clanScores || Object.keys(state.clanScores).length === 0) {
      console.error('No clan scores available');
      return null;
    }

    if (!state.randomizedQuestions || state.randomizedQuestions.length === 0) {
      console.error('No questions available');
      return null;
    }

    // Check if all questions have been answered
    const answeredCount = Object.keys(state.selectedAnswers).length;
    const questionCount = state.randomizedQuestions.length;

    console.log(`Answered ${answeredCount} out of ${questionCount} questions`);

    if (answeredCount < questionCount) {
      console.error(`Not all questions answered! Only ${answeredCount} out of ${questionCount} answered`);
      console.log('Selected answers:', state.selectedAnswers);
      console.log('Question IDs:', state.randomizedQuestions.map(q => q.id));
      // Don't return null, continue with partial results
    }

    // Find winning clan
    let maxScore = -1;  // Start with -1 to handle case where all scores are 0
    let winningClanId = '';

    Object.entries(state.clanScores).forEach(([clanId, score]) => {
      if (score > maxScore) {
        maxScore = score;
        winningClanId = clanId;
      }
    });

    // Handle tie-breaker or no answers - pick first clan with max score
    if (winningClanId === '' || maxScore === 0) {
      console.log('No clear winner or all scores are 0, using tie-breaker logic');
      const maxScoreEntries = Object.entries(state.clanScores).filter(([, score]) => score === maxScore);
      if (maxScoreEntries.length > 0) {
        winningClanId = maxScoreEntries[0][0];
      } else {
        // Absolute fallback - use first clan
        winningClanId = Object.keys(state.clanScores)[0] || 'thunderclan';
      }
    }

    console.log('Winning clan ID:', winningClanId, 'with score:', maxScore);
    console.log('All scores:', state.clanScores);

    const winningClan = getClanById(winningClanId);
    if (!winningClan) {
      console.error(`Winning clan not found for ID: ${winningClanId}`);
      // Fallback to first clan if something goes wrong
      const fallbackClan = clans[0];
      if (fallbackClan) {
        console.log('Using fallback clan:', fallbackClan.name);
        return {
          winningClan: fallbackClan,
          scores: state.clanScores,
          totalQuestions: state.randomizedQuestions.length,
        };
      }
      return null;
    }

    return {
      winningClan,
      scores: state.clanScores,
      totalQuestions: state.randomizedQuestions.length,
    };
  },
}));
