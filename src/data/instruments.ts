export interface Instrument {
  id: string;
  name: string;
  color: string;
  type: 'drum' | 'tone' | 'fx';
}

export const STEPS = 16;

export const instruments: Instrument[] = [
  { id: 'kick', name: 'Kick', color: 'var(--kick)', type: 'drum' },
  { id: 'snare', name: 'Snare', color: 'var(--snare)', type: 'drum' },
  { id: 'hihat', name: 'HiHat', color: 'var(--hihat)', type: 'drum' },
  { id: 'bass', name: 'Bass', color: 'var(--bass)', type: 'tone' },
  { id: 'synth1', name: 'Synth1', color: 'var(--synth1)', type: 'tone' },
  { id: 'synth2', name: 'Synth2', color: 'var(--synth2)', type: 'tone' },
  { id: 'pad', name: 'Pad', color: 'var(--pad)', type: 'tone' },
  { id: 'fx', name: 'FX', color: 'var(--fx)', type: 'fx' },
];

export interface Preset {
  name: string;
  desc: string;
  pattern: Record<string, number[]>;
  bpm?: number;
  swing?: number;
}

export const presets: Preset[] = [
  {
    name: 'Basic Rock',
    desc: 'Classic rock pattern: kick-snare with 8th note hi-hats',
    pattern: {
      kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      hihat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    },
  },
  {
    name: 'House',
    desc: 'Four-on-the-floor kick with offbeat hi-hats',
    pattern: {
      kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      hihat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      bass: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    },
  },
  {
    name: 'Hip Hop',
    desc: 'Boom bap pattern with swing feel',
    pattern: {
      kick: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      hihat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    },
    swing: 40,
  },
  {
    name: 'Lo-fi Chill',
    desc: 'Relaxed beat with pad and synth layers',
    pattern: {
      kick: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      hihat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
      pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      synth1: [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    },
    bpm: 85,
    swing: 30,
  },
  {
    name: 'Drum & Bass',
    desc: 'Fast breakbeat with rolling bass',
    pattern: {
      kick: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
      hihat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      bass: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    },
    bpm: 174,
  },
  {
    name: 'Techno',
    desc: 'Driving 4/4 with synth stabs',
    pattern: {
      kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      hihat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      synth1: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      bass: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
      fx: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    },
    bpm: 130,
  },
];

export interface LearnItem {
  title: string;
  tag: string;
  summary: string;
  detail: string;
}

export const learnContent: LearnItem[] = [
  {
    title: 'What is a Beat?',
    tag: 'Basics',
    summary: 'A beat is the basic unit of time in music — like a pulse or heartbeat.',
    detail: `<strong>The grid above has 16 steps</strong> = one "bar" of music. Each row of 4 steps = one beat. At 120 BPM, each beat lasts 0.5 seconds.\n\n<strong>Try this:</strong> Click every 1st cell in the Kick row (steps 1, 5, 9, 13) for a classic "four on the floor" pattern. This is the foundation of house and dance music!`,
  },
  {
    title: 'Rhythm Patterns',
    tag: 'Rhythm',
    summary: 'Different combinations of beats and rests create different grooves.',
    detail: `<strong>Kick on 1 & 3, Snare on 2 & 4</strong> = basic rock beat. The snare on beats 2 and 4 is called the "backbeat" — it's what makes you nod your head.\n\n<strong>Hi-hats</strong> fill in the gaps and add energy. Try them on every step (1/16th notes) or every other step (1/8th notes) for different feels.\n\n<strong>Swing</strong> makes notes slightly uneven — giving a jazzy, bouncy feel. Try the swing slider!`,
  },
  {
    title: 'What is BPM?',
    tag: 'Tempo',
    summary: 'Beats Per Minute — how fast or slow your music plays.',
    detail: `<strong>Common BPM ranges:</strong>\n• 60-80: Chill, lo-fi, ballads\n• 90-110: Hip hop, R&B\n• 120-130: House, pop\n• 140-160: Drum & bass, dubstep\n• 170+: Jungle, speedcore\n\nTry changing the BPM while playing to feel the difference!`,
  },
  {
    title: 'Keys & Scales',
    tag: 'Theory',
    summary: 'A scale is a set of notes that sound good together. The key tells you which note is "home."',
    detail: `<strong>Major scales</strong> sound happy and bright. <strong>Minor scales</strong> sound sad or moody.\n\nThe orange dots on the piano show which notes are in the current scale. Try playing only the orange-dotted keys — they'll always sound good together!\n\n<strong>Pentatonic</strong> (5 notes) is the easiest scale to improvise with — almost impossible to hit a "wrong" note.`,
  },
  {
    title: 'What are Chords?',
    tag: 'Theory',
    summary: 'A chord is 3+ notes played at the same time, creating harmony.',
    detail: `<strong>The chord buttons below the piano</strong> show chords that fit in your chosen key/scale.\n\n<strong>Roman numerals (I, ii, IV, V)</strong> show the chord's position. Uppercase = major (happy), lowercase = minor (sad).\n\n<strong>Try this progression:</strong> Click I → V → vi → IV. This is the most popular chord progression in pop music! ("Let It Go", "No Woman No Cry", etc.)`,
  },
  {
    title: 'Layering Sounds',
    tag: 'Production',
    summary: 'Great beats come from layering different instruments with different roles.',
    detail: `<strong>Think in layers:</strong>\n• <strong>Kick</strong>: The foundation, the thump\n• <strong>Snare</strong>: The crack, provides rhythm\n• <strong>Hi-hat</strong>: Energy and movement\n• <strong>Bass</strong>: Low frequency, adds depth\n• <strong>Synth</strong>: Melody and color\n• <strong>Pad</strong>: Atmosphere, fills space\n\nStart with drums, then add bass, then melody. Less is often more!`,
  },
  {
    title: 'Muting & Volume',
    tag: 'Mix',
    summary: 'Control the balance of your instruments with volume and mute.',
    detail: `<strong>Use the volume sliders</strong> on each row to balance your mix. Not everything should be at max volume!\n\n<strong>Muting</strong> (🔊 button) lets you temporarily silence a track to hear how the others sound together. Producers call this "soloing" — mute everything except one track to hear it clearly.\n\n<strong>Tip:</strong> If something sounds muddy, try turning down the volume rather than removing notes.`,
  },
];

export interface TipItem {
  title: string;
  text: string;
}

export const tipsContent: TipItem[] = [
  {
    title: '🎯 Start Simple',
    text: 'Begin with just kick and snare. Add hi-hats next. Then layer in bass and melody. Building complexity step by step creates better results than filling everything at once.',
  },
  {
    title: '🎵 The Rule of Repetition',
    text: 'Music needs patterns. Humans enjoy predictability with small surprises. Make a basic 4-beat pattern, then change just 1-2 cells on the repeat for variation.',
  },
  {
    title: '🔇 Space is Music',
    text: 'Empty cells matter! Silence creates rhythm just as much as sound. If something sounds cluttered, try removing notes rather than adding more.',
  },
  {
    title: '🎹 Keyboard Shortcuts',
    text: 'Press Space to play/stop. Use A through L keys to play the piano. This lets you quickly test melodies and ideas without clicking.',
  },
  {
    title: '🎲 Happy Accidents',
    text: 'Click the random button to generate patterns, then edit what you hear. Often the best music comes from modifying random ideas rather than starting from scratch.',
  },
  {
    title: '📐 Quantization',
    text: 'The grid is "quantized" — everything snaps to exact time divisions. This is why sequenced music sounds tight and precise. The swing control adds human-like imperfection.',
  },
];
