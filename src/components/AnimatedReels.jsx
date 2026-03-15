import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// We expect the user to drop video1.mov, video2.mov, etc. into public/reels/
const REELS_COUNT = 5; 
const REELS = Array.from({ length: REELS_COUNT }, (_, i) => ({
  id: `reel-${i + 1}`,
  src: `/reels/video${i + 1}.mov`
}));

function VideoPlayer({ src, isActive, isGlobalMuted, onUnmute }) {
  const videoRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [needsManualPlay, setNeedsManualPlay] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    
    // Explicitly update the native DOM element's muted property
    videoRef.current.muted = isGlobalMuted;

    if (isActive) {
      videoRef.current.currentTime = 0;
      setNeedsManualPlay(false);
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Autoplay blocked:', err);
          if (err.name === 'NotAllowedError') {
             setNeedsManualPlay(true);
          } else {
             setHasError(true);
          }
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [isActive, src, isGlobalMuted]);

  // The very first tap unmutes the video player permanently for all instances globaly
  const handleUnmute = () => {
    if (videoRef.current) {
      onUnmute();
      videoRef.current.muted = false;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => console.warn('Manual play blocked', err));
      }
      setNeedsManualPlay(false);
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
            autoPlay
            preload="auto"
            playsInline={true}
            webkit-playsinline="true"
            x5-playsinline="true"
            disableRemotePlayback={true}
            disablePictureInPicture={true}
            muted={isGlobalMuted} // Muted videos bypass Android's strict autoplay limits
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              pointerEvents: 'none' // Crucial: Stop browsers from capturing child gestures
            }}
            onError={() => setHasError(true)}
          />
          
          {/* Invisible touch-shield to stop iOS Safari from "grabbing" the video element */}
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            backgroundColor: 'transparent'
          }} />

          {((isGlobalMuted && isActive) || needsManualPlay) && (
            <div 
              onClick={handleUnmute}
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
                paddingLeft: '10px'
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
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % REELS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + REELS.length) % REELS.length);
  };

  return (
    <div className="reels-tv-container" style={{ 
      width: '100%', 
      height: '100%', 
      backgroundColor: '#000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={REELS[currentIndex].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', height: '100%' }}
        >
          <VideoPlayer 
            src={REELS[currentIndex].src} 
            isActive={true} 
            isGlobalMuted={isGlobalMuted}
            onUnmute={() => setIsGlobalMuted(false)}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        zIndex: 10
      }}>
        <button 
          onClick={handlePrev}
          className="tv-nav-btn"
          style={{
            pointerEvents: 'auto',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            border: 'none',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            fontSize: '2rem',
            color: 'white',
            cursor: 'pointer',
            display: currentIndex === 0 ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ◀
        </button>

        <button 
          onClick={handleNext}
          className="tv-nav-btn"
          style={{
            pointerEvents: 'auto',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            border: 'none',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            fontSize: '2rem',
            color: 'white',
            cursor: 'pointer',
            display: currentIndex === REELS.length - 1 ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'auto'
          }}
        >
          ▶
        </button>
      </div>

      {/* Counter Label */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '8px 16px',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: '700',
        pointerEvents: 'none'
      }}>
        Video {currentIndex + 1} / {REELS.length}
      </div>
    </div>
  );
}
