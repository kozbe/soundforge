import styles from './Header.module.css';

interface HeaderProps {
  bpm: number;
  isPlaying: boolean;
  onBpmChange: (bpm: number) => void;
  onTogglePlay: () => void;
}

export function Header({ bpm, isPlaying, onBpmChange, onTogglePlay }: HeaderProps) {
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
            value={bpm}
            min={40}
            max={240}
            step={1}
            onChange={(e) => {
              const val = Math.max(40, Math.min(240, parseInt(e.target.value) || 120));
              onBpmChange(val);
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
