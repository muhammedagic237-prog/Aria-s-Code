import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { playPop, playSuccess, BUBBLE_COLORS } from '../audio';

function createBubble(id) {
  const colorData = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
  const size = 50 + Math.random() * 40;
  return {
    id,
    x: 10 + Math.random() * 70, // % from left
    size,
    color: colorData.color,
    emoji: colorData.emoji,
    popping: false,
    createdAt: Date.now(),
  };
}

export default function ColorBubbles({ onBack }) {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const nextId = useRef(0);
  const intervalRef = useRef(null);

  const spawnBubble = useCallback(() => {
    setBubbles(prev => {
      // Cap at 12 bubbles on screen
      const active = prev.filter(b => !b.popping && Date.now() - b.createdAt < 6000);
      if (active.length >= 12) return prev;
      return [...prev, createBubble(nextId.current++)];
    });
  }, []);

  useEffect(() => {
    // Spawn bubbles every 800ms
    intervalRef.current = setInterval(spawnBubble, 800);
    // Initial burst
    for (let i = 0; i < 5; i++) {
      setTimeout(spawnBubble, i * 200);
    }
    return () => clearInterval(intervalRef.current);
  }, [spawnBubble]);

  // Clean up old bubbles
  useEffect(() => {
    const cleanup = setInterval(() => {
      setBubbles(prev => prev.filter(b => Date.now() - b.createdAt < 7000));
    }, 2000);
    return () => clearInterval(cleanup);
  }, []);

  const popBubble = (bubbleId) => {
    setBubbles(prev => prev.map(b =>
      b.id === bubbleId ? { ...b, popping: true } : b
    ));
    playPop();
    if (navigator.vibrate) navigator.vibrate(20);

    const newScore = score + 1;
    setScore(newScore);

    // Every 10 pops, play success
    if (newScore % 10 === 0) {
      setTimeout(playSuccess, 200);
    }

    // Remove after animation
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== bubbleId));
    }, 300);
  };

  return (
    <div className="bubbles-game">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>🫧 Bubbles</h2>
      </div>

      <div className="bubbles-area">
        <div className="bubbles-score">🎯 {score}</div>

        <AnimatePresence>
          {bubbles.map(bubble => (
            <motion.div
              key={bubble.id}
              className={`bubble ${bubble.popping ? 'popping' : ''}`}
              style={{
                left: `${bubble.x}%`,
                width: bubble.size,
                height: bubble.size,
                background: `radial-gradient(circle at 30% 30%, ${bubble.color}cc, ${bubble.color})`,
              }}
              initial={{ y: '100vh', scale: 0.5, opacity: 0 }}
              animate={{
                y: '-20vh',
                scale: bubble.popping ? 1.5 : 1,
                opacity: bubble.popping ? 0 : 1,
              }}
              transition={{
                y: { duration: 5 + Math.random() * 2, ease: 'linear' },
                scale: bubble.popping ? { duration: 0.2 } : { duration: 0.5 },
                opacity: bubble.popping ? { duration: 0.2 } : { duration: 0.5 },
              }}
              onClick={() => !bubble.popping && popBubble(bubble.id)}
              onTouchStart={(e) => { e.preventDefault(); if (!bubble.popping) popBubble(bubble.id); }}
            >
              <span style={{ fontSize: bubble.size * 0.4, pointerEvents: 'none' }}>
                {bubble.emoji}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
