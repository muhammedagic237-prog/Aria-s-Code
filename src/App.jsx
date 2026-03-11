import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

import AnimatedReels from './components/AnimatedReels';
import GamesHub from './components/GamesHub';
import AnimalSounds from './components/AnimalSounds';
import MusicKeyboard from './components/MusicKeyboard';
import ColorBubbles from './components/ColorBubbles';
import CountingGame from './components/CountingGame';

function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      className="splash-screen"
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="splash-logo"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
      >
        💜
      </motion.div>
      <motion.h1
        className="splash-title"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Aria's Code
      </motion.h1>
      <motion.p
        className="splash-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.8 }}
      >
        Made with love 💜
      </motion.p>
    </motion.div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('reels'); // 'reels' | 'games'
  const [activeGame, setActiveGame] = useState(null); // null | 'animals' | 'piano' | 'bubbles' | 'counting'

  const handleSelectGame = (gameId) => {
    setActiveGame(gameId);
  };

  const handleBackToHub = () => {
    setActiveGame(null);
  };

  const renderGameContent = () => {
    switch (activeGame) {
      case 'animals':
        return <AnimalSounds onBack={handleBackToHub} />;
      case 'piano':
        return <MusicKeyboard onBack={handleBackToHub} />;
      case 'bubbles':
        return <ColorBubbles onBack={handleBackToHub} />;
      case 'counting':
        return <CountingGame onBack={handleBackToHub} />;
      default:
        return <GamesHub onSelectGame={handleSelectGame} />;
    }
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </AnimatePresence>

      {!showSplash && (
        <div className="app-container">
          <div className="app-content">
            <AnimatePresence mode="wait">
              {activeTab === 'reels' ? (
                <motion.div
                  key="reels"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <AnimatedReels />
                </motion.div>
              ) : (
                <motion.div
                  key="games"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  {renderGameContent()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Navigation */}
          <nav className="bottom-nav">
            <button
              className={`nav-btn ${activeTab === 'reels' ? 'active' : ''}`}
              onClick={() => { setActiveTab('reels'); setActiveGame(null); }}
            >
              <span className="nav-icon">🎬</span>
              <span className="nav-label">Play</span>
            </button>
            <button
              className={`nav-btn ${activeTab === 'games' ? 'active' : ''}`}
              onClick={() => { setActiveTab('games'); setActiveGame(null); }}
            >
              <span className="nav-icon">🎮</span>
              <span className="nav-label">Games</span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
}

export default App;
