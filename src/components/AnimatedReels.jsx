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
  // Android allows seamless autoplay ONLY if the video is strictly muted initially
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isActive) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Autoplay blocked:', err);
          setHasError(true);
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [isActive, src]);

  // The very first tap unmutes the video player permanently for this instance
  const handleUnmute = () => {
    if (videoRef.current) {
      setIsMuted(false);
      videoRef.current.play();
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
            playsInline={true}
            WebkitPlaysInline={true}
            muted={isMuted} // Muted videos bypass Android's strict autoplay limits
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              pointerEvents: 'none' // Crucial: Stop Android Chrome from capturing the swipe over the video
            }}
            onError={() => setHasError(true)}
          />
          {isMuted && (
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
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index'), 10);
          setCurrentIndex(index);
        }
      });
    }, {
      threshold: 0.6 // Trigger when at least 60% of the video is visible
    });

    if (containerRef.current) {
      const slides = containerRef.current.querySelectorAll('.reel-slide-snap');
      slides.forEach(slide => observer.observe(slide));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="reels-container"
        style={{ 
          background: '#000',
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          width: '100vw',
          height: '100vh',
          overflowY: 'scroll',
          overflowX: 'hidden',
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {REELS.map((reel, index) => (
          <div 
            key={reel.id} 
            className="reel-slide-snap"
            data-index={index}
            style={{ 
              width: '100%', 
              height: '100vh',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
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
      </div>

      {/* Page dots fixed above the scrolling container */}
      <div style={{
        position: 'fixed',
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
    </>
  );
}
