import { useEffect, useState } from 'react';
import { playNote } from '../audio/audioEngine';

export const pianoKeyMap: Record<string, number> = {
  a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6,
  g: 7, y: 8, h: 9, u: 10, j: 11, k: 12,
};

export function usePianoKeyboard(currentOctave: number) {
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const idx = pianoKeyMap[e.key.toLowerCase()];
      if (idx !== undefined) {
        const note = idx % 12;
        const oct = currentOctave + (idx >= 12 ? 1 : 0);
        playNote(note, oct);
        setPressedKeys((prev) => new Set(prev).add(idx));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const idx = pianoKeyMap[e.key.toLowerCase()];
      if (idx !== undefined) {
        setPressedKeys((prev) => {
          const next = new Set(prev);
          next.delete(idx);
          return next;
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentOctave]);

  return pressedKeys;
}
