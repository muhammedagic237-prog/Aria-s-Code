import React from 'react';
import { motion } from 'framer-motion';

const GAMES = [
  {
    id: 'piano',
    icon: '🎹',
    label: 'Music',
    bg: 'linear-gradient(145deg, #DB2777, #EC4899, #F9A8D4)',
    sparkles: ['🎵', '🎶'],
  },
  {
    id: 'bubbles',
    icon: '🫧',
    label: 'Bubbles',
    bg: 'linear-gradient(145deg, #2563EB, #3B82F6, #93C5FD)',
    sparkles: ['💧', '✨'],
  },
  {
    id: 'counting',
    icon: '🔢',
    label: 'Numbers',
    bg: 'linear-gradient(145deg, #EA580C, #F97316, #FBBF24)',
    sparkles: ['⭐', '🌟'],
  },
  {
    id: 'starpopper',
    icon: '⭐',
    label: 'Stars',
    bg: 'linear-gradient(145deg, #7C3AED, #8B5CF6, #C084FC)',
    sparkles: ['✨', '💫'],
  },
];

export default function GamesHub({ onSelectGame }) {
  return (
    <div className="games-hub">
      <h1>Let's Play! 🎮</h1>

      <div className="games-grid">
        {GAMES.map((game, i) => (
          <motion.button
            key={game.id}
            className="game-card"
            style={{ background: game.bg }}
            onClick={() => onSelectGame(game.id)}
            initial={{ scale: 0, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 180, damping: 14 }}
            whileTap={{ scale: 0.92 }}
          >
            {/* Sparkle decorators */}
            <span className="card-sparkle" style={{ top: '10%', right: '12%' }}>
              {game.sparkles[0]}
            </span>
            <span className="card-sparkle" style={{ bottom: '12%', left: '10%' }}>
              {game.sparkles[1]}
            </span>

            <span className="game-icon">{game.icon}</span>
            <span className="game-label">{game.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
