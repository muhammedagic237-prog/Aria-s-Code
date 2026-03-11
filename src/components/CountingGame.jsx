import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { playCountTick, playSuccess, COUNT_EMOJIS } from '../audio';

function generateRound() {
  const target = 3 + Math.floor(Math.random() * 5); // 3–7 objects
  const emoji = COUNT_EMOJIS[Math.floor(Math.random() * COUNT_EMOJIS.length)];
  const objects = Array.from({ length: target }, (_, i) => ({
    id: i,
    emoji,
    counted: false,
  }));
  return { target, emoji, objects };
}

export default function CountingGame({ onBack }) {
  const [round, setRound] = useState(() => generateRound());
  const [count, setCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCount = useCallback((objId) => {
    if (round.objects[objId].counted) return;

    const newCount = count + 1;
    setCount(newCount);
    playCountTick(newCount);
    if (navigator.vibrate) navigator.vibrate(20);

    setRound(prev => ({
      ...prev,
      objects: prev.objects.map(o =>
        o.id === objId ? { ...o, counted: true } : o
      ),
    }));

    if (newCount === round.target) {
      setTimeout(() => {
        playSuccess();
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setCount(0);
          setRound(generateRound());
        }, 1800);
      }, 400);
    }
  }, [count, round.target, round.objects]);

  const handleNewRound = () => {
    setCount(0);
    setRound(generateRound());
  };

  return (
    <div className="counting-game">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>🔢 Counting</h2>
      </div>

      <div className="counting-display">
        <motion.div
          className="count-number"
          key={count}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {count}
        </motion.div>
        <div className="count-label">
          Tap the {round.emoji} to count! (Find {round.target})
        </div>
      </div>

      <div className="counting-objects">
        {round.objects.map((obj) => (
          <motion.button
            key={obj.id}
            className={`count-object ${obj.counted ? 'counted' : ''}`}
            onClick={() => handleCount(obj.id)}
            whileTap={{ scale: 0.85 }}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: obj.id * 0.08, type: 'spring' }}
          >
            {obj.emoji}
          </motion.button>
        ))}
      </div>

      <div className="count-controls">
        <button className="count-btn" onClick={handleNewRound}>
          🔄 New Round
        </button>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="success-content">
              <div className="success-emoji">🎉</div>
              <div className="success-text">Great Job!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
