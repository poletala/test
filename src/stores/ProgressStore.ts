import { makeAutoObservable } from 'mobx';
import type {
  ProgressState,
  Question,
  QuestionProgress,
  QuizMode,
  SessionResult,
  PersistedQuiz,
} from '../types';
import {
  clearProgress,
  createEmptyProgress,
  loadProgress,
  saveProgress,
} from '../utils/storage';
import { computeOverallStats } from '../utils/stats';

export class ProgressStore {
  questions: ProgressState['questions'] = {};
  bookmarks: string[] = [];
  sessions: SessionResult[] = [];
  activeQuiz: PersistedQuiz | null = null;
  lastActivityAt: string | null = null;

  constructor(initialState: ProgressState = loadProgress()) {
    this.questions = initialState.questions;
    this.bookmarks = initialState.bookmarks;
    this.sessions = initialState.sessions;
    this.activeQuiz = initialState.activeQuiz;
    this.lastActivityAt = initialState.lastActivityAt;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get answeredCount(): number {
    return Object.values(this.questions).filter((record) => record.attempts > 0).length;
  }

  get mistakeQuestionIds(): string[] {
    return Object.entries(this.questions)
      .filter(
        ([, record]) =>
          record.lastCorrect === false || record.firstAttemptCorrect === false,
      )
      .map(([id]) => id);
  }

  get completedSessions(): number {
    return this.sessions.length;
  }

  isBookmarked(questionId: string): boolean {
    return this.bookmarks.includes(questionId);
  }

  getRecord(questionId: string): QuestionProgress | undefined {
    return this.questions[questionId];
  }

  recordAnswer(params: {
    question: Question;
    selectedAnswers: string[];
    textAnswer: string;
    correct: boolean;
    mode: QuizMode;
    sessionId: string;
    timeSpentSec: number;
  }): void {
    const { question, selectedAnswers, textAnswer, correct, mode, sessionId } = params;
    const now = new Date().toISOString();
    const previous = this.questions[question.id];
    const next: QuestionProgress = previous
      ? {
          ...previous,
          attempts: previous.attempts + 1,
          correctAttempts: previous.correctAttempts + (correct ? 1 : 0),
          lastCorrect: correct,
          lastAttemptAt: now,
          history: [
            ...previous.history,
            {
              at: now,
              correct,
              selectedAnswers: [...selectedAnswers],
              textAnswer,
              mode,
              sessionId,
            },
          ].slice(-30),
        }
      : {
          attempts: 1,
          correctAttempts: correct ? 1 : 0,
          firstAttemptCorrect: correct,
          lastCorrect: correct,
          lastAttemptAt: now,
          history: [
            {
              at: now,
              correct,
              selectedAnswers: [...selectedAnswers],
              textAnswer,
              mode,
              sessionId,
            },
          ],
        };
    this.questions[question.id] = next;
    this.lastActivityAt = now;
    this.persist();
  }

  toggleBookmark(questionId: string): void {
    this.bookmarks = this.isBookmarked(questionId)
      ? this.bookmarks.filter((id) => id !== questionId)
      : [...this.bookmarks, questionId];
    this.lastActivityAt = new Date().toISOString();
    this.persist();
  }

  saveSession(result: SessionResult): void {
    this.sessions = [result, ...this.sessions.filter((session) => session.id !== result.id)].slice(
      0,
      50,
    );
    this.lastActivityAt = result.finishedAt;
    this.persist();
  }

  saveActiveQuiz(snapshot: PersistedQuiz | null): void {
    this.activeQuiz = snapshot;
    this.persist();
  }

  clearActiveQuiz(): void {
    this.activeQuiz = null;
    this.persist();
  }

  reset(): void {
    const empty = createEmptyProgress();
    this.questions = empty.questions;
    this.bookmarks = [];
    this.sessions = [];
    this.activeQuiz = null;
    this.lastActivityAt = null;
    clearProgress();
    this.persist();
  }

  getOverallStats(allQuestions: readonly Question[]) {
    return computeOverallStats(allQuestions, this.toState());
  }

  toState(): ProgressState {
    return {
      version: 1,
      questions: this.questions,
      bookmarks: this.bookmarks,
      sessions: this.sessions,
      activeQuiz: this.activeQuiz,
      lastActivityAt: this.lastActivityAt,
    };
  }

  private persist(): void {
    saveProgress(this.toState());
  }
}
