import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// We expect the user to drop video1.mov, video2.mov, etc. into public/reels/
const REELS_COUNT = 5; 
const REELS = Array.from({ length: REELS_COUNT }, (_, i) => ({
  id: `reel-${i + 1}`,
  src: `/reels/video${i + 1}.mov`
}));

function VideoPlayer({ src, isActive }) {
  const videoRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [requiresInteraction, setRequiresInteraction] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isActive) {
      videoRef.current.currentTime = 0;
      let playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Video autoplay prevented or file missing:', err);
          if (err.name === 'NotAllowedError') {
             // iOS Safari blocked autoplay because the user didn't tap the video yet
             setRequiresInteraction(true);
          } else {
             setHasError(true);
          }
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [isActive, src]);

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setRequiresInteraction(false);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#000' }}>
      {hasError ? (
        <div style={{ 
          color: 'white', 
          textAlign: 'center', 
          padding: '2rem',
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)'
        }}>
          <h3>⚠️ Video Missing</h3>
          <p style={{ opacity: 0.7, fontSize: '1rem', marginTop: '1rem' }}>
            Please drop your screen-recorded video into the project folder:<br/><br/>
            <code>AriasCode/public/reels/{src.split('/').pop()}</code>
          </p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={src}
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setHasError(true)}
          />
          {requiresInteraction && (
            <div 
              onClick={handleManualPlay}
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.4)',
                zIndex: 20
              }}
            >
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontSize: '3rem', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                paddingLeft: '10px' // Center the play triangle visually
              }}>
                ▶️
              </div>
            </div>
          )}
        </>
      )}
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

  const currentReel = REELS[currentIndex];

  return (
    <div
      className="reels-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ background: '#000' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentReel.id}
          className="reel-slide"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          style={{ padding: 0 }} // Remove default padding for full bleed video
        >
          <VideoPlayer src={currentReel.src} isActive={true} />

          {currentIndex < REELS.length - 1 && (
            <span className="swipe-hint" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              ⬆ Swipe Up
            </span>
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
