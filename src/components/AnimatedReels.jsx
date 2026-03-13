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
            preload="auto"
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
  const touchCurrentY = useRef(0);
  const isSwiping = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);

  // Preload all videos transparently
  useEffect(() => {
    REELS.forEach(reel => {
      const img = new Image();
      img.src = reel.src; // Hint browser to fetch
    });
  }, []);

  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
    isSwiping.current = true;
    setDragOffset(0);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isSwiping.current) return;
    touchCurrentY.current = e.touches[0].clientY;
    const diff = touchCurrentY.current - touchStartY.current;
    
    // Add resistance at the absolute top and bottom edges
    if (currentIndex === 0 && diff > 0) {
      setDragOffset(diff * 0.2); // Slower drag at top
    } else if (currentIndex === REELS.length - 1 && diff < 0) {
      setDragOffset(diff * 0.2); // Slower drag at bottom
    } else {
      setDragOffset(diff);
    }
  }, [currentIndex]);

  const handleTouchEnd = useCallback((e) => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    
    const diff = touchCurrentY.current - touchStartY.current;
    
    if (Math.abs(diff) > 80) {
      if (diff > 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (diff < 0 && currentIndex < REELS.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }
    
    // Snap back
    setDragOffset(0);
  }, [currentIndex]);

  return (
    <div
      className="reels-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        background: '#000',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <motion.div
        animate={{ 
          y: `calc(${-currentIndex * 100}% + ${dragOffset}px)`
        }}
        transition={isSwiping.current ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
        style={{ 
          width: '100%', 
          height: `${REELS.length * 100}%`,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {REELS.map((reel, index) => (
          <div 
            key={reel.id} 
            style={{ 
              width: '100%', 
              height: `${100 / REELS.length}%`,
              position: 'relative'
            }}
          >
            <VideoPlayer src={reel.src} isActive={currentIndex === index} />
            
            {/* Contextual hints */}
            {index < REELS.length - 1 && (
              <span className="swipe-hint" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)', pointerEvents: 'none' }}>
                ⬆ Swipe Up
              </span>
            )}
            {index > 0 && (
              <span className="swipe-hint" style={{ top: '80px', bottom: 'auto', textShadow: '0 2px 4px rgba(0,0,0,0.8)', pointerEvents: 'none' }}>
                ⬇ Swipe Down
              </span>
            )}
          </div>
        ))}
      </motion.div>

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
        pointerEvents: 'none'
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
