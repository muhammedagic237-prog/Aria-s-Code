import React, { useState } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { playNote, PIANO_NOTES } from '../audio';

export default function MusicKeyboard({ onBack }) {
  const [pressedKey, setPressedKey] = useState(null);

  const handleKeyPress = (noteData, index) => {
    setPressedKey(index);
    playNote(noteData.freq, 0.6, 'triangle');

    // Haptic
    if (navigator.vibrate) navigator.vibrate(15);

    setTimeout(() => setPressedKey(null), 300);
  };

  return (
    <div className="keyboard-game">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>🎹 Music</h2>
      </div>

      <div className="keyboard-display">
        <motion.div
          className="note-display"
          key={pressedKey}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {pressedKey !== null ? (
            <span style={{ color: PIANO_NOTES[pressedKey]?.color }}>
              {PIANO_NOTES[pressedKey]?.emoji} {PIANO_NOTES[pressedKey]?.note}
            </span>
          ) : (
            <span style={{ opacity: 0.3 }}>🎵 Tap a key!</span>
          )}
        </motion.div>
      </div>

      <div className="piano-keys">
        {PIANO_NOTES.map((note, i) => (
          <motion.button
            key={note.note}
            className={`piano-key ${pressedKey === i ? 'pressed' : ''}`}
            style={{
              background: `linear-gradient(180deg, ${note.color}dd, ${note.color})`,
              boxShadow: pressedKey === i
                ? `0 2px 10px ${note.color}88`
                : `0 6px 20px ${note.color}44, inset 0 -4px 10px rgba(0,0,0,0.15)`,
            }}
            onTouchStart={(e) => { e.preventDefault(); handleKeyPress(note, i); }}
            onMouseDown={() => handleKeyPress(note, i)}
            whileTap={{ scaleY: 0.97 }}
          >
            <span className="key-emoji">{note.emoji}</span>
            {note.note}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
