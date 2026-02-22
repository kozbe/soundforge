export const NOTE_NAMES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
];

export const SCALES: Record<string, number[]> = {
  Major: [0, 2, 4, 5, 7, 9, 11],
  Minor: [0, 2, 3, 5, 7, 8, 10],
  Pentatonic: [0, 2, 4, 7, 9],
  Blues: [0, 3, 5, 6, 7, 10],
  Dorian: [0, 2, 3, 5, 7, 9, 10],
  Mixolydian: [0, 2, 4, 5, 7, 9, 10],
  'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
  Phrygian: [0, 1, 3, 5, 7, 8, 10],
};

export function getScaleNotes(key: number, scaleName: string): number[] {
  const intervals = SCALES[scaleName];
  return intervals.map((i) => (key + i) % 12);
}

export function noteFreq(note: number, octave: number): number {
  return 440 * Math.pow(2, (note - 9 + (octave - 4) * 12) / 12);
}

export interface Chord {
  name: string;
  roman: string;
  notes: number[];
}

export function getChords(key: number, scaleName: string): Chord[] {
  const scale = SCALES[scaleName];
  const romanMajor = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const romanMinor = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];
  const chords: Chord[] = [];

  for (let i = 0; i < scale.length; i++) {
    const root = (key + scale[i]) % 12;
    const thirdIdx = (i + 2) % scale.length;
    const fifthIdx = (i + 4) % scale.length;

    const third = (key + scale[thirdIdx]) % 12;
    const fifth = (key + scale[fifthIdx]) % 12;

    const thirdInterval = (third - root + 12) % 12;
    const isMinor = thirdInterval === 3;
    const isDim = thirdInterval === 3 && (fifth - root + 12) % 12 === 6;

    chords.push({
      name: NOTE_NAMES[root] + (isDim ? 'dim' : isMinor ? 'm' : ''),
      roman: isDim
        ? romanMinor[i] + '°'
        : isMinor
          ? romanMinor[i]
          : romanMajor[i],
      notes: [root, third, fifth],
    });
  }
  return chords;
}

export function getStepNote(
  instId: string,
  step: number,
  currentKey: number,
  currentScale: string,
): { note: number; octave: number } {
  const scaleNotes = getScaleNotes(currentKey, currentScale);
  const numNotes = scaleNotes.length;

  switch (instId) {
    case 'bass':
      return { note: scaleNotes[step % numNotes], octave: 2 };
    case 'synth1':
      return { note: scaleNotes[step % numNotes], octave: 4 };
    case 'synth2':
      return { note: scaleNotes[(step * 2) % numNotes], octave: 4 };
    case 'pad':
      return { note: scaleNotes[Math.floor(step / 4) % numNotes], octave: 3 };
    default:
      return { note: scaleNotes[0], octave: 4 };
  }
}
