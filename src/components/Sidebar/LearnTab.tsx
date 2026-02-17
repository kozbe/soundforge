import { useState } from 'react';
import { learnContent } from '../../data/instruments';
import styles from './Sidebar.module.css';

export function LearnTab() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <>
      {learnContent.map((item, i) => (
        <div
          key={i}
          className={`${styles.learnCard} ${expandedIdx === i ? styles.expanded : ''}`}
          onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
        >
          <h3>
            {item.title} <span className={styles.tag}>{item.tag}</span>
          </h3>
          <p>{item.summary}</p>
          <div
            className={styles.detail}
            dangerouslySetInnerHTML={{ __html: item.detail.replace(/\n/g, '<br>') }}
          />
        </div>
      ))}
    </>
  );
}
