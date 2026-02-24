import { useState, useEffect } from 'react';
import { lessons } from '../../data/lessons';
import {
  getLessonProgress,
  saveLessonProgress,
  resetLessonProgress,
  type LessonProgress,
} from '../../utils/lessonStorage';
import styles from './Sidebar.module.css';

interface LearnTabProps {
  grid: Record<string, boolean[]>;
}

export function LearnTab({ grid }: LearnTabProps) {
  const [progress, setProgress] = useState<LessonProgress>(getLessonProgress);
  const [expandedLesson, setExpandedLesson] = useState<string | null>('lesson1');

  // Auto-complete challenges whenever the grid changes
  useEffect(() => {
    setProgress((prev) => {
      let updated = false;
      const newCompleted = [...prev.completedChallenges];

      for (const lesson of lessons) {
        for (const challenge of lesson.challenges) {
          if (!newCompleted.includes(challenge.id) && challenge.validate(grid)) {
            newCompleted.push(challenge.id);
            updated = true;
          }
        }
      }

      if (!updated) return prev;

      const next: LessonProgress = { completedChallenges: newCompleted };
      saveLessonProgress(next);
      return next;
    });
  }, [grid]);

  const isCompleted = (challengeId: string) =>
    progress.completedChallenges.includes(challengeId);

  const isLessonComplete = (lessonId: string) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    return lesson?.challenges.every((c) => isCompleted(c.id)) ?? false;
  };

  const isLessonUnlocked = (lessonIdx: number) => {
    if (lessonIdx === 0) return true;
    return isLessonComplete(lessons[lessonIdx - 1].id);
  };

  const allChallengeIds = new Set(lessons.flatMap((l) => l.challenges.map((c) => c.id)));
  const totalChallenges = allChallengeIds.size;
  const completedCount = progress.completedChallenges.filter((id) => allChallengeIds.has(id)).length;

  const handleReset = () => {
    resetLessonProgress();
    setProgress({ completedChallenges: [] });
  };

  return (
    <div className={styles.lessonContainer}>
      <div className={styles.lessonProgressHeader}>
        <span className={styles.lessonProgressLabel}>Progress</span>
        <span className={styles.lessonProgressCount}>
          {completedCount}/{totalChallenges} challenges
        </span>
      </div>
      <div className={styles.lessonProgressBar}>
        <div
          className={styles.lessonProgressFill}
          style={{ width: `${totalChallenges > 0 ? Math.min((completedCount / totalChallenges) * 100, 100) : 0}%` }}
        />
      </div>

      <div className={styles.lessonList}>
        {lessons.map((lesson, idx) => {
          const unlocked = isLessonUnlocked(idx);
          const lessonDone = isLessonComplete(lesson.id);
          const expanded = expandedLesson === lesson.id && unlocked;

          return (
            <div
              key={lesson.id}
              className={`${styles.lessonCard} ${lessonDone ? styles.lessonDone : ''} ${!unlocked ? styles.lessonLocked : ''}`}
            >
              <button
                className={styles.lessonHeader}
                onClick={() => {
                  if (!unlocked) return;
                  setExpandedLesson(expanded ? null : lesson.id);
                }}
                disabled={!unlocked}
              >
                <span className={styles.lessonTitleText}>{lesson.title}</span>
                <span className={styles.lessonHeaderRight}>
                  {!unlocked && <span className={styles.lockIcon}>LOCKED</span>}
                  {lessonDone && <span className={styles.doneIcon}>DONE</span>}
                  {unlocked && !lessonDone && (
                    <span className={styles.chevron}>{expanded ? '▲' : '▼'}</span>
                  )}
                </span>
              </button>

              {expanded && (
                <div className={styles.lessonBody}>
                  <p className={styles.lessonDesc}>{lesson.description}</p>
                  <div className={styles.challengeList}>
                    {lesson.challenges.map((challenge, cIdx) => {
                      const done = isCompleted(challenge.id);
                      const passing = challenge.validate(grid);

                      return (
                        <div
                          key={challenge.id}
                          className={`${styles.challenge} ${done ? styles.challengeDone : passing ? styles.challengePassing : ''}`}
                        >
                          <div className={styles.challengeTop}>
                            <span className={styles.challengeNum}>{cIdx + 1}</span>
                            <span className={styles.challengeInstruction}>
                              {challenge.instruction}
                            </span>
                            <span className={styles.challengeStatus}>
                              {done ? '✓' : passing ? '✓' : ''}
                            </span>
                          </div>
                          {!done && !passing && (
                            <p className={styles.challengeHint}>Hint: {challenge.hint}</p>
                          )}
                          {!done && passing && (
                            <p className={styles.challengePassed}>Keep this pattern to lock it in!</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {unlocked && !expanded && !lessonDone && (
                <div className={styles.lessonCollapsedHint}>{lesson.description}</div>
              )}
              {lessonDone && !expanded && (
                <div className={styles.lessonCollapsedHint}>
                  All {lesson.challenges.length} challenges completed!
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className={styles.resetBtn} onClick={handleReset}>
        Reset progress
      </button>
    </div>
  );
}
