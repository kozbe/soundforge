import { useState, useCallback, useEffect, useRef } from 'react';
import { instruments, STEPS, type Preset } from './data/instruments';
import { initAudio, playInstrument, getAudioContext } from './audio/audioEngine';
import { useSequencer } from './hooks/useSequencer';
import {
  savePattern,
  encodePatternToURL,
  decodePatternFromURL,
  type PatternState,
  type SavedPattern,
} from './utils/patternStorage';
import { Header } from './components/Header/Header';
import { Visualizer } from './components/Visualizer/Visualizer';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ControlsBar } from './components/ControlsBar/ControlsBar';
import { StepGrid } from './components/StepGrid/StepGrid';
import { Piano } from './components/Piano/Piano';
import { SaveModal } from './components/SaveModal/SaveModal';
import { Toast } from './components/Toast/Toast';
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

function getInitialState(): {
  grid: Record<string, boolean[]>;
  volumes: Record<string, number>;
  muted: Record<string, boolean>;
  bpm: number;
  swing: number;
  currentKey: number;
  currentScale: string;
} {
  const fromURL = decodePatternFromURL();
  if (fromURL) {
    // Clean the URL params after loading
    window.history.replaceState({}, '', window.location.pathname);
    return fromURL;
  }
  return {
    grid: createInitialGrid(),
    volumes: createInitialVolumes(),
    muted: createInitialMuted(),
    bpm: 120,
    swing: 0,
    currentKey: 0,
    currentScale: 'Major',
  };
}

export default function App() {
  const [initial] = useState(getInitialState);
  const [grid, setGrid] = useState(initial.grid);
  const [volumes, setVolumes] = useState(initial.volumes);
  const [muted, setMuted] = useState(initial.muted);
  const [bpm, setBpm] = useState(initial.bpm);
  const [swing, setSwing] = useState(initial.swing);
  const [currentKey, setCurrentKey] = useState(initial.currentKey);
  const [currentScale, setCurrentScale] = useState(initial.currentScale);
  const [currentOctave, setCurrentOctave] = useState(4);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Refs for the sequencer (avoids stale closures)
  const gridRef = useRef(grid);
  const mutedRef = useRef(muted);
  const volumesRef = useRef(volumes);
  const bpmRef = useRef(bpm);
  const swingRef = useRef(swing);
  const currentKeyRef = useRef(currentKey);
  const currentScaleRef = useRef(currentScale);

  gridRef.current = grid;
  mutedRef.current = muted;
  volumesRef.current = volumes;
  bpmRef.current = bpm;
  swingRef.current = swing;
  currentKeyRef.current = currentKey;
  currentScaleRef.current = currentScale;

  const { isPlaying, currentStep, toggle, start } = useSequencer({
    gridRef,
    mutedRef,
    volumesRef,
    bpmRef,
    swingRef,
    currentKeyRef,
    currentScaleRef,
  });

  const getCurrentState = useCallback((): PatternState => ({
    grid,
    volumes,
    muted,
    bpm,
    swing,
    currentKey,
    currentScale,
  }), [grid, volumes, muted, bpm, swing, currentKey, currentScale]);

  const loadPatternState = useCallback((state: PatternState) => {
    setGrid(state.grid);
    setVolumes(state.volumes);
    setMuted(state.muted);
    setBpm(state.bpm);
    setSwing(state.swing);
    setCurrentKey(state.currentKey);
    setCurrentScale(state.currentScale);
  }, []);

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
            playInstrument(instId, ctx.currentTime, step, currentKeyRef.current, currentScaleRef.current, volumesRef.current[instId]);
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

  // Save / Share handlers
  const handleSave = useCallback((name: string) => {
    savePattern(name, getCurrentState());
    setToast('Pattern saved!');
    setShowSaveModal(false);
  }, [getCurrentState]);

  const handleLoadSaved = useCallback((pattern: SavedPattern) => {
    loadPatternState(pattern);
    setShowSaveModal(false);
    setToast(`Loaded "${pattern.name}"`);
    if (!isPlaying) start();
  }, [loadPatternState, isPlaying, start]);

  const handleShare = useCallback(() => {
    const url = encodePatternToURL(getCurrentState());
    navigator.clipboard.writeText(url).then(
      () => setToast('Share link copied to clipboard!'),
      () => setToast('Share link generated (could not copy)'),
    );
  }, [getCurrentState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

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
        <Sidebar onLoadPreset={handleLoadPreset} grid={grid} />
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
            onSave={() => setShowSaveModal(true)}
            onShare={handleShare}
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
      {showSaveModal && (
        <SaveModal
          onClose={() => setShowSaveModal(false)}
          onSave={handleSave}
          onLoad={handleLoadSaved}
        />
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
