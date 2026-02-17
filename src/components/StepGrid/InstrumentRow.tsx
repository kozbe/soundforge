import { useCallback } from 'react';
import type { Instrument } from '../../data/instruments';
import { STEPS } from '../../data/instruments';
import styles from './StepGrid.module.css';

interface InstrumentRowProps {
  instrument: Instrument;
  steps: boolean[];
  volume: number;
  muted: boolean;
  currentStep: number;
  onToggleStep: (instId: string, step: number) => void;
  onVolumeChange: (instId: string, volume: number) => void;
  onToggleMute: (instId: string) => void;
}

export function InstrumentRow({
  instrument,
  steps,
  volume,
  muted,
  currentStep,
  onToggleStep,
  onVolumeChange,
  onToggleMute,
}: InstrumentRowProps) {
  const handleCellClick = useCallback(
    (step: number) => {
      onToggleStep(instrument.id, step);
    },
    [instrument.id, onToggleStep],
  );

  const cells: React.ReactNode[] = [];
  for (let s = 0; s < STEPS; s++) {
    if (s > 0 && s % 4 === 0) {
      cells.push(<div key={`div-${s}`} className={styles.sectionDivider} />);
    }

    const isActive = steps[s];
    const isPlayingCol = currentStep === s;

    cells.push(
      <div
        key={s}
        className={`${styles.beatCell} ${isActive ? styles.active : ''} ${isPlayingCol ? styles.playingCol : ''}`}
        style={
          isActive
            ? {
                background: instrument.color,
                boxShadow: `0 0 8px ${instrument.color}40`,
              }
            : undefined
        }
        onMouseDown={() => handleCellClick(s)}
      />,
    );
  }

  return (
    <div className={styles.instrumentRow}>
      <div className={styles.instrumentLabel}>
        <span
          className={styles.instrumentDot}
          style={{ background: instrument.color }}
        />
        {instrument.name}
      </div>
      {cells}
      <div className={styles.instrumentControls}>
        <input
          type="range"
          className={styles.volSlider}
          min={0}
          max={100}
          value={volume * 100}
          onChange={(e) => onVolumeChange(instrument.id, parseInt(e.target.value) / 100)}
        />
        <button
          className={`${styles.muteBtn} ${muted ? styles.muted : ''}`}
          onClick={() => onToggleMute(instrument.id)}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>
    </div>
  );
}
