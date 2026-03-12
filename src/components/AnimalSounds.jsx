import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { playAnimalSound, ANIMALS } from '../audio';

export default function AnimalSounds({ onBack }) {
  const [playing, setPlaying] = useState(null);
  const [lastSound, setLastSound] = useState('');

  const handleAnimalTap = (animal) => {
    setPlaying(animal.id);
    setLastSound(animal.sound);
    playAnimalSound(animal.id);

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(30);

    setTimeout(() => setPlaying(null), 1500);
  };

  return (
    <div className="animal-game">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>🐾 Animal Sounds</h2>
      </div>

      <AnimatePresence>
        {lastSound && (
          <motion.div
            key={lastSound}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              textAlign: 'center',
              fontSize: '2rem',
              fontWeight: 900,
              padding: '8px',
              color: '#FBBF24',
              textShadow: '0 2px 10px rgba(251, 191, 36, 0.3)',
            }}
          >
            {lastSound}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="animal-grid">
        {ANIMALS.map((animal) => (
          <motion.button
            key={animal.id}
            className={`animal-btn ${playing === animal.id ? 'playing' : ''}`}
            style={{ background: `${animal.color}22`, borderColor: `${animal.color}44` }}
            onClick={() => handleAnimalTap(animal)}
            whileTap={{ scale: 0.85 }}
          >
            <span className="animal-emoji">{animal.emoji}</span>
            <span>{animal.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
