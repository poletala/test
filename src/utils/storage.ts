import type { ProgressState } from '../types';

export const PROGRESS_STORAGE_KEY = 'frontend-interview-trainer:progress:v1';
export const THEME_STORAGE_KEY = 'frontend-interview-trainer:theme';

export function createEmptyProgress(): ProgressState {
  return {
    version: 1,
    questions: {},
    bookmarks: [],
    sessions: [],
    activeQuiz: null,
    lastActivityAt: null,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Мягко валидирует persisted-состояние, не доверяя произвольному LocalStorage. */
export function parseStoredProgress(raw: string | null): ProgressState {
  if (!raw) return createEmptyProgress();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1) return createEmptyProgress();
    return {
      version: 1,
      questions: isRecord(parsed.questions)
        ? (parsed.questions as ProgressState['questions'])
        : {},
      bookmarks: Array.isArray(parsed.bookmarks)
        ? parsed.bookmarks.filter((id): id is string => typeof id === 'string')
        : [],
      sessions: Array.isArray(parsed.sessions)
        ? (parsed.sessions as ProgressState['sessions'])
        : [],
      activeQuiz: isRecord(parsed.activeQuiz)
        ? (parsed.activeQuiz as unknown as ProgressState['activeQuiz'])
        : null,
      lastActivityAt:
        typeof parsed.lastActivityAt === 'string' ? parsed.lastActivityAt : null,
    };
  } catch {
    return createEmptyProgress();
  }
}

export function loadProgress(storage: Storage = window.localStorage): ProgressState {
  try {
    return parseStoredProgress(storage.getItem(PROGRESS_STORAGE_KEY));
  } catch {
    return createEmptyProgress();
  }
}

export function saveProgress(
  state: ProgressState,
  storage: Storage = window.localStorage,
): void {
  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // QuotaExceededError или приватный режим не должны ломать приложение.
  }
}

export function clearProgress(storage: Storage = window.localStorage): void {
  try {
    storage.removeItem(PROGRESS_STORAGE_KEY);
  } catch {
    // no-op
  }
}
