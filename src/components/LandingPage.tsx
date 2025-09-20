'use client';

import { motion } from 'framer-motion';

interface LandingPageProps {
  onStartQuiz: () => void;
}

export default function LandingPage({ onStartQuiz }: LandingPageProps) {
  return (
    <div className="h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-amber-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl mx-auto text-center"
      >
        {/* Title */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-2">
            Warriors Clan Quiz
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-1">
            Discover Your Inner Warrior
          </p>
          <p className="text-sm text-gray-500">
            Based on Erin Hunter's Warriors book series
          </p>
        </motion.div>

        {/* Clan Symbols */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-6"
        >
          <div className="flex justify-center items-center space-x-3 mb-3">
            {[
              { name: 'ThunderClan', color: '#059669', icon: '⚡' },
              { name: 'RiverClan', color: '#0284C7', icon: '🌊' },
              { name: 'WindClan', color: '#EAB308', icon: '💨' },
              { name: 'ShadowClan', color: '#7C3AED', icon: '🌙' },
              { name: 'SkyClan', color: '#DC2626', icon: '🍃' },
              { name: 'Tribe', color: '#475569', icon: '⛰️' }
            ].map((clan, index) => (
              <motion.div
                key={clan.name}
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 200 }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-lg"
                style={{ backgroundColor: clan.color }}
                title={clan.name}
              >
                {clan.icon}
              </motion.div>
            ))}
          </div>
          <p className="text-gray-600 text-sm">Six clans await your discovery</p>
        </motion.div>

        {/* Compact Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8 bg-white rounded-lg p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Which Warrior Cat Clan Do You Belong To?
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-left text-sm">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Discover:</h3>
              <ul className="text-gray-600 space-y-1">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2"></span>
                  Your clan identity
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2"></span>
                  Personality traits
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Features:</h3>
              <ul className="text-gray-600 space-y-1">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2"></span>
                  10 unique questions
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2"></span>
                  Visual feedback
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Experience:</h3>
              <ul className="text-gray-600 space-y-1">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2"></span>
                  Color-changing background
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2"></span>
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
          className="mb-4"
        >
          <button
            onClick={onStartQuiz}
            className="px-10 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-lg font-bold rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            Begin Your Journey
          </button>
        </motion.div>

        {/* Compact Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-gray-500 text-xs"
        >
          <p>Inspired by the Warriors series by Erin Hunter • Watch your background change as you answer!</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
