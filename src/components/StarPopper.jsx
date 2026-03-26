import React, { useState, useEffect, useCallback, useRef } from 'react';
import { playPop, playSuccess } from '../audio';

// Pre-compute twinkling background stars (module-level = never re-renders)
const TWINKLE_STARS = Array.from({ length: 30 }, (_, i) => ({
  key: `tw-${i}`,
  size: Math.random() * 2.5 + 0.5,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  opacity: Math.random() * 0.4 + 0.1,
  dur: `${2 + Math.random() * 3}s`,
  delay: `${Math.random() * 3}s`,
}));

// Mini star SVG path for particles
const STAR_PATH = "M12 0l3.5 7.5H24l-6.5 5.5 2.5 8L12 16l-8 5 2.5-8L0 7.5h8.5z";

export default function StarPopper({ onBack }) {
  const [stars, setStars] = useState([]);
  const [particles, setParticles] = useState([]);
  const [score, setScore] = useState(0);
  const areaRef = useRef(null);

  const createStar = useCallback(() => ({
    id: Math.random().toString(36).substr(2, 9),
    x: Math.random() * 80 + 10,
    size: Math.random() * 25 + 45,
    hue: Math.floor(Math.random() * 360),
    speed: Math.random() * 2.5 + 5,
    wobble: Math.random() * 20 - 10, // horizontal drift in px
    born: Date.now(),
  }), []);

  // Spawn stars
  useEffect(() => {
    // Initial burst
    setStars(Array.from({ length: 4 }, () => createStar()));
    const interval = setInterval(() => {
      setStars(prev => prev.length < 10 ? [...prev, createStar()] : prev);
    }, 1400);
    return () => clearInterval(interval);
  }, [createStar]);

  // Remove stars that floated off-screen (based on their birth time + speed)
  useEffect(() => {
    const gc = setInterval(() => {
      const now = Date.now();
      setStars(prev => prev.filter(s => (now - s.born) < s.speed * 1000 + 500));
    }, 2000);
    return () => clearInterval(gc);
  }, []);

  const spawnParticles = useCallback((star, el) => {
    // Get the star's current position on screen
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Create burst particles
    const count = 10;
    const burst = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const velocity = 60 + Math.random() * 80;
      return {
        id: `p-${Date.now()}-${i}`,
        x: cx,
        y: cy,
        dx: Math.cos(angle) * velocity,
        dy: Math.sin(angle) * velocity,
        size: 6 + Math.random() * 10,
        hue: star.hue + Math.floor(Math.random() * 40 - 20),
        born: Date.now(),
      };
    });
    setParticles(prev => [...prev, ...burst]);

    // Clean particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !burst.find(b => b.id === p.id)));
    }, 600);
  }, []);

  const handlePop = useCallback((star, e) => {
    const el = e.currentTarget;
    playPop();
    if (navigator.vibrate) navigator.vibrate(25);
    spawnParticles(star, el);
    setStars(prev => prev.filter(s => s.id !== star.id));
    setScore(s => {
      const n = s + 1;
      if (n > 0 && n % 10 === 0) playSuccess();
      return n;
    });
  }, [spawnParticles]);

  return (
    <div className="star-popper-game">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <span className="star-score">⭐ {score}</span>
      </div>

      {/* Styled title */}
      <div className="star-title">Aria's Stars</div>

      <div className="star-play-area" ref={areaRef}>
        {/* Twinkling background */}
        {TWINKLE_STARS.map(t => (
          <div
            key={t.key}
            className="twinkle-dot"
            style={{
              width: t.size, height: t.size,
              top: t.top, left: t.left,
              opacity: t.opacity,
              animationDuration: t.dur,
              animationDelay: t.delay,
            }}
          />
        ))}

        {/* Floating stars — pure CSS animation for max fluidity */}
        {stars.map(star => (
          <div
            key={star.id}
            className="floating-star"
            onClick={(e) => handlePop(star, e)}
            onTouchStart={(e) => { e.preventDefault(); handlePop(star, e); }}
            style={{
              left: `${star.x}%`,
              width: star.size,
              height: star.size,
              '--float-speed': `${star.speed}s`,
              '--wobble': `${star.wobble}px`,
              animationDuration: `${star.speed}s`,
            }}
          >
            <svg
              viewBox="0 0 51 48"
              className="star-svg"
              style={{
                '--star-fill': `hsl(${star.hue}, 100%, 85%)`,
                '--star-stroke': `hsl(${star.hue}, 100%, 60%)`,
                '--star-glow': `hsl(${star.hue}, 100%, 75%)`,
              }}
            >
              <path
                d="M25.5 0L31.365 18.0461H50.3475L35.0315 29.1831L40.8965 47.2291L25.5 36.0921L10.1035 47.2291L15.9685 29.1831L0.652512 18.0461H19.635L25.5 0Z"
                fill="var(--star-fill)"
                stroke="var(--star-stroke)"
                strokeWidth="2"
              />
              <circle cx="20" cy="22" r="2" fill="#000" />
              <circle cx="31" cy="22" r="2" fill="#000" />
              <path d="M23 26 C24 28, 27 28, 28 26" stroke="#000" fill="transparent" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        ))}

        {/* Burst particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="star-particle"
            style={{
              left: p.x, top: p.y,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              width: p.size, height: p.size,
            }}
          >
            <svg viewBox="0 0 24 21" fill={`hsl(${p.hue}, 100%, 80%)`}>
              <path d={STAR_PATH} />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
