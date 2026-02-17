import { STEPS } from '../../data/instruments';
import styles from './StepGrid.module.css';

export function BeatMarkers() {
  return (
    <div className={styles.beatMarkers}>
      {Array.from({ length: STEPS }, (_, i) => (
        <div
          key={i}
          className={`${styles.beatMarker} ${i % 4 === 0 ? styles.downbeat : ''}`}
        >
          {i % 4 === 0 ? i / 4 + 1 : '·'}
        </div>
      ))}
    </div>
  );
}
