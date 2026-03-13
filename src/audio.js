// ===== Audio Engine (Web Audio API & Synthesizer) =====

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Try to resume if it's suspended (modern browser autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {
      console.warn("AudioContext couldn't resume yet");
    });
  }
  return audioCtx;
}

// Ensure the context starts on the first interaction globally
const initAudio = () => {
  getAudioContext();
  window.removeEventListener('touchstart', initAudio);
  window.removeEventListener('click', initAudio);
};
window.addEventListener('touchstart', initAudio, { once: true });
window.addEventListener('click', initAudio, { once: true });

// Play a musical note by frequency
export function playNote(frequency, duration = 0.5, type = 'triangle') {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);

  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

// Play a "pop" sound effect
export function playPop() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
}

// Play a "success" jingle
export function playSuccess() {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => playNote(freq, 0.3, 'sine'), i * 120);
  });
}

// Play a "count" tick sound
export function playCountTick(count) {
  const baseFreq = 300 + (count * 40);
  playNote(baseFreq, 0.15, 'sine');
}

export function playAnimalSound(animalId) {
  const ctx = getAudioContext();
  
  // A helper to make slightly better, textured synth noises for animals
  const makeNoise = (type, duration, freqs, vol = 0.5, stagger = 0) => {
    freqs.forEach((freqPair, i) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freqPair[0], ctx.currentTime);
        if (freqPair[1]) {
           osc.frequency.exponentialRampToValueAtTime(freqPair[1], ctx.currentTime + duration);
        }

        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
      }, i * stagger * 1000);
    });
  };

  // Custom textures for each animal (fallback from real audio)
  switch (animalId) {
    case 'cow': makeNoise('sawtooth', 1.2, [[100, 70]], 0.8); break;
    case 'cat': makeNoise('sine', 0.6, [[600, 300]], 0.4); break;
    case 'dog': makeNoise('square', 0.2, [[300, 200], [350, 250]], 0.6, 0.15); break;
    case 'bird': makeNoise('sine', 0.1, [[2000, 2500], [2200, 2800], [2000, 2600]], 0.3, 0.1); break;
    case 'frog': makeNoise('triangle', 0.15, [[150, 300], [180, 320]], 0.7, 0.1); break;
    case 'lion': makeNoise('sawtooth', 1.5, [[80, 40], [90, 40]], 1.0, 0.2); break;
    case 'duck': makeNoise('square', 0.25, [[400, 300], [450, 300]], 0.4, 0.2); break;
    case 'pig': makeNoise('sawtooth', 0.4, [[150, 250], [150, 250]], 0.6, 0.3); break;
    case 'horse': makeNoise('sawtooth', 0.8, [[400, 200]], 0.5); break;
    case 'sheep': makeNoise('square', 0.6, [[300, 250]], 0.4); break;
    case 'elephant': makeNoise('sawtooth', 1.5, [[250, 100]], 0.9); break;
    case 'monkey': makeNoise('sine', 0.15, [[800, 1200], [900, 1100], [800, 1200]], 0.4, 0.1); break;
    default: makeNoise('triangle', 0.5, [[440, 220]], 0.5);
  }
}

// Speak a number aloud using TTS
export function speakNumber(num) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(num.toString());
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
  }
}

// Piano note frequencies for the keyboard
export const PIANO_NOTES = [
  { note: 'C', freq: 261.63, color: '#EF4444', emoji: '🌹' },
  { note: 'D', freq: 293.66, color: '#F97316', emoji: '🌻' },
  { note: 'E', freq: 329.63, color: '#EAB308', emoji: '⭐' },
  { note: 'F', freq: 349.23, color: '#22C55E', emoji: '🍀' },
  { note: 'G', freq: 392.00, color: '#3B82F6', emoji: '💎' },
  { note: 'A', freq: 440.00, color: '#8B5CF6', emoji: '🦋' },
  { note: 'B', freq: 493.88, color: '#EC4899', emoji: '🌸' },
  { note: 'C²', freq: 523.25, color: '#F43F5E', emoji: '❤️' },
];

// Animals data (Reverted back to original data structure without URLs)
export const ANIMALS = [
  { name: 'Cow', id: 'cow', emoji: '🐄', color: '#8B5CF6', sound: 'Moo!' },
  { name: 'Cat', id: 'cat', emoji: '🐱', color: '#EC4899', sound: 'Meow!' },
  { name: 'Dog', id: 'dog', emoji: '🐶', color: '#F97316', sound: 'Woof!' },
  { name: 'Bird', id: 'bird', emoji: '🐦', color: '#3B82F6', sound: 'Tweet!' },
  { name: 'Frog', id: 'frog', emoji: '🐸', color: '#22C55E', sound: 'Ribbit!' },
  { name: 'Lion', id: 'lion', emoji: '🦁', color: '#EAB308', sound: 'Roar!' },
  { name: 'Duck', id: 'duck', emoji: '🦆', color: '#06B6D4', sound: 'Quack!' },
  { name: 'Pig', id: 'pig', emoji: '🐷', color: '#F472B6', sound: 'Oink!' },
  { name: 'Horse', id: 'horse', emoji: '🐴', color: '#A16207', sound: 'Neigh!' },
  { name: 'Sheep', id: 'sheep', emoji: '🐑', color: '#9CA3AF', sound: 'Baa!' },
  { name: 'Elephant', id: 'elephant', emoji: '🐘', color: '#64748B', sound: 'Toot!' },
  { name: 'Monkey', id: 'monkey', emoji: '🐵', color: '#D97706', sound: 'Ooh ooh!' },
];

// Bubble colors
export const BUBBLE_COLORS = [
  { name: 'Red', color: '#EF4444', emoji: '🔴' },
  { name: 'Orange', color: '#F97316', emoji: '🟠' },
  { name: 'Yellow', color: '#EAB308', emoji: '🟡' },
  { name: 'Green', color: '#22C55E', emoji: '🟢' },
  { name: 'Blue', color: '#3B82F6', emoji: '🔵' },
  { name: 'Purple', color: '#8B5CF6', emoji: '🟣' },
  { name: 'Pink', color: '#EC4899', emoji: '💗' },
];

// Counting game emojis
export const COUNT_EMOJIS = ['🍎', '🌟', '🎈', '🐞', '🌸', '🍊', '🦋', '🍓', '🌈', '🐠'];
