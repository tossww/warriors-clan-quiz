'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useQuizStore } from '@/hooks/useQuizStore';
import { clans } from '@/data/clans';
import { Clan } from '@/types';
import ClanIcon from './ClanIcon';

export default function QuizResults() {
  const { getQuizResult, resetQuiz } = useQuizStore();
  const result = getQuizResult();
  console.log('QuizResults component - result:', result);

  if (!result) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-center">
        <div className="text-red-600 mb-4">
          <h2 className="text-2xl font-bold mb-2">Unable to Calculate Results</h2>
          <p>There was an error calculating your quiz results. Please try taking the quiz again.</p>
        </div>
        <button
          onClick={() => resetQuiz()}
          className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  if (!result.winningClan) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-center">
        <div className="text-red-600 mb-4">
          <h2 className="text-2xl font-bold mb-2">No Winning Clan Found</h2>
          <p>There was an error determining your clan. Please try taking the quiz again.</p>
        </div>
        <button
          onClick={() => resetQuiz()}
          className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  const { winningClan, scores, totalQuestions } = result;
  const percentage = Math.round((scores[winningClan.id] / totalQuestions) * 100);

  const handleRetakeQuiz = () => {
    resetQuiz();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-6 text-center"
    >
      {/* Clan Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-8"
      >
        <div className="mx-auto rounded-full overflow-hidden shadow-2xl border-4 border-white" style={{ width: 160, height: 160 }}>
          <ClanIcon clan={winningClan} size={160} />
        </div>
      </motion.div>

      {/* Result Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          You are {winningClan.name}!
        </h1>
        <p className="text-xl text-gray-600">
          {percentage}% match ({scores[winningClan.id]} out of {totalQuestions} questions)
        </p>
      </motion.div>

      {/* Clan Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8 bg-white rounded-lg p-6 shadow-lg"
      >
        <p className="text-lg text-gray-700 mb-4">{winningClan.description}</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Traits:</h3>
            <ul className="text-gray-600 space-y-1">
              {winningClan.traits.map((trait, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                  {trait}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Characteristics:</h3>
            <ul className="text-gray-600 space-y-1">
              {winningClan.characteristics.map((characteristic, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                  {characteristic}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Score Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8 bg-white rounded-lg p-6 shadow-lg"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Clan Affinities</h3>
        <div className="space-y-3">
          {Object.entries(scores)
            .sort(([, a], [, b]) => b - a)
            .map(([clanId, score]) => {
              const clan = clans.find(c => c.id === clanId);
              if (!clan) return null;
              
              const clanPercentage = Math.round((score / totalQuestions) * 100);
              
              return (
                <div key={clanId} className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: clan.color }}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-800">{clan.name}</span>
                      <span className="text-gray-600">{clanPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: clan.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${clanPercentage}%` }}
                        transition={{ delay: 0.6 + (Object.keys(scores).indexOf(clanId) * 0.1), duration: 0.8 }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={handleRetakeQuiz}
          className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Retake Quiz
        </button>
        
        <button
          onClick={() => {
            // TODO: Implement sharing functionality
            navigator.share?.({
              title: `I'm ${winningClan.name}!`,
              text: `I just took the Warriors Clan Quiz and got ${winningClan.name}! Take the quiz to find your clan.`,
              url: window.location.href
            });
          }}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Share Results
        </button>
      </motion.div>
    </motion.div>
  );
}
