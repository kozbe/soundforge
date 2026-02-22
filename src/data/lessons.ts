export interface Challenge {
  id: string;
  instruction: string;
  hint: string;
  validate: (grid: Record<string, boolean[]>) => boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  challenges: Challenge[];
}

export const lessons: Lesson[] = [
  {
    id: 'lesson1',
    title: 'Lesson 1: Your First Beat',
    description: 'Build a classic drum pattern step by step and learn the basics of rhythm.',
    challenges: [
      {
        id: 'l1c1',
        instruction: 'Place the kick drum on step 1 — the downbeat.',
        hint: 'Click the very first cell in the Kick row.',
        validate: (grid) => grid['kick']?.[0] === true,
      },
      {
        id: 'l1c2',
        instruction: 'Four on the floor: kick on beats 1, 2, 3 & 4 (steps 1, 5, 9, 13).',
        hint: 'Click every 4th cell in the Kick row starting from step 1.',
        validate: (grid) =>
          !!(grid['kick']?.[0] && grid['kick']?.[4] && grid['kick']?.[8] && grid['kick']?.[12]),
      },
      {
        id: 'l1c3',
        instruction: 'Add the backbeat: snare on beats 2 & 4 (steps 5 and 13).',
        hint: 'Click cells 5 and 13 in the Snare row while keeping your kick pattern.',
        validate: (grid) =>
          !!(
            grid['kick']?.[0] &&
            grid['kick']?.[4] &&
            grid['kick']?.[8] &&
            grid['kick']?.[12] &&
            grid['snare']?.[4] &&
            grid['snare']?.[12]
          ),
      },
    ],
  },
  {
    id: 'lesson2',
    title: 'Lesson 2: Hi-Hat Grooves',
    description: 'Add energy and movement with hi-hat patterns layered over your drum foundation.',
    challenges: [
      {
        id: 'l2c1',
        instruction: 'Off-beat hi-hats: place hi-hat on steps 3, 7, 11, and 15.',
        hint: 'Click every 4th cell in the HiHat row, starting from step 3.',
        validate: (grid) =>
          !!(
            grid['hihat']?.[2] &&
            grid['hihat']?.[6] &&
            grid['hihat']?.[10] &&
            grid['hihat']?.[14]
          ),
      },
      {
        id: 'l2c2',
        instruction: '16th note hi-hats: fill every step in the HiHat row.',
        hint: 'Click all 16 cells in the HiHat row.',
        validate: (grid) => grid['hihat']?.every(Boolean) === true,
      },
      {
        id: 'l2c3',
        instruction: 'Complete groove: four-on-the-floor kick, backbeat snare, and any hi-hats.',
        hint: 'Combine the kick and snare from Lesson 1 with at least one hi-hat step.',
        validate: (grid) =>
          !!(
            grid['kick']?.[0] &&
            grid['kick']?.[4] &&
            grid['kick']?.[8] &&
            grid['kick']?.[12] &&
            grid['snare']?.[4] &&
            grid['snare']?.[12] &&
            grid['hihat']?.some(Boolean)
          ),
      },
    ],
  },
  {
    id: 'lesson3',
    title: 'Lesson 3: Add Melody & Bass',
    description: 'Elevate your beat with bass lines and synth melodies for a full production feel.',
    challenges: [
      {
        id: 'l3c1',
        instruction: 'Add a bass note on step 1 (the downbeat).',
        hint: 'Click the first cell in the Bass row.',
        validate: (grid) => grid['bass']?.[0] === true,
      },
      {
        id: 'l3c2',
        instruction: 'Bass line: place at least 4 bass notes across the pattern.',
        hint: 'Click 4 or more cells in the Bass row to create a moving bass line.',
        validate: (grid) => (grid['bass']?.filter(Boolean).length ?? 0) >= 4,
      },
      {
        id: 'l3c3',
        instruction: 'Full production: kick, snare, hi-hat, bass, and a synth melody all active.',
        hint: 'Make sure every instrument type has at least one active step.',
        validate: (grid) =>
          !!(
            grid['kick']?.some(Boolean) &&
            grid['snare']?.some(Boolean) &&
            grid['hihat']?.some(Boolean) &&
            grid['bass']?.some(Boolean) &&
            (grid['synth1']?.some(Boolean) || grid['synth2']?.some(Boolean))
          ),
      },
    ],
  },
];
