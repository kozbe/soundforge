import { NOTE_NAMES, SCALES } from '../../data/musicTheory';
import styles from './ControlsBar.module.css';

interface ControlsBarProps {
  currentKey: number;
  currentScale: string;
  swing: number;
  onKeyChange: (key: number) => void;
  onScaleChange: (scale: string) => void;
  onSwingChange: (swing: number) => void;
  onClear: () => void;
  onRandom: () => void;
  onSave: () => void;
  onShare: () => void;
}

export function ControlsBar({
  currentKey,
  currentScale,
  swing,
  onKeyChange,
  onScaleChange,
  onSwingChange,
  onClear,
  onRandom,
  onSave,
  onShare,
}: ControlsBarProps) {
  return (
    <div className={styles.controlsBar}>
      <div className={styles.controlGroup}>
        <label>Key</label>
        <select
          className={styles.controlSelect}
          value={currentKey}
          onChange={(e) => onKeyChange(parseInt(e.target.value))}
        >
          {NOTE_NAMES.map((name, i) => (
            <option key={i} value={i}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.controlGroup}>
        <label>Scale</label>
        <select
          className={styles.controlSelect}
          value={currentScale}
          onChange={(e) => onScaleChange(e.target.value)}
        >
          {Object.keys(SCALES).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.controlGroup}>
        <label>Swing</label>
        <input
          type="range"
          className={styles.volSlider}
          min={0}
          max={80}
          value={swing}
          onChange={(e) => onSwingChange(parseInt(e.target.value))}
          style={{ width: 80 }}
        />
        <span className={styles.swingVal}>{swing}%</span>
      </div>
      <button className={`${styles.clearBtn} ${styles.actionBtn}`} onClick={onSave}>
        Save
      </button>
      <button className={`${styles.clearBtn} ${styles.actionBtn} ${styles.shareBtn}`} onClick={onShare}>
        Share
      </button>
      <button className={styles.clearBtn} onClick={onClear}>
        Clear All
      </button>
      <button className={`${styles.clearBtn} ${styles.randomBtn}`} onClick={onRandom}>
        🎲 Random
      </button>
    </div>
  );
}
