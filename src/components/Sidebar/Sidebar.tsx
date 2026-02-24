import { useState } from 'react';
import type { Preset } from '../../data/instruments';
import { LearnTab } from './LearnTab';
import { PresetsTab } from './PresetsTab';
import { TipsTab } from './TipsTab';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onLoadPreset: (preset: Preset) => void;
  grid: Record<string, boolean[]>;
}

type Tab = 'learn' | 'presets' | 'tips';

export function Sidebar({ onLoadPreset, grid }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>('learn');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'learn', label: 'Learn' },
    { id: 'presets', label: 'Presets' },
    { id: 'tips', label: 'Tips' },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarTabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.sidebarTab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.sidebarContent}>
        {activeTab === 'learn' && <LearnTab grid={grid} />}
        {activeTab === 'presets' && <PresetsTab onLoadPreset={onLoadPreset} />}
        {activeTab === 'tips' && <TipsTab />}
      </div>
    </div>
  );
}
