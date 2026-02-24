const LESSON_PROGRESS_KEY = 'soundforge_lesson_progress';

export interface LessonProgress {
  completedChallenges: string[];
}

function normalizeLessonProgress(value: unknown): LessonProgress {
  if (!value || typeof value !== 'object') {
    return { completedChallenges: [] };
  }

  const completedChallenges = (value as { completedChallenges?: unknown }).completedChallenges;

  if (!Array.isArray(completedChallenges)) {
    return { completedChallenges: [] };
  }

  const strings = completedChallenges.filter(
    (item): item is string => typeof item === 'string'
  );

  const uniqueStrings = Array.from(new Set(strings));

  return { completedChallenges: uniqueStrings };
}

export function getLessonProgress(): LessonProgress {
  try {
    const raw = localStorage.getItem(LESSON_PROGRESS_KEY);
    if (!raw) {
      return { completedChallenges: [] };
    }

    const parsed = JSON.parse(raw);
    return normalizeLessonProgress(parsed);
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
