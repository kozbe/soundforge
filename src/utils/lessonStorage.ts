const LESSON_PROGRESS_KEY = 'soundforge_lesson_progress';

export interface LessonProgress {
  completedChallenges: string[];
}

export function getLessonProgress(): LessonProgress {
  try {
    const raw = localStorage.getItem(LESSON_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : { completedChallenges: [] };
  } catch {
    return { completedChallenges: [] };
  }
}

export function saveLessonProgress(progress: LessonProgress): void {
  localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(progress));
}

export function resetLessonProgress(): void {
  localStorage.removeItem(LESSON_PROGRESS_KEY);
}
