import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Animated reel scenes — each is a full-screen animated "card"
const REELS = [
  {
    id: 'welcome',
    bg: 'bg-gradient-purple',
    emoji: '💜',
    title: "Hi Aria!",
    subtitle: "Swipe up to play!",
    particles: ['✨', '🌟', '⭐', '💫'],
  },
  {
    id: 'counting',
    bg: 'bg-gradient-blue',
    emoji: '🔢',
    title: "1, 2, 3!",
    subtitle: "Let's count together!",
    items: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'],
  },
  {
    id: 'animals',
    bg: 'bg-gradient-green',
    emoji: '🦁',
    title: "Animals!",
    subtitle: "Can you roar like a lion?",
    items: ['🐶', '🐱', '🐮', '🐷', '🐸'],
  },
  {
    id: 'colors',
    bg: 'bg-gradient-pink',
    emoji: '🌈',
    title: "Colors!",
    subtitle: "So many colors!",
    items: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣'],
  },
  {
    id: 'shapes',
    bg: 'bg-gradient-orange',
    emoji: '🔷',
    title: "Shapes!",
    subtitle: "Circle, square, triangle!",
    items: ['⬛', '🔺', '⭕', '💠', '🔶'],
  },
  {
    id: 'fruits',
    bg: 'bg-gradient-red',
    emoji: '🍎',
    title: "Yummy Fruits!",
    subtitle: "What's your favorite?",
    items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌'],
  },
  {
    id: 'space',
    bg: 'bg-gradient-teal',
    emoji: '🚀',
    title: "To The Stars!",
    subtitle: "3... 2... 1... Blast off!",
    items: ['🌙', '⭐', '🪐', '☀️', '🌍'],
  },
  {
    id: 'music',
    bg: 'bg-gradient-yellow',
    emoji: '🎵',
    title: "Music Time!",
    subtitle: "Let's make some noise!",
    items: ['🎹', '🥁', '🎸', '🎺', '🎻'],
  },
];

function FloatingItems({ items }) {
  if (!items) return null;
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '24px' }}>
      {items.map((item, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 200 }}
          style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))' }}
        >
          {item}
        </motion.span>
      ))}
    </div>
  );
}

function Particles({ items }) {
  if (!items) return null;
  return (
    <div className="particles">
      {items.map((p, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            y: [0, -40, 0],
            x: [0, (i % 2 ? 15 : -15), 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          style={{
            position: 'absolute',
            fontSize: '1.5rem',
            top: `${20 + i * 18}%`,
            left: `${10 + i * 20}%`,
          }}
        >
          {p}
        </motion.span>
      ))}
    </div>
  );
}

export default function AnimatedReels() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 60) {
      isSwiping.current = true;
      if (diff > 0 && currentIndex < REELS.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    }
  }, [currentIndex]);

  const reel = REELS[currentIndex];

  return (
    <div
      className="reels-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={reel.id}
          className={`reel-slide ${reel.bg}`}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <Particles items={reel.particles} />

          <motion.div
            className="reel-emoji"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 180 }}
          >
            {reel.emoji}
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            {reel.title}
          </motion.h1>

          <motion.p
            className="reel-subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            transition={{ delay: 0.35 }}
          >
            {reel.subtitle}
          </motion.p>

          <FloatingItems items={reel.items} />

          {currentIndex < REELS.length - 1 && (
            <span className="swipe-hint">⬆ Swipe Up</span>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Page dots */}
      <div style={{
        position: 'absolute',
        right: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        zIndex: 10,
      }}>
        {REELS.map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: i === currentIndex ? 20 : 6,
              borderRadius: 3,
              background: i === currentIndex ? '#fff' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
