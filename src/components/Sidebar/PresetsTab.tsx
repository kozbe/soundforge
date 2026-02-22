import { presets, type Preset } from '../../data/instruments';
import styles from './Sidebar.module.css';

interface PresetsTabProps {
  onLoadPreset: (preset: Preset) => void;
}

export function PresetsTab({ onLoadPreset }: PresetsTabProps) {
  return (
    <>
      {presets.map((preset, i) => (
        <button
          key={i}
          className={styles.presetBtn}
          onClick={() => onLoadPreset(preset)}
        >
          {preset.name}
          <span>{preset.desc}</span>
        </button>
      ))}
    </>
  );
}
