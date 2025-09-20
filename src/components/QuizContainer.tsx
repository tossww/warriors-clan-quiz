'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/hooks/useQuizStore';
import BackgroundTint from './BackgroundTint';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';

export default function QuizContainer() {
  const { initializeQuiz, isComplete, randomizedQuestions } = useQuizStore();

  useEffect(() => {
    initializeQuiz();
  }, [initializeQuiz]);

  if (randomizedQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your Warriors Clan Quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackgroundTint />
      <div className="min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {isComplete ? (
            <QuizResults key="results" />
          ) : (
            <QuizQuestion key="question" />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
