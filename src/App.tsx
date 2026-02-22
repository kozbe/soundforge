import { useState, useCallback, useEffect, useRef } from 'react';
import { instruments, STEPS, type Preset } from './data/instruments';
import { initAudio, playNote, playInstrument, getAudioContext } from './audio/audioEngine';
import { useSequencer } from './hooks/useSequencer';
import { Header } from './components/Header/Header';
import { Visualizer } from './components/Visualizer/Visualizer';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ControlsBar } from './components/ControlsBar/ControlsBar';
import { StepGrid } from './components/StepGrid/StepGrid';
import { Piano } from './components/Piano/Piano';
import styles from './App.module.css';

function createInitialGrid(): Record<string, boolean[]> {
  const g: Record<string, boolean[]> = {};
  instruments.forEach((inst) => {
    g[inst.id] = new Array(STEPS).fill(false);
  });
  return g;
}

function createInitialVolumes(): Record<string, number> {
  const v: Record<string, number> = {};
  instruments.forEach((inst) => {
    v[inst.id] = 0.7;
  });
  return v;
}

function createInitialMuted(): Record<string, boolean> {
  const m: Record<string, boolean> = {};
  instruments.forEach((inst) => {
    m[inst.id] = false;
  });
  return m;
}

export default function App() {
  const [grid, setGrid] = useState(createInitialGrid);
  const [volumes, setVolumes] = useState(createInitialVolumes);
  const [muted, setMuted] = useState(createInitialMuted);
  const [bpm, setBpm] = useState(120);
  const [swing, setSwing] = useState(0);
  const [currentKey, setCurrentKey] = useState(0);
  const [currentScale, setCurrentScale] = useState('Major');
  const [currentOctave, setCurrentOctave] = useState(4);

  // Refs for the sequencer (avoids stale closures)
  const gridRef = useRef(grid);
  const mutedRef = useRef(muted);
  const bpmRef = useRef(bpm);
  const swingRef = useRef(swing);
  const currentKeyRef = useRef(currentKey);
  const currentScaleRef = useRef(currentScale);

  gridRef.current = grid;
  mutedRef.current = muted;
  bpmRef.current = bpm;
  swingRef.current = swing;
  currentKeyRef.current = currentKey;
  currentScaleRef.current = currentScale;

  const { isPlaying, currentStep, toggle, start } = useSequencer({
    gridRef,
    mutedRef,
    bpmRef,
    swingRef,
    currentKeyRef,
    currentScaleRef,
  });

  const handleToggleStep = useCallback(
    (instId: string, step: number) => {
      initAudio();
      setGrid((prev) => {
        const newGrid = { ...prev };
        const newSteps = [...prev[instId]];
        newSteps[step] = !newSteps[step];
        newGrid[instId] = newSteps;

        if (newSteps[step] && !mutedRef.current[instId]) {
          const ctx = getAudioContext();
          if (ctx) {
            playInstrument(instId, ctx.currentTime, step, currentKeyRef.current, currentScaleRef.current);
          }
        }

        return newGrid;
      });
    },
    [],
  );

  const handleVolumeChange = useCallback((instId: string, volume: number) => {
    setVolumes((prev) => ({ ...prev, [instId]: volume }));
  }, []);

  const handleToggleMute = useCallback((instId: string) => {
    setMuted((prev) => ({ ...prev, [instId]: !prev[instId] }));
  }, []);

  const handleClear = useCallback(() => {
    setGrid(createInitialGrid());
  }, []);

  const handleRandom = useCallback(() => {
    const newGrid: Record<string, boolean[]> = {};
    instruments.forEach((inst) => {
      newGrid[inst.id] = new Array(STEPS).fill(false);
      const density = inst.type === 'drum' ? 0.3 : 0.15;
      for (let s = 0; s < STEPS; s++) {
        const boost = s % 4 === 0 ? 0.2 : 0;
        newGrid[inst.id][s] = Math.random() < density + boost;
      }
      if (inst.id === 'kick') newGrid[inst.id][0] = true;
    });
    setGrid(newGrid);
    if (!isPlaying) start();
  }, [isPlaying, start]);

  const handleLoadPreset = useCallback(
    (preset: Preset) => {
      const newGrid = createInitialGrid();
      Object.entries(preset.pattern).forEach(([id, pattern]) => {
        newGrid[id] = pattern.map((v) => !!v);
      });
      setGrid(newGrid);

      if (preset.bpm) setBpm(preset.bpm);
      if (preset.swing !== undefined) setSwing(preset.swing);

      if (!isPlaying) start();
    },
    [isPlaying, start],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const keyboardMap: Record<string, number> = {
      a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6,
      g: 7, y: 8, h: 9, u: 10, j: 11, k: 12,
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        toggle();
        return;
      }

      const noteOffset = keyboardMap[e.key.toLowerCase()];
      if (noteOffset !== undefined && !e.repeat) {
        const note = noteOffset % 12;
        const oct = currentOctave + (noteOffset >= 12 ? 1 : 0);
        playNote(note, oct);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentOctave, toggle]);

  return (
    <div className={styles.app}>
      <Header
        bpm={bpm}
        isPlaying={isPlaying}
        onBpmChange={setBpm}
        onTogglePlay={toggle}
      />
      <Visualizer />
      <div className={styles.main}>
        <Sidebar onLoadPreset={handleLoadPreset} />
        <div className={styles.gridWrapper}>
          <ControlsBar
            currentKey={currentKey}
            currentScale={currentScale}
            swing={swing}
            onKeyChange={setCurrentKey}
            onScaleChange={setCurrentScale}
            onSwingChange={setSwing}
            onClear={handleClear}
            onRandom={handleRandom}
          />
          <div className={styles.gridArea}>
            <StepGrid
              grid={grid}
              volumes={volumes}
              muted={muted}
              currentStep={currentStep}
              onToggleStep={handleToggleStep}
              onVolumeChange={handleVolumeChange}
              onToggleMute={handleToggleMute}
            />
            <Piano
              currentKey={currentKey}
              currentScale={currentScale}
              currentOctave={currentOctave}
              onOctaveChange={setCurrentOctave}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
