// ===== Audio Engine (Web Audio API & Howler) =====
import { Howl } from 'howler';

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

// Animal sounds using Howler with remote URLs
const animalSounds = new Howl({
  src: ['https://actions.google.com/sounds/v1/animals/lion_growl.ogg'], // dummy
  html5: true,
});

export function playAnimalSound(animalId, url) {
  // To avoid overlapping a bunch of animal sounds, we can stop existing ones
  if (window.__currentAnimalHowl) {
    window.__currentAnimalHowl.stop();
  }

  // Use Web Audio API backend (html5: false) for short sound effects so they 
  // preload and play instantly without streaming buffering delays on mobile.
  const sound = new Howl({
    src: [url],
    html5: false,
    volume: 1.0,
    preload: true,
  });

  window.__currentAnimalHowl = sound;
  sound.play();
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

// Animals data (using Google Sounds as a free, safe URL source)
export const ANIMALS = [
  { name: 'Cow', id: 'cow', emoji: '🐄', color: '#8B5CF6', url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_c36fc8fb9f.mp3?filename=cow-moo-1-114002.mp3', sound: 'Moo!' },
  { name: 'Cat', id: 'cat', emoji: '🐱', color: '#EC4899', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_10ebd14652.mp3?filename=cat-meow-14536.mp3', sound: 'Meow!' },
  { name: 'Dog', id: 'dog', emoji: '🐶', color: '#F97316', url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_51bb37e725.mp3?filename=dog-barking-70772.mp3', sound: 'Woof!' },
  { name: 'Bird', id: 'bird', emoji: '🐦', color: '#3B82F6', url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_2486ebfcd4.mp3?filename=bird-chirping-11234.mp3', sound: 'Tweet!' },
  { name: 'Frog', id: 'frog', emoji: '🐸', color: '#22C55E', url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_3bed5e9ff0.mp3?filename=frog-croak-131154.mp3', sound: 'Ribbit!' },
  { name: 'Lion', id: 'lion', emoji: '🦁', color: '#EAB308', url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_3ef8735df3.mp3?filename=lion-roar-113974.mp3', sound: 'Roar!' },
  { name: 'Duck', id: 'duck', emoji: '🦆', color: '#06B6D4', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_73d43c224b.mp3?filename=duck-quack-14494.mp3', sound: 'Quack!' },
  { name: 'Pig', id: 'pig', emoji: '🐷', color: '#F472B6', url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_f5cd827d05.mp3?filename=pig-oink-113945.mp3', sound: 'Oink!' },
  { name: 'Horse', id: 'horse', emoji: '🐴', color: '#A16207', url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_d19a32c2c0.mp3?filename=horse-whinny-115939.mp3', sound: 'Neigh!' },
  { name: 'Sheep', id: 'sheep', emoji: '🐑', color: '#9CA3AF', url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_034d61c6b1.mp3?filename=sheep-baa-114003.mp3', sound: 'Baa!' },
  { name: 'Elephant', id: 'elephant', emoji: '🐘', color: '#64748B', url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_06d87cd7a9.mp3?filename=elephant-trumpets-113977.mp3', sound: 'Toot!' },
  { name: 'Monkey', id: 'monkey', emoji: '🐵', color: '#D97706', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_dc3e5cf7bb.mp3?filename=monkey-screeches-14498.mp3', sound: 'Ooh ooh!' },
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
