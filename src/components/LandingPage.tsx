'use client';

import { motion } from 'framer-motion';

interface LandingPageProps {
  onStartQuiz: () => void;
}

export default function LandingPage({ onStartQuiz }: LandingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-amber-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl mx-auto text-center"
      >
        {/* Title */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-4">
            Warriors Clan Quiz
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-2">
            Discover Your Inner Warrior
          </p>
          <p className="text-lg text-gray-500">
            Based on Erin Hunter's Warriors book series
          </p>
        </motion.div>

        {/* Clan Symbols */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex justify-center items-center space-x-4 mb-6">
            {[
              { name: 'ThunderClan', color: '#2D5016' },
              { name: 'RiverClan', color: '#1E3A8A' },
              { name: 'WindClan', color: '#B45309' },
              { name: 'ShadowClan', color: '#4C1D95' },
              { name: 'SkyClan', color: '#EA580C' },
              { name: 'Tribe', color: '#64748B' }
            ].map((clan, index) => (
              <motion.div
                key={clan.name}
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 200 }}
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                style={{ backgroundColor: clan.color }}
                title={clan.name}
              >
                {clan.name.charAt(0)}
              </motion.div>
            ))}
          </div>
          <p className="text-gray-600">Six clans await your discovery</p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12 bg-white rounded-lg p-8 shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Which Warrior Cat Clan Do You Belong To?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">What You'll Discover:</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-3"></span>
                  Your warrior clan identity
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-3"></span>
                  Personality traits and strengths
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-3"></span>
                  Detailed clan characteristics
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">How It Works:</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-3"></span>
                  10 personality-based questions
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-3"></span>
                  Progressive visual feedback
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-3"></span>
                  Shareable results
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <button
            onClick={onStartQuiz}
            className="px-12 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xl font-bold rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            Begin Your Journey
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-gray-500 text-sm"
        >
          <p>
            Inspired by the Warriors series by Erin Hunter
          </p>
          <p className="mt-2">
            Watch as your background subtly changes color based on your answers!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
