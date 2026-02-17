import { noteFreq, getStepNote } from '../data/musicTheory';

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let analyser: AnalyserNode | null = null;

export function initAudio() {
  if (audioCtx) return;
  audioCtx = new AudioContext();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.7;
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  masterGain.connect(analyser);
  analyser.connect(audioCtx.destination);
}

export function getAnalyser(): AnalyserNode | null {
  return analyser;
}

export function getAudioContext(): AudioContext | null {
  return audioCtx;
}

function playKick(time: number) {
  if (!audioCtx || !masterGain) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(160, time);
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.12);
  gain.gain.setValueAtTime(1, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(time);
  osc.stop(time + 0.3);
}

function playSnare(time: number) {
  if (!audioCtx || !masterGain) return;
  const bufferSize = audioCtx.sampleRate * 0.1;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.6, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 1000;

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(masterGain);
  noise.start(time);
  noise.stop(time + 0.15);

  const osc = audioCtx.createOscillator();
  const oscGain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(200, time);
  osc.frequency.exponentialRampToValueAtTime(80, time + 0.05);
  oscGain.gain.setValueAtTime(0.5, time);
  oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
  osc.connect(oscGain);
  oscGain.connect(masterGain);
  osc.start(time);
  osc.stop(time + 0.08);
}

function playHiHat(time: number) {
  if (!audioCtx || !masterGain) return;
  const bufferSize = audioCtx.sampleRate * 0.05;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.3, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

  const hp = audioCtx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 5000;

  const bp = audioCtx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 10000;

  noise.connect(hp);
  hp.connect(bp);
  bp.connect(gain);
  gain.connect(masterGain);
  noise.start(time);
  noise.stop(time + 0.05);
}

export function playTone(
  note: number,
  octave: number,
  time: number,
  type: OscillatorType = 'sine',
  duration = 0.15,
  attack = 0.01,
  release = 0.1,
) {
  if (!audioCtx || !masterGain) return;
  const freq = noteFreq(note, octave);
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.3, time + attack);
  gain.gain.linearRampToValueAtTime(0.001, time + duration);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(time);
  osc.stop(time + duration + 0.01);
}

function playFX(time: number) {
  if (!audioCtx || !masterGain) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(800, time);
  osc.frequency.exponentialRampToValueAtTime(200, time + 0.2);
  gain.gain.setValueAtTime(0.15, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(time);
  osc.stop(time + 0.2);
}

export function playInstrument(
  instId: string,
  time: number,
  step: number,
  currentKey: number,
  currentScale: string,
) {
  switch (instId) {
    case 'kick':
      playKick(time);
      break;
    case 'snare':
      playSnare(time);
      break;
    case 'hihat':
      playHiHat(time);
      break;
    case 'bass': {
      const n = getStepNote('bass', step, currentKey, currentScale);
      playTone(n.note, n.octave, time, 'sawtooth', 0.2, 0.005, 0.15);
      break;
    }
    case 'synth1': {
      const n = getStepNote('synth1', step, currentKey, currentScale);
      playTone(n.note, n.octave, time, 'square', 0.15, 0.01, 0.1);
      break;
    }
    case 'synth2': {
      const n = getStepNote('synth2', step, currentKey, currentScale);
      playTone(n.note, n.octave, time, 'triangle', 0.12, 0.005, 0.08);
      break;
    }
    case 'pad': {
      const n = getStepNote('pad', step, currentKey, currentScale);
      playTone(n.note, n.octave, time, 'sine', 0.5, 0.05, 0.3);
      break;
    }
    case 'fx':
      playFX(time);
      break;
  }
}

export function playChord(notes: number[], octave: number) {
  initAudio();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  notes.forEach((note) => {
    playTone(note, octave, now, 'triangle', 0.5, 0.02, 0.3);
  });
}

export function playNote(note: number, octave: number) {
  initAudio();
  if (!audioCtx) return;
  playTone(note, octave, audioCtx.currentTime, 'triangle', 0.3, 0.01, 0.2);
}

export function resumeAudioContext() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}
