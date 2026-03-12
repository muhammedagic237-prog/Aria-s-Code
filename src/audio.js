// ===== Audio Engine (Web Audio API — no sound files needed) =====

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

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

// Animal sound synthesizer — creates characteristic sounds for each animal
export function playAnimalSound(animal) {
  const ctx = getAudioContext();

  const createSound = (freqStart, freqEnd, duration, type = 'sawtooth', repeats = 1, gap = 0.2) => {
    for (let r = 0; r < repeats; r++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + r * (duration + gap);

      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, startTime);
      osc.frequency.linearRampToValueAtTime(freqEnd, startTime + duration);

      gain.gain.setValueAtTime(0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    }
  };

  switch (animal) {
    case 'cow':
      createSound(120, 80, 1.5, 'square', 1);
      break;
    case 'cat':
      createSound(600, 400, 1.5, 'sine', 1);
      break;
    case 'dog':
      createSound(400, 300, 0.2, 'square', 5, 0.125);
      break;
    case 'bird':
      createSound(1200, 1800, 0.166, 'sine', 6, 0.1);
      break;
    case 'frog':
      createSound(200, 600, 0.22, 'square', 5, 0.1);
      break;
    case 'lion':
      createSound(100, 50, 1.5, 'sawtooth', 1);
      break;
    case 'duck':
      createSound(500, 400, 0.3, 'square', 4, 0.1);
      break;
    case 'pig':
      createSound(300, 500, 0.4, 'sawtooth', 3, 0.15);
      break;
    case 'horse':
      createSound(200, 350, 0.4, 'sawtooth', 3, 0.15);
      break;
    case 'sheep':
      createSound(350, 300, 0.6, 'sawtooth', 2, 0.3);
      break;
    case 'elephant':
      createSound(200, 500, 1.5, 'sawtooth', 1);
      break;
    case 'monkey':
      createSound(600, 1000, 0.22, 'sine', 5, 0.1);
      break;
    default:
      playNote(440, 1.5);
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

// Animals data
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
