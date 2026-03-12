import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { playCountTick, playSuccess, speakNumber, COUNT_EMOJIS } from '../audio';

// BUBBLE_COLORS matches the app's palette
import { BUBBLE_COLORS } from '../audio';

export default function NumberGridGame({ onBack }) {
  const [activeNumber, setActiveNumber] = useState(null);

  // Numbers 1 through 10
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

  const handleNumberTap = (num) => {
    setActiveNumber(num);
    speakNumber(num);
    
    // Add success sound for a little fun feedback
    setTimeout(() => playSuccess(), 200);

    if (navigator.vibrate) navigator.vibrate(30);

    setTimeout(() => setActiveNumber(null), 800);
  };

  return (
    <div className="counting-game">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>🔢 Numbers</h2>
      </div>

      {/* Grid of numbers 1-10 */}
      <div className="number-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '15px', 
          padding: '20px', 
          height: '100%', 
          alignContent: 'center' 
      }}>
        {numbers.map((num, i) => {
          const colorObj = BUBBLE_COLORS[i % BUBBLE_COLORS.length];
          return (
            <motion.button
              key={num}
              onClick={() => handleNumberTap(num)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.8 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: `linear-gradient(135deg, ${colorObj.color}, ${colorObj.color}dd)`,
                borderRadius: '24px',
                border: 'none',
                boxShadow: `0 8px 0 ${colorObj.color}88, 0 15px 20px rgba(0,0,0,0.1)`,
                color: 'white',
                fontSize: '3rem',
                fontWeight: 900,
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                transform: activeNumber === num ? 'translateY(4px)' : 'none'
              }}
            >
              {num}
              <AnimatePresence>
                {activeNumber === num && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 1, y: 0 }}
                    animate={{ scale: 2, opacity: 0, y: -50 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute',
                      fontSize: '2rem',
                    }}
                  >
                    ✨
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
    </div>
  );
}
