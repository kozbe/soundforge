import { tipsContent } from '../../data/instruments';
import styles from './Sidebar.module.css';

export function TipsTab() {
  return (
    <>
      {tipsContent.map((tip, i) => (
        <div key={i} className={styles.learnCard}>
          <h3>{tip.title}</h3>
          <p>{tip.text}</p>
        </div>
      ))}
    </>
  );
}
