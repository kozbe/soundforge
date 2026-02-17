import { useCallback } from 'react';
import { NOTE_NAMES, getScaleNotes, getChords } from '../../data/musicTheory';
import { playNote, playChord } from '../../audio/audioEngine';
import styles from './Piano.module.css';

interface PianoProps {
  currentKey: number;
  currentScale: string;
  currentOctave: number;
  onOctaveChange: (octave: number) => void;
}

export function Piano({ currentKey, currentScale, currentOctave, onOctaveChange }: PianoProps) {
  const scaleNotes = getScaleNotes(currentKey, currentScale);
  const chords = getChords(currentKey, currentScale);

  const handleKeyClick = useCallback(
    (noteIdx: number, octave: number) => {
      playNote(noteIdx, octave);
    },
    [],
  );

  const handleChordClick = useCallback(
    (notes: number[]) => {
      playChord(notes, currentOctave);
    },
    [currentOctave],
  );

  const pianoKeys: React.ReactNode[] = [];
  for (let i = 0; i < 13; i++) {
    const noteIdx = i % 12;
    const isBlack = [1, 3, 6, 8, 10].includes(noteIdx);
    const inScale = scaleNotes.includes(noteIdx);
    const octave = currentOctave + (i >= 12 ? 1 : 0);

    pianoKeys.push(
      <div
        key={i}
        className={`${styles.pianoKey} ${isBlack ? styles.black : styles.white} ${inScale ? styles.inScale : ''}`}
        onMouseDown={() => handleKeyClick(noteIdx, octave)}
      >
        {!isBlack && NOTE_NAMES[noteIdx]}
      </div>,
    );
  }

  return (
    <div className={styles.pianoSection}>
      <div className={styles.pianoHeader}>
        <h3>
          🎹 Keyboard
          <span className={styles.headerSubtext}>— click or use keys A-L</span>
        </h3>
        <div className={styles.controlGroup}>
          <label>Octave</label>
          <select
            className={styles.controlSelect}
            value={currentOctave}
            onChange={(e) => onOctaveChange(parseInt(e.target.value))}
          >
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
      </div>
      <div className={styles.pianoKeys}>{pianoKeys}</div>
      <div className={styles.chordDisplay}>
        {chords.map((chord, i) => (
          <button
            key={i}
            className={styles.chordBtn}
            onClick={() => handleChordClick(chord.notes)}
          >
            {chord.name}
            <span className={styles.roman}>{chord.roman}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
