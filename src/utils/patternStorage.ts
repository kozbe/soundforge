import { instruments, STEPS } from '../data/instruments';

const STORAGE_KEY = 'soundforge_patterns';

export interface SavedPattern {
  id: string;
  name: string;
  createdAt: number;
  grid: Record<string, boolean[]>;
  volumes: Record<string, number>;
  muted: Record<string, boolean>;
  bpm: number;
  swing: number;
  currentKey: number;
  currentScale: string;
}

export type PatternState = Omit<SavedPattern, 'id' | 'name' | 'createdAt'>;

// --- localStorage ---

export function getSavedPatterns(): SavedPattern[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePattern(name: string, state: PatternState): SavedPattern {
  const patterns = getSavedPatterns();
  const saved: SavedPattern = {
    ...state,
    id: crypto.randomUUID(),
    name,
    createdAt: Date.now(),
  };
  patterns.unshift(saved);
  // Keep max 20 patterns
  if (patterns.length > 20) patterns.length = 20;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patterns));
  return saved;
}

export function deletePattern(id: string): void {
  const patterns = getSavedPatterns().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patterns));
}

// --- URL encoding ---
// Compact format: grid is encoded as hex per instrument, settings as short params

function gridToHex(grid: Record<string, boolean[]>): string {
  return instruments
    .map((inst) => {
      const bits = grid[inst.id] || new Array(STEPS).fill(false);
      // 16 bits → 4 hex chars
      let num = 0;
      for (let i = 0; i < STEPS; i++) {
        if (bits[i]) num |= 1 << i;
      }
      return num.toString(16).padStart(4, '0');
    })
    .join('');
}

function hexToGrid(hex: string): Record<string, boolean[]> {
  const grid: Record<string, boolean[]> = {};
  instruments.forEach((inst, idx) => {
    const chunk = hex.slice(idx * 4, idx * 4 + 4);
    const num = parseInt(chunk, 16);
    grid[inst.id] = new Array(STEPS).fill(false).map((_, i) => !!(num & (1 << i)));
  });
  return grid;
}

export function encodePatternToURL(state: PatternState): string {
  const params = new URLSearchParams();
  params.set('g', gridToHex(state.grid));
  params.set('b', String(state.bpm));
  params.set('s', String(state.swing));
  params.set('k', String(state.currentKey));
  params.set('sc', state.currentScale);

  // Encode volumes only if non-default (0.7)
  const volEntries = instruments
    .filter((inst) => Math.abs(state.volumes[inst.id] - 0.7) > 0.01)
    .map((inst) => `${inst.id}:${state.volumes[inst.id].toFixed(2)}`);
  if (volEntries.length > 0) {
    params.set('v', volEntries.join(','));
  }

  // Encode muted only if any are muted
  const mutedIds = instruments.filter((inst) => state.muted[inst.id]).map((inst) => inst.id);
  if (mutedIds.length > 0) {
    params.set('m', mutedIds.join(','));
  }

  const base = window.location.origin + window.location.pathname;
  return `${base}?${params.toString()}`;
}

export function decodePatternFromURL(): PatternState | null {
  const params = new URLSearchParams(window.location.search);
  const gridHex = params.get('g');
  if (!gridHex || gridHex.length !== instruments.length * 4) return null;

  const bpm = parseInt(params.get('b') || '120');
  const swing = parseInt(params.get('s') || '0');
  const currentKey = parseInt(params.get('k') || '0');
  const currentScale = params.get('sc') || 'Major';

  const grid = hexToGrid(gridHex);

  // Volumes
  const volumes: Record<string, number> = {};
  instruments.forEach((inst) => {
    volumes[inst.id] = 0.7;
  });
  const volStr = params.get('v');
  if (volStr) {
    volStr.split(',').forEach((entry) => {
      const [id, val] = entry.split(':');
      if (id && val) volumes[id] = parseFloat(val);
    });
  }

  // Muted
  const muted: Record<string, boolean> = {};
  instruments.forEach((inst) => {
    muted[inst.id] = false;
  });
  const mutedStr = params.get('m');
  if (mutedStr) {
    mutedStr.split(',').forEach((id) => {
      if (id) muted[id] = true;
    });
  }

  return { grid, volumes, muted, bpm, swing, currentKey, currentScale };
}
