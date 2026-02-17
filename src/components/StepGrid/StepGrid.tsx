import { instruments } from '../../data/instruments';
import { BeatMarkers } from './BeatMarkers';
import { InstrumentRow } from './InstrumentRow';

interface StepGridProps {
  grid: Record<string, boolean[]>;
  volumes: Record<string, number>;
  muted: Record<string, boolean>;
  currentStep: number;
  onToggleStep: (instId: string, step: number) => void;
  onVolumeChange: (instId: string, volume: number) => void;
  onToggleMute: (instId: string) => void;
}

export function StepGrid({
  grid,
  volumes,
  muted,
  currentStep,
  onToggleStep,
  onVolumeChange,
  onToggleMute,
}: StepGridProps) {
  return (
    <div>
      <BeatMarkers />
      {instruments.map((inst) => (
        <InstrumentRow
          key={inst.id}
          instrument={inst}
          steps={grid[inst.id]}
          volume={volumes[inst.id]}
          muted={muted[inst.id]}
          currentStep={currentStep}
          onToggleStep={onToggleStep}
          onVolumeChange={onVolumeChange}
          onToggleMute={onToggleMute}
        />
      ))}
    </div>
  );
}
