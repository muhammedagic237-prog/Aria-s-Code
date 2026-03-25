// ===== Audio Engine (Web Audio API & Synthesizer) =====

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// Ensure AudioContext is ready (must be called from a user gesture)
async function ensureResumed() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    try { await ctx.resume(); } catch (e) { /* ignore */ }
  }
  return ctx;
}

// Warm up on first touch/click (iOS/Android autoplay policy)
function warmUp() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  // Also play a silent buffer to unlock audio on iOS Safari
  const buf = ctx.createBuffer(1, 1, 22050);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.start(0);
}
window.addEventListener('touchstart', warmUp, { once: true });
window.addEventListener('click', warmUp, { once: true });

// Play a musical note by frequency
export async function playNote(frequency, duration = 0.5, type = 'triangle') {
  const ctx = await ensureResumed();
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
export async function playPop() {
  const ctx = await ensureResumed();
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
