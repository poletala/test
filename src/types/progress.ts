import type { CategoryId, Difficulty } from './question';

export const QUIZ_MODES = [
  'study',
  'interview',
  'mistakes',
  'random',
  'middle',
  'bookmarks',
] as const;
export type QuizMode = (typeof QUIZ_MODES)[number];

export interface AttemptEvent {
  at: string;
  correct: boolean;
  selectedAnswers: string[];
  textAnswer?: string;
  mode: QuizMode;
  sessionId: string;
}

export interface QuestionProgress {
  attempts: number;
  correctAttempts: number;
  /** null — вопрос ещё не отвечен. Первая попытка не перезаписывается. */
  firstAttemptCorrect: boolean | null;
  lastCorrect: boolean | null;
  lastAttemptAt: string | null;
  history: AttemptEvent[];
}

export type ProgressByQuestion = Record<string, QuestionProgress>;

export interface SessionAnswer {
  questionId: string;
  selectedAnswers: string[];
  textAnswer: string;
  submitted: boolean;
  correct: boolean;
  answeredAt: string;
  timeSpentSec: number;
}

export interface TopicResult {
  topic: string;
  total: number;
  correct: number;
}

export interface SessionResult {
  id: string;
  mode: QuizMode;
  categoryId: CategoryId | 'all';
  difficulties: Difficulty[];
  startedAt: string;
  finishedAt: string;
  durationSec: number;
  total: number;
  correct: number;
  answers: SessionAnswer[];
  topics: TopicResult[];
  questionIds: string[];
}

export interface QuizConfig {
  mode: QuizMode;
  categoryId: CategoryId | 'all';
  difficulties: Difficulty[];
  count: number;
  timed: boolean;
  secondsPerQuestion: number;
}

export interface PersistedQuiz {
  id: string;
  config: QuizConfig;
  questionIds: string[];
  answers: Record<string, SessionAnswer>;
  currentIndex: number;
  startedAt: string;
  questionStartedAt: string;
  timeLeftSec: number | null;
  totalElapsedSec: number;
}

export interface ProgressState {
  version: 1;
  questions: ProgressByQuestion;
  bookmarks: string[];
  sessions: SessionResult[];
  activeQuiz: PersistedQuiz | null;
  lastActivityAt: string | null;
}

export interface CategoryStats {
  categoryId: CategoryId;
  total: number;
  answered: number;
  correct: number;
  accuracy: number | null;
  mastery: number;
}

export interface TopicStats {
  categoryId: CategoryId;
  topic: string;
  total: number;
  answered: number;
  correct: number;
  accuracy: number | null;
}

export interface OverallStats {
  totalQuestions: number;
  answeredQuestions: number;
  masteredQuestions: number;
  firstAttemptCorrect: number;
  firstAttemptAccuracy: number | null;
  overallAccuracy: number | null;
  totalAttempts: number;
  bookmarks: number;
  byCategory: CategoryStats[];
  strongest: TopicStats[];
  weakest: TopicStats[];
}

export interface ReadinessDimension {
  id: string;
  title: string;
  description: string;
  categories: CategoryId[];
  topicMatchers: string[];
  score: number;
  answered: number;
  total: number;
  status: 'not-started' | 'weak' | 'developing' | 'confident' | 'strong';
  recommendation: string;
}
