'use client';

import { useState } from 'react';
import { clans } from '@/data/clans';
import ClanIcon from '@/components/ClanIcon';
import { motion } from 'framer-motion';

export default function IconsPage() {
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  const handleRegenerateAll = async () => {
    // Clear all cached icons
    clans.forEach(clan => {
      localStorage.removeItem(`clan-icon-${clan.id}`);
    });

    // Force reload the page to regenerate all icons
    window.location.reload();
  };

  const handleRegenerateSingle = (clanId: string) => {
    // Clear cached icon for this clan
    localStorage.removeItem(`clan-icon-${clanId}`);

    // Set regenerating state to trigger re-render
    setRegeneratingId(clanId);
    setTimeout(() => {
      setRegeneratingId(null);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Warriors Clan Icons</h1>
          <p className="text-gray-600 mb-6">
            Custom icons generated with Nano Banana based on each clan's unique attributes
          </p>

          <button
            onClick={handleRegenerateAll}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Regenerate All Icons
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clans.map((clan, index) => (
            <motion.div
              key={clan.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  {regeneratingId === clan.id ? (
                    <div className="w-40 h-40 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                    </div>
                  ) : (
                    <ClanIcon clan={clan} size={160} />
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">{clan.name}</h2>

                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: clan.color }}
                  />
                  <span className="text-sm text-gray-600">{clan.color}</span>
                </div>

                <div className="text-sm text-gray-600 text-center mb-4">
                  <p className="font-semibold mb-1">Traits:</p>
                  <p>{clan.traits.join(', ')}</p>
                </div>

                <button
                  onClick={() => handleRegenerateSingle(clan.id)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Regenerate Icon
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-gray-600"
        >
          <p className="mb-2">Icons are generated using Nano Banana AI based on each clan's:</p>
          <ul className="inline-block text-left">
            <li>• Unique traits and characteristics</li>
            <li>• Color scheme and symbolism</li>
            <li>• Environmental habitat</li>
            <li>• Warrior culture and values</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}