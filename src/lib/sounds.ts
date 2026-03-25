"use client";

// ──────────────────────────────────────────────────────────
// Web Audio API Sound System — procedural, no external files
// ──────────────────────────────────────────────────────────

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
  }
  // Resume if suspended (autoplay policy)
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15,
  delay = 0,
) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, c.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(c.currentTime + delay);
  osc.stop(c.currentTime + delay + duration + 0.05);
}

function playNoise(duration: number, volume = 0.08, delay = 0) {
  const c = getCtx();
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = c.createBufferSource();
  source.buffer = buffer;
  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, c.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
  const filter = c.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 3000;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  source.start(c.currentTime + delay);
}

// ── Sound Effects ────────────────────────────────────────

/** Short tap/click */
export function playTap() {
  playTone(800, 0.06, "sine", 0.1);
  playTone(1200, 0.04, "sine", 0.06, 0.02);
}

/** Card swoosh transition */
export function playSwoosh() {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(200, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.15);
  gain.gain.setValueAtTime(0.08, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.25);
  playNoise(0.12, 0.04);
}

/** Positive outcome — bright ascending chime */
export function playPositive() {
  playTone(523, 0.15, "sine", 0.12);       // C5
  playTone(659, 0.15, "sine", 0.12, 0.08); // E5
  playTone(784, 0.2, "sine", 0.14, 0.16);  // G5
}

/** Negative outcome — descending tones */
export function playNegative() {
  playTone(440, 0.15, "sine", 0.1);        // A4
  playTone(349, 0.15, "sine", 0.1, 0.1);   // F4
  playTone(262, 0.25, "sine", 0.12, 0.2);  // C4
}

/** Drama event — tense stinger */
export function playDrama() {
  playTone(220, 0.3, "sawtooth", 0.06);
  playTone(233, 0.3, "sawtooth", 0.06, 0.02); // dissonant
  playNoise(0.15, 0.05, 0.1);
  playTone(185, 0.4, "sine", 0.08, 0.15);     // low rumble
}

/** Milestone / achievement fanfare */
export function playMilestone() {
  playTone(523, 0.12, "sine", 0.12);       // C5
  playTone(659, 0.12, "sine", 0.12, 0.1);  // E5
  playTone(784, 0.12, "sine", 0.12, 0.2);  // G5
  playTone(1047, 0.3, "sine", 0.15, 0.3);  // C6 — triumphant
  playTone(784, 0.15, "triangle", 0.08, 0.35);
  playTone(1047, 0.4, "triangle", 0.1, 0.45);
}

/** Money / cha-ching */
export function playMoney() {
  playTone(1200, 0.08, "square", 0.06);
  playTone(1800, 0.06, "square", 0.06, 0.05);
  playTone(2400, 0.1, "sine", 0.08, 0.08);
  playNoise(0.06, 0.03, 0.04);
}

/** Level up — ascending scale */
export function playLevelUp() {
  const notes = [523, 587, 659, 784, 880, 1047]; // C5 D5 E5 G5 A5 C6
  notes.forEach((freq, i) => {
    playTone(freq, 0.12, "sine", 0.1, i * 0.07);
    playTone(freq * 1.5, 0.08, "triangle", 0.04, i * 0.07 + 0.02);
  });
}

/** Viral moment — exciting sparkle */
export function playViral() {
  playTone(880, 0.1, "sine", 0.1);
  playTone(1047, 0.1, "sine", 0.1, 0.06);
  playTone(1319, 0.1, "sine", 0.1, 0.12);
  playTone(1568, 0.15, "sine", 0.12, 0.18);
  playNoise(0.08, 0.04, 0.1);
  playNoise(0.06, 0.03, 0.2);
}

/** Game start — energetic intro */
export function playGameStart() {
  playTone(262, 0.1, "sine", 0.1);       // C4
  playTone(330, 0.1, "sine", 0.1, 0.08);
  playTone(392, 0.1, "sine", 0.1, 0.16);
  playTone(523, 0.15, "sine", 0.12, 0.24);
  playTone(659, 0.12, "sine", 0.12, 0.34);
  playTone(784, 0.25, "sine", 0.14, 0.42);
  playTone(523, 0.2, "triangle", 0.06, 0.45);
}

/** Game over — somber ending */
export function playGameOver() {
  playTone(440, 0.3, "sine", 0.1);
  playTone(415, 0.3, "sine", 0.1, 0.2);
  playTone(392, 0.3, "sine", 0.1, 0.4);
  playTone(349, 0.5, "sine", 0.12, 0.6);
  playTone(262, 0.6, "sine", 0.08, 0.8);
}

/** Boost reward */
export function playBoost() {
  playTone(440, 0.08, "sine", 0.1);
  playTone(554, 0.08, "sine", 0.1, 0.06);
  playTone(659, 0.08, "sine", 0.1, 0.12);
  playTone(880, 0.2, "sine", 0.12, 0.18);
  playNoise(0.05, 0.03, 0.15);
}

/** Failure event — ominous */
export function playFailure() {
  playTone(196, 0.25, "sawtooth", 0.05);
  playTone(185, 0.3, "sine", 0.08, 0.1);
  playTone(165, 0.35, "sine", 0.06, 0.25);
}
