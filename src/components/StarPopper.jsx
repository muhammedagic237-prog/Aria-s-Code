import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playPop, playSuccess } from '../audio';

// Pre-compute twinkling star positions so they don't regenerate on every render
const TWINKLE_STARS = Array.from({ length: 25 }, (_, i) => ({
  key: `tw-${i}`,
  width: Math.random() * 2.5 + 0.5,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  opacity: Math.random() * 0.4 + 0.1,
  duration: `${2 + Math.random() * 3}s`,
  delay: `${Math.random() * 3}s`,
}));

export default function StarPopper({ onBack }) {
  const [stars, setStars] = useState([]);
  const [score, setScore] = useState(0);

  // Pre-compute the drift offset at creation time so it doesn't change on re-render
  const createStar = () => {
    const x = Math.random() * 80 + 10;
    return {
      id: Math.random().toString(36).substr(2, 9),
      x,
      xEnd: x + (Math.random() * 10 - 5), // fixed drift target
      size: Math.random() * 30 + 50,
      hue: Math.floor(Math.random() * 360),
      speed: Math.random() * 3 + 4,
    };
  };

  // Spawn stars
  useEffect(() => {
    const interval = setInterval(() => {
      setStars(prev => prev.length < 12 ? [...prev, createStar()] : prev);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Cleanup excess stars
  useEffect(() => {
    const cleanup = setInterval(() => {
      setStars(prev => prev.length > 15 ? prev.slice(1) : prev);
    }, 4000);
    return () => clearInterval(cleanup);
  }, []);

  const handlePop = (id) => {
    playPop();
    if (navigator.vibrate) navigator.vibrate(20);
    setStars(prev => prev.filter(s => s.id !== id));
    setScore(s => {
      const n = s + 1;
      if (n > 0 && n % 10 === 0) playSuccess();
      return n;
    });
  };

  return (
    <div className="star-popper-game">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>✨ Stars</h2>
        <span className="star-score">⭐ {score}</span>
      </div>

      <div className="star-play-area">
        {/* Static twinkling background — never re-renders */}
        {TWINKLE_STARS.map(t => (
          <div
            key={t.key}
            className="twinkle-dot"
            style={{
              width: t.width,
              height: t.width,
              top: t.top,
              left: t.left,
              opacity: t.opacity,
              animationDuration: t.duration,
              animationDelay: t.delay,
            }}
          />
        ))}

        <AnimatePresence>
          {stars.map(star => (
            <motion.div
              key={star.id}
              className="star-element"
              initial={{ y: '110vh', scale: 0, opacity: 0 }}
              animate={{ y: '-20vh', scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{
                y: { duration: star.speed, ease: 'linear' },
                scale: { type: 'spring', stiffness: 200, damping: 12 },
                opacity: { duration: 0.3 },
              }}
              onTapStart={() => handlePop(star.id)}
              style={{
                position: 'absolute',
                left: `${star.x}%`,
                width: star.size,
                height: star.size,
                cursor: 'pointer',
                touchAction: 'none',
                willChange: 'transform, opacity',
              }}
            >
              <svg
                viewBox="0 0 51 48"
                fill={`hsl(${star.hue}, 100%, 85%)`}
                stroke={`hsl(${star.hue}, 100%, 60%)`}
                strokeWidth="2"
                style={{ filter: `drop-shadow(0 0 8px hsl(${star.hue}, 100%, 75%))` }}
              >
                <path d="M25.5 0L31.365 18.0461H50.3475L35.0315 29.1831L40.8965 47.2291L25.5 36.0921L10.1035 47.2291L15.9685 29.1831L0.652512 18.0461H19.635L25.5 0Z" />
                <circle cx="20" cy="22" r="2" fill="#000" />
                <circle cx="31" cy="22" r="2" fill="#000" />
                <path d="M23 26 C24 28, 27 28, 28 26" stroke="#000" fill="transparent" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
