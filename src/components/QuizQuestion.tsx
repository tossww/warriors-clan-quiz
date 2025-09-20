'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/hooks/useQuizStore';

export default function QuizQuestion() {
  const {
    getCurrentQuestion,
    getCurrentAnswers,
    selectedAnswers,
    selectAnswer,
    nextQuestion,
    getProgressPercentage,
  } = useQuizStore();

  const currentQuestion = getCurrentQuestion();
  const currentAnswers = getCurrentAnswers();
  const progress = getProgressPercentage();

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  const selectedAnswerId = selectedAnswers[currentQuestion.id];
  const canProceed = !!selectedAnswerId;

  const handleAnswerSelect = (answerId: string) => {
    selectAnswer(currentQuestion.id, answerId);
  };

  const handleNext = () => {
    if (canProceed) {
      nextQuestion();
    }
  };

  return (
    <motion.div
      key={currentQuestion.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto p-6"
    >
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          {currentQuestion.text}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="grid gap-4 mb-8">
        {currentAnswers.map((answer, index) => (
          <motion.button
            key={answer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleAnswerSelect(answer.id)}
            className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md ${
              selectedAnswerId === answer.id
                ? 'border-amber-500 bg-amber-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 ${
                  selectedAnswerId === answer.id
                    ? 'border-amber-500 bg-amber-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedAnswerId === answer.id && (
                  <div className="w-full h-full rounded-full bg-white scale-50" />
                )}
              </div>
              <span className="text-gray-800 font-medium">{answer.text}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Next Button */}
      <div className="flex justify-center">
        <motion.button
          onClick={handleNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
            canProceed
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={canProceed ? { scale: 1.05 } : {}}
          whileTap={canProceed ? { scale: 0.95 } : {}}
        >
          Next Question
        </motion.button>
      </div>
    </motion.div>
  );
}
