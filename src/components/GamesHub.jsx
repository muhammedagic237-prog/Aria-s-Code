import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const GAMES = [
  { id: 'animals', icon: '🐾', label: 'Animals', bg: 'linear-gradient(135deg, #7C3AED, #A855F7)' },
  { id: 'piano', icon: '🎹', label: 'Music', bg: 'linear-gradient(135deg, #EC4899, #F472B6)' },
  { id: 'bubbles', icon: '🫧', label: 'Bubbles', bg: 'linear-gradient(135deg, #3B82F6, #60A5FA)' },
  { id: 'counting', icon: '🔢', label: 'Counting', bg: 'linear-gradient(135deg, #F97316, #FBBF24)' },
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
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
            whileTap={{ scale: 0.93 }}
          >
            <span className="game-icon">{game.icon}</span>
            <span className="game-label">{game.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
