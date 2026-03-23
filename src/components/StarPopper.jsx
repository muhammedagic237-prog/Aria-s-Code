import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playPop, playSuccess } from '../audio';

export default function StarPopper({ onBack }) {
  const [stars, setStars] = useState([]);
  const [score, setScore] = useState(0);

  // Generate a random star
  const createStar = () => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 80 + 10, // 10% to 90%
      y: 110, // Start below screen
      size: Math.random() * 30 + 50, // 50px to 80px
      hue: Math.floor(Math.random() * 360), // Random pastel hue
      speed: Math.random() * 3 + 4, // 4s to 7s to float up
    };
  };

  // Keep spawning stars
  useEffect(() => {
    const interval = setInterval(() => {
      setStars((prev) => {
        if (prev.length < 12) {
          return [...prev, createStar()];
        }
        return prev;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // Remove stars that go off-screen
  useEffect(() => {
    const cleanup = setInterval(() => {
      // In a real game loop we'd track Y position, but Framer Motion handles the animation.
      // After ~8 seconds, assuming they floated up, remove them to avoid memory leaks.
      if (stars.length > 15) {
        setStars(prev => prev.slice(1));
      }
    }, 4000);
    return () => clearInterval(cleanup);
  }, [stars]);

  const handlePop = (id) => {
    playPop();
    setStars((prev) => prev.filter((s) => s.id !== id));
    setScore(s => {
      const newScore = s + 1;
      if (newScore > 0 && newScore % 10 === 0) {
        playSuccess();
      }
      return newScore;
    });
  };

  return (
    <div className="game-container star-game-bg">
      <header className="game-header">
        <button className="back-btn" onClick={onBack}>
          <span className="icon">🔙</span>
        </button>
        <span className="score-badge">⭐ {score}</span>
      </header>

      <div className="star-play-area">
        <AnimatePresence>
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="star-element"
              initial={{ top: '110%', left: `${star.x}%`, scale: 0 }}
              animate={{ top: '-20%', left: `${star.x + (Math.random() * 10 - 5)}%`, scale: 1 }}
              exit={{ scale: 2, opacity: 0, filter: 'blur(10px)' }}
              transition={{
                top: { duration: star.speed, ease: 'linear' },
                left: { duration: star.speed, ease: 'linear' },
                scale: { type: 'spring', stiffness: 200, damping: 10 },
                exit: { duration: 0.3 }
              }}
              onTapStart={() => handlePop(star.id)} // Touch friendly!
              style={{
                position: 'absolute',
                width: star.size,
                height: star.size,
                cursor: 'pointer',
                touchAction: 'none',
                filter: `drop-shadow(0 0 10px hsl(${star.hue}, 100%, 75%))`,
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
      </div>

      <style>{`
        .star-game-bg {
          background-color: #0F172A; /* Deep Space Black */
          background-image: radial-gradient(circle at 50% 100%, #1E1B4B 0%, #000000 100%);
          position: relative;
          overflow: hidden;
        }
        .star-play-area {
          flex: 1;
          position: relative;
          width: 100%;
          height: 100%;
        }
        .score-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 10px 20px;
          border-radius: 20px;
          color: white;
          font-weight: bold;
          font-size: 1.5rem;
          backdrop-filter: blur(5px);
        }
      `}</style>
    </div>
  );
}
