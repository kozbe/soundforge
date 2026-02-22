import { useState, useEffect } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  bpm: number;
  isPlaying: boolean;
  onBpmChange: (bpm: number) => void;
  onTogglePlay: () => void;
}

export function Header({ bpm, isPlaying, onBpmChange, onTogglePlay }: HeaderProps) {
  const [inputValue, setInputValue] = useState(String(bpm));

  useEffect(() => {
    setInputValue(String(bpm));
  }, [bpm]);

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>♪</div>
        <h1>
          Sound<span>Forge</span>
        </h1>
      </div>
      <div className={styles.transport}>
        <div className={styles.bpmControl}>
          <label>BPM</label>
          <input
            type="number"
            value={inputValue}
            min={40}
            max={240}
            step={1}
            onChange={(e) => {
              const raw = e.target.value;
              setInputValue(raw);
              const parsed = parseInt(raw);
              if (!isNaN(parsed) && parsed >= 40 && parsed <= 240) {
                onBpmChange(parsed);
              }
            }}
          />
        </div>
        <button
          className={`${styles.transportBtn} ${isPlaying ? styles.playing : ''}`}
          onClick={onTogglePlay}
          title="Play/Stop"
        >
          {isPlaying ? '⏹' : '▶'}
        </button>
      </div>
    </div>
  );
}
