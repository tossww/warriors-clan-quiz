'use client';

import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import QuizContainer from '@/components/QuizContainer';

export default function Home() {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  return (
    <>
      {showQuiz ? (
        <QuizContainer />
      ) : (
        <LandingPage onStartQuiz={handleStartQuiz} />
      )}
    </>
  );
}