import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// We expect the user to drop video1.mov, video2.mov, etc. into public/reels/
const REELS_COUNT = 5; 
const REELS = Array.from({ length: REELS_COUNT }, (_, i) => ({
  id: `reel-${i + 1}`,
  src: `/reels/video${i + 1}.mov`
}));

// A simple thumbnail that plays silently to preview the content
function VideoThumbnail({ src, onClick, label }) {
  return (
    <div 
      onClick={onClick}
      className="video-postcard"
      style={{
        width: '100%',
        aspectRatio: '9/16',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#111',
        cursor: 'pointer',
        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
        border: '2px solid rgba(255,255,255,0.1)'
      }}
    >
      <video
        src={src}
        muted
        autoPlay
        loop
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8))'
      }}>
        <div style={{ 
          width: '60px', height: '60px', borderRadius: '50%', 
          backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: '1.5rem', marginBottom: '10px'
        }}>
          ▶
        </div>
        <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#fff' }}>{label}</span>
      </div>
    </div>
  );
}

function FullscreenPlayer({ src, onBack }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#000',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Heavy-Duty Close Button */}
      <button 
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1100,
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#ff4444',
          border: '4px solid white',
          color: 'white',
          fontSize: '2rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
      >
        ✕
      </button>

      <video
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
    </div>
  );
}

export default function AnimatedReels() {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);

  // Return to gallery
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
      backgroundColor: '#0a0a0a',
      padding: '20px',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '24px', 
        color: '#fff',
        fontSize: '1.8rem',
        fontWeight: '800'
      }}>
        Aria's Videos 📺
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '20px',
        paddingBottom: '40px'
      }}>
        {REELS.map((reel, index) => (
          <VideoThumbnail 
            key={reel.id}
            src={reel.src}
            label={`Video ${index + 1}`}
            onClick={() => setSelectedVideoIndex(index)}
          />
        ))}
      </div>

      <div style={{ 
        textAlign: 'center', 
        opacity: 0.5, 
        fontSize: '0.9rem', 
        marginTop: '20px',
        color: '#fff'
      }}>
        Tap a video to play!
      </div>
    </div>
  );
}
