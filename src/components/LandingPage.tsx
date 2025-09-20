'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { clans } from '@/data/clans';
import { generateClanIcon } from '@/utils/iconGeneration';

interface LandingPageProps {
  onStartQuiz: () => void;
}

export default function LandingPage({ onStartQuiz }: LandingPageProps) {
  const [clanIcons, setClanIcons] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Generate icons for all clans
    const loadIcons = async () => {
      const iconPromises = clans.map(async (clan) => {
        try {
          const iconUrl = await generateClanIcon(clan);
          return { [clan.id]: iconUrl };
        } catch (error) {
          console.error(`Failed to load icon for ${clan.name}:`, error);
          // Return SVG fallback
          return { [clan.id]: `data:image/svg+xml;base64,${btoa(`<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="${clan.color}"/><text x="20" y="26" text-anchor="middle" fill="white" font-size="16" font-weight="bold">${clan.name.charAt(0)}</text></svg>`)}` };
        }
      });

      const iconResults = await Promise.all(iconPromises);
      const iconMap = iconResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setClanIcons(iconMap);
    };

    loadIcons();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-amber-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl mx-auto text-center py-8"
      >
        {/* Title */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-4"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-2">
            Warriors Clan Quiz
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-1">
            Discover Your Inner Warrior
          </p>
          <p className="text-xs text-gray-500">
            Based on Erin Hunter&apos;s Warriors book series
          </p>
        </motion.div>

        {/* Clan Symbols */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-4"
        >
          <div className="flex justify-center items-center space-x-3 mb-3">
            {clans.map((clan, index) => (
              <motion.div
                key={clan.name}
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 200 }}
                className="w-10 h-10 rounded-full overflow-hidden shadow-lg border-2 border-white"
                title={clan.name}
              >
                {clanIcons[clan.id] ? (
                  <img
                    src={clanIcons[clan.id]}
                    alt={`${clan.name} icon`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: clan.color }}
                  >
                    {clan.name.charAt(0)}
                  </div>
                )}
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
          className="mb-6 bg-white rounded-lg p-4 shadow-lg"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Which Warrior Cat Clan Do You Belong To?
          </h2>
          <div className="grid md:grid-cols-3 gap-3 text-left text-xs">
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
