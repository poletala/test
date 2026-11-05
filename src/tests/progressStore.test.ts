import { ProgressStore } from '../stores/ProgressStore';
import { createEmptyProgress, PROGRESS_STORAGE_KEY, parseStoredProgress } from '../utils/storage';
import type { ProgressState } from '../types';
import {
  completionQuestion,
  multipleChoiceQuestion,
  questionsFixture,
  singleChoiceQuestion,
} from './fixtures';

function createStore(): ProgressStore {
  return new ProgressStore(createEmptyProgress());
}

describe('ProgressStore', () => {
  it('сохраняет первую попытку отдельно от последующих', () => {
    const store = createStore();
    store.recordAnswer({
      question: singleChoiceQuestion,
      selectedAnswers: ['b'],
      textAnswer: '',
      correct: true,
      mode: 'study',
      sessionId: 's1',
      timeSpentSec: 10,
    });
    store.recordAnswer({
      question: singleChoiceQuestion,
      selectedAnswers: ['a'],
      textAnswer: '',
      correct: false,
      mode: 'mistakes',
      sessionId: 's2',
      timeSpentSec: 8,
    });

    const record = store.getRecord(singleChoiceQuestion.id);
    expect(record).toBeDefined();
    expect(record?.attempts).toBe(2);
    expect(record?.correctAttempts).toBe(1);
    expect(record?.firstAttemptCorrect).toBe(true);
    expect(record?.lastCorrect).toBe(false);
    expect(record?.history).toHaveLength(2);
  });

  it('добавляет и убирает закладки без дублей', () => {
    const store = createStore();
    store.toggleBookmark('test-single');
    expect(store.isBookmarked('test-single')).toBe(true);
    expect(store.bookmarks).toEqual(['test-single']);
    store.toggleBookmark('test-single');
    expect(store.isBookmarked('test-single')).toBe(false);
  });

  it('переживает перезагрузку через LocalStorage', () => {
    const store = createStore();
    store.recordAnswer({
      question: singleChoiceQuestion,
      selectedAnswers: ['a'],
      textAnswer: '',
      correct: false,
      mode: 'study',
      sessionId: 's1',
      timeSpentSec: 5,
    });
    store.toggleBookmark(completionQuestion.id);

    const restored = new ProgressStore();
    expect(restored.getRecord(singleChoiceQuestion.id)?.attempts).toBe(1);
    expect(restored.bookmarks).toEqual([completionQuestion.id]);
    expect(window.localStorage.getItem(PROGRESS_STORAGE_KEY)).toBeTruthy();
  });

  it('считает ошибки и общую статистику по первой попытке', () => {
    const store = createStore();
    store.recordAnswer({
      question: singleChoiceQuestion,
      selectedAnswers: ['b'],
      textAnswer: '',
      correct: true,
      mode: 'study',
      sessionId: 's1',
      timeSpentSec: 5,
    });
    store.recordAnswer({
      question: multipleChoiceQuestion,
      selectedAnswers: ['a'],
      textAnswer: '',
      correct: false,
      mode: 'study',
      sessionId: 's1',
      timeSpentSec: 5,
    });
    store.recordAnswer({
      question: singleChoiceQuestion,
      selectedAnswers: ['a'],
      textAnswer: '',
      correct: false,
      mode: 'mistakes',
      sessionId: 's2',
      timeSpentSec: 5,
    });

    expect(store.mistakeQuestionIds).toContain(singleChoiceQuestion.id);
    const stats = store.getOverallStats(questionsFixture);
    expect(stats.answeredQuestions).toBe(2);
    expect(stats.firstAttemptCorrect).toBe(1);
    expect(stats.firstAttemptAccuracy).toBe(50);
    expect(stats.overallAccuracy).toBe(33);
    expect(stats.byCategory.find((item) => item.categoryId === 'javascript')?.answered).toBe(1);
  });

  it('полностью сбрасывает прогресс', () => {
    const store = createStore();
    store.toggleBookmark(singleChoiceQuestion.id);
    store.recordAnswer({
      question: singleChoiceQuestion,
      selectedAnswers: ['b'],
      textAnswer: '',
      correct: true,
      mode: 'study',
      sessionId: 's1',
      timeSpentSec: 1,
    });
    store.reset();

    expect(store.answeredCount).toBe(0);
    expect(store.bookmarks).toEqual([]);
    expect(store.sessions).toEqual([]);
    expect(store.activeQuiz).toBeNull();
  });

  it('не доверяет повреждённому JSON в LocalStorage', () => {
    expect(parseStoredProgress('{broken').version).toBe(1);
    expect(parseStoredProgress(null).questions).toEqual({});
    const parsed = parseStoredProgress(
      JSON.stringify({ version: 1, questions: {}, bookmarks: ['q'], sessions: [] }),
    );
    expect(parsed.bookmarks).toEqual(['q']);
  });

  it('сохраняет снимок активной сессии', () => {
    const store = createStore();
    const snapshot: ProgressState['activeQuiz'] = {
      id: 'quiz-1',
      config: {
        mode: 'study',
        categoryId: 'all',
        difficulties: ['junior'],
        count: 1,
        timed: false,
        secondsPerQuestion: 90,
      },
      questionIds: [singleChoiceQuestion.id],
      answers: {},
      currentIndex: 0,
      startedAt: new Date().toISOString(),
      questionStartedAt: new Date().toISOString(),
      timeLeftSec: null,
      totalElapsedSec: 0,
    };
    store.saveActiveQuiz(snapshot);
    expect(new ProgressStore().activeQuiz?.id).toBe('quiz-1');
    store.clearActiveQuiz();
    expect(new ProgressStore().activeQuiz).toBeNull();
  });
});
