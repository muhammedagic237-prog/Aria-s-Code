import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playPop, playSuccess } from '../audio';

export default function StarPopper({ onBack }) {
  const [stars, setStars] = useState([]);
  const [score, setScore] = useState(0);

  const createStar = () => ({
    id: Math.random().toString(36).substr(2, 9),
    x: Math.random() * 80 + 10,
    size: Math.random() * 30 + 50,
    hue: Math.floor(Math.random() * 360),
    speed: Math.random() * 3 + 4,
  });

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
        <AnimatePresence>
          {stars.map(star => (
            <motion.div
              key={star.id}
              initial={{ top: '110%', left: `${star.x}%`, scale: 0 }}
              animate={{ top: '-20%', left: `${star.x + (Math.random() * 10 - 5)}%`, scale: 1 }}
              exit={{ scale: 2, opacity: 0, filter: 'blur(10px)' }}
              transition={{
                top: { duration: star.speed, ease: 'linear' },
                left: { duration: star.speed, ease: 'linear' },
                scale: { type: 'spring', stiffness: 200, damping: 10 },
                exit: { duration: 0.3 }
              }}
              onTapStart={() => handlePop(star.id)}
              style={{
                position: 'absolute',
                width: star.size,
                height: star.size,
                cursor: 'pointer',
                touchAction: 'none',
                filter: `drop-shadow(0 0 12px hsl(${star.hue}, 100%, 75%))`,
              }}
            >
              <svg viewBox="0 0 51 48" fill={`hsl(${star.hue}, 100%, 85%)`} stroke={`hsl(${star.hue}, 100%, 60%)`} strokeWidth="2">
                <path d="M25.5 0L31.365 18.0461H50.3475L35.0315 29.1831L40.8965 47.2291L25.5 36.0921L10.1035 47.2291L15.9685 29.1831L0.652512 18.0461H19.635L25.5 0Z" />
                <circle cx="20" cy="22" r="2" fill="#000" />
                <circle cx="31" cy="22" r="2" fill="#000" />
                <path d="M23 26 C24 28, 27 28, 28 26" stroke="#000" fill="transparent" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Decorative twinkling background particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`twinkle-${i}`}
            style={{
              position: 'absolute',
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              borderRadius: '50%',
              background: 'white',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
