import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// We expect the user to drop video1.mov, video2.mov, etc. into public/reels/
const REELS_COUNT = 5; 
const REELS = Array.from({ length: REELS_COUNT }, (_, i) => ({
  id: `reel-${i + 1}`,
  src: `/reels/video${i + 1}.mov`,
  thumbnail: `/reels/thumbnails/video${i + 1}.webp`
}));

// A simple thumbnail that shows a static frame and loads the video on tap
function VideoThumbnail({ src, thumbnail, onClick, label }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div 
      onClick={onClick}
      className={`video-postcard ${!isLoaded ? 'skeleton' : ''}`}
      style={{
        width: '100%',
        aspectRatio: '9/16',
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#fff',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(255, 105, 180, 0.2)',
        border: '4px solid white'
      }}
      whileTap={{ scale: 0.95 }}
    >
      <img
        src={thumbnail}
        alt={label}
        onLoad={() => setIsLoaded(true)}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          opacity: isLoaded ? 0.9 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: '20px',
        background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4))'
      }}>
        <div style={{ 
          width: '50px', height: '50px', borderRadius: '50%', 
          backgroundColor: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: '1.2rem', marginBottom: '8px'
        }}>
          ▶
        </div>
        <span style={{ fontWeight: '800', fontSize: '1rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          {label}
        </span>
      </div>
    </motion.div>
  );
}

function FullscreenPlayer({ src, onBack }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleExit = () => onBack();
    video.addEventListener('webkitendfullscreen', handleExit);
    return () => video.removeEventListener('webkitendfullscreen', handleExit);
  }, [onBack]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        controls
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </motion.div>
  );
}

export default function AnimatedReels() {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);

  if (selectedVideoIndex !== null) {
    return (
      <FullscreenPlayer 
        src={REELS[selectedVideoIndex].src} 
        onBack={() => setSelectedVideoIndex(null)}
      />
    );
  }

  return (
    <div className="video-gallery-container" style={{ 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'var(--pink-bg)',
      padding: '20px',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '24px', 
        color: 'var(--pink)',
        fontSize: '2rem',
        fontWeight: '900',
        textShadow: '2px 2px 0px white'
      }}>
        Aria’s Videos 💖
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '20px',
        paddingBottom: '80px'
      }}>
        {REELS.map((reel, index) => (
          <VideoThumbnail 
            key={reel.id}
            src={reel.src}
            thumbnail={reel.thumbnail}
            label={`Scene ${index + 1}`}
            onClick={() => setSelectedVideoIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
