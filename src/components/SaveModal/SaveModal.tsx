import { useState, useEffect, useCallback } from 'react';
import {
  getSavedPatterns,
  deletePattern,
  type SavedPattern,
} from '../../utils/patternStorage';
import styles from './SaveModal.module.css';

interface SaveModalProps {
  onClose: () => void;
  onSave: (name: string) => void;
  onLoad: (pattern: SavedPattern) => void;
}

export function SaveModal({ onClose, onSave, onLoad }: SaveModalProps) {
  const [name, setName] = useState('');
  const [patterns, setPatterns] = useState<SavedPattern[]>([]);

  const refreshPatterns = useCallback(() => {
    setPatterns(getSavedPatterns());
  }, []);

  useEffect(() => {
    refreshPatterns();
  }, [refreshPatterns]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
    setName('');
    refreshPatterns();
  };

  const handleDelete = (id: string) => {
    deletePattern(id);
    refreshPatterns();
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Save / Load Patterns</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.saveSection}>
          <input
            className={styles.nameInput}
            type="text"
            placeholder="Pattern name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
            maxLength={40}
          />
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save Current
          </button>
        </div>

        <div className={styles.list}>
          {patterns.length === 0 ? (
            <div className={styles.empty}>No saved patterns yet</div>
          ) : (
            patterns.map((p) => (
              <div key={p.id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{p.name}</div>
                  <div className={styles.itemMeta}>
                    {p.bpm} BPM · {formatDate(p.createdAt)}
                  </div>
                </div>
                <div className={styles.itemActions}>
                  <button className={styles.loadBtn} onClick={() => onLoad(p)}>
                    Load
                  </button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)}>
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
