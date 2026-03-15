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
  const canvasRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [needsManualPlay, setNeedsManualPlay] = useState(false);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    let animationId;

    video.muted = isGlobalMuted;

    const renderFrame = () => {
      if (video.paused || video.ended) return;
      
      // Update canvas size if it doesn't match video
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      animationId = requestAnimationFrame(renderFrame);
    };

    if (isActive) {
      setNeedsManualPlay(false);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          renderFrame();
        }).catch(err => {
          console.warn('Autoplay blocked:', err);
          if (err.name === 'NotAllowedError') {
             setNeedsManualPlay(true);
          } else {
             setHasError(true);
          }
        });
      }
    } else {
      video.pause();
      video.currentTime = 0;
      cancelAnimationFrame(animationId);
    }

    return () => cancelAnimationFrame(animationId);
  }, [isActive, src, isGlobalMuted]);

  const handleUnmute = () => {
    if (videoRef.current) {
      onUnmute();
      videoRef.current.muted = false;
      videoRef.current.play().catch(err => console.warn('Manual play blocked', err));
      setNeedsManualPlay(false);
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'absolute', 
      top: 0, 
      left: 0,
      backgroundColor: '#000',
      opacity: isActive ? 1 : 0,
      pointerEvents: isActive ? 'auto' : 'none',
      transition: 'opacity 0.4s ease-in-out',
      zIndex: isActive ? 1 : 0
    }}>
      {hasError ? (
        <div style={{ 
          color: 'white', 
          textAlign: 'center', 
          padding: '2rem',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%'
        }}>
          <h3>⚠️ Video Missing</h3>
          <p style={{ opacity: 0.7, fontSize: '0.9rem', marginTop: '1rem' }}>
            AriasCode/public/reels/{src.split('/').pop()}
          </p>
        </div>
      ) : (
        <>
          {/* THE NUCLEAR CORE: Hidden video, visible canvas. Safari cannot hijack a canvas. */}
          <video
            ref={videoRef}
            src={src}
            loop
            preload="auto"
            playsInline
            webkit-playsinline="true"
            muted={isGlobalMuted} 
            style={{ display: 'none' }}
            onError={() => setHasError(true)}
          />
          
          <canvas 
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />

          {isActive && ((isGlobalMuted) || needsManualPlay) && (
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
      {/* Persistent DOM Stack: Using Canvas to prevent iOS hijack */}
      {REELS.map((reel, index) => (
        <VideoPlayer 
          key={reel.id}
          src={reel.src} 
          isActive={currentIndex === index} 
          isGlobalMuted={isGlobalMuted}
          onUnmute={() => setIsGlobalMuted(false)}
        />
      ))}

      {/* Navigation Controls */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        zIndex: 50
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
        pointerEvents: 'none',
        zIndex: 60
      }}>
        Video {currentIndex + 1} / {REELS.length}
      </div>
    </div>
  );
}
