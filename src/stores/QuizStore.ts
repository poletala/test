import { makeAutoObservable } from 'mobx';
import type {
  PersistedQuiz,
  Question,
  QuizConfig,
  QuizMode,
  SessionAnswer,
  SessionResult,
  TopicResult,
} from '../types';
import { isAnswerComplete, isAnswerCorrect } from '../utils/answerValidation';
import { createId } from '../utils/format';
import {
  buildQuestionIds,
  getDefaultCount,
  getDefaultDifficulties,
} from '../utils/questions';
import type { ProgressStore } from './ProgressStore';

export function createDefaultConfig(mode: QuizMode, categoryId: QuizConfig['categoryId'] = 'all'): QuizConfig {
  return {
    mode,
    categoryId,
    difficulties: getDefaultDifficulties(mode),
    count: getDefaultCount(mode),
    timed: mode === 'interview',
    secondsPerQuestion: 90,
  };
}

export class QuizStore {
  config: QuizConfig = createDefaultConfig('study');
  questionIds: string[] = [];
  answers: Record<string, SessionAnswer> = {};
  currentIndex = 0;
  selectedAnswers: string[] = [];
  textAnswer = '';
  submitted = false;
  revealed = false;
  finished = false;
  startedAt = '';
  questionStartedAt = '';
  timeLeftSec: number | null = null;
  totalElapsedSec = 0;
  sessionId = '';
  timeExpired = false;
  noQuestionsAvailable = false;

  private readonly progressStore: ProgressStore;
  private readonly allQuestions: ReadonlyMap<string, Question>;

  constructor(progressStore: ProgressStore, questions: readonly Question[]) {
    this.progressStore = progressStore;
    this.allQuestions = new Map(questions.map((question) => [question.id, question]));
    makeAutoObservable(
      this,
      // These are dependencies rather than observable state.  MobX's public
      // annotation type does not expose private fields, hence the explicit cast.
      { progressStore: false, allQuestions: false } as never,
      { autoBind: true },
    );
  }

  get questions(): Question[] {
    return this.questionIds
      .map((id) => this.allQuestions.get(id))
      .filter((question): question is Question => question !== undefined);
  }

  get currentQuestion(): Question | undefined {
    return this.questions[this.currentIndex];
  }

  get total(): number {
    return this.questionIds.length;
  }

  get currentNumber(): number {
    return Math.min(this.currentIndex + 1, Math.max(this.total, 1));
  }

  get progressPercent(): number {
    if (this.total === 0) return 0;
    return Math.round(((this.currentIndex + (this.submitted ? 1 : 0)) / this.total) * 100);
  }

  get canSubmit(): boolean {
    const question = this.currentQuestion;
    if (!question || this.submitted || this.finished) return false;
    return isAnswerComplete(question, this.selectedAnswers, this.textAnswer);
  }

  get isCurrentCorrect(): boolean | null {
    const question = this.currentQuestion;
    if (!question || !this.submitted) return null;
    return isAnswerCorrect(question, this.selectedAnswers, this.textAnswer);
  }

  get isLastQuestion(): boolean {
    return this.currentIndex >= this.total - 1;
  }

  get answeredCount(): number {
    return Object.values(this.answers).filter((answer) => answer.submitted).length;
  }

  get correctCount(): number {
    return Object.values(this.answers).filter((answer) => answer.submitted && answer.correct)
      .length;
  }

  get remainingQuestions(): number {
    return Math.max(0, this.total - this.answeredCount);
  }

  get active(): boolean {
    return this.total > 0 && !this.finished;
  }

  get hasSavedQuiz(): boolean {
    return this.progressStore.activeQuiz !== null;
  }

  get latestResult(): SessionResult | undefined {
    return this.progressStore.sessions[0];
  }

  getSessionById(id: string): SessionResult | undefined {
    return this.progressStore.sessions.find((session) => session.id === id);
  }

  getModeLabel(): string {
    const labels: Record<QuizMode, string> = {
      study: 'Обучение',
      interview: 'Интервью',
      mistakes: 'Работа над ошибками',
      random: 'Случайная практика',
      middle: 'Middle Challenge',
      bookmarks: 'Закладки',
    };
    return labels[this.config.mode];
  }

  start(config: QuizConfig): boolean {
    const ids = buildQuestionIds({
      ...config,
      questions: [...this.allQuestions.values()],
      progress: this.progressStore.toState(),
    });
    if (ids.length === 0) {
      this.noQuestionsAvailable = true;
      return false;
    }
    this.noQuestionsAvailable = false;
    this.initialize(config, ids);
    return true;
  }

  startCustom(config: QuizConfig, ids: readonly string[]): boolean {
    const validIds = [...new Set(ids)].filter((id) => this.allQuestions.has(id));
    if (validIds.length === 0) {
      this.noQuestionsAvailable = true;
      return false;
    }
    this.noQuestionsAvailable = false;
    this.initialize(config, validIds);
    return true;
  }

  resumeSaved(): boolean {
    const saved = this.progressStore.activeQuiz;
    if (!saved) return false;
    const validIds = saved.questionIds.filter((id) => this.allQuestions.has(id));
    if (validIds.length === 0) {
      this.progressStore.clearActiveQuiz();
      return false;
    }
    this.initialize(saved.config, validIds, saved);
    return true;
  }

  toggleOption(optionId: string): void {
    if (this.submitted || this.finished) return;
    const question = this.currentQuestion;
    if (!question) return;
    if (question.type === 'multiple-choice') {
      this.selectedAnswers = this.selectedAnswers.includes(optionId)
        ? this.selectedAnswers.filter((id) => id !== optionId)
        : [...this.selectedAnswers, optionId];
    } else {
      this.selectedAnswers = [optionId];
    }
  }

  setTextAnswer(value: string): void {
    if (this.submitted || this.finished) return;
    this.textAnswer = value;
  }

  submitCurrent(force = false): boolean | null {
    const question = this.currentQuestion;
    if (!question || this.submitted || this.finished) return null;
    if (!force && !isAnswerComplete(question, this.selectedAnswers, this.textAnswer)) {
      return null;
    }
    const now = new Date();
    const correct = isAnswerCorrect(question, this.selectedAnswers, this.textAnswer);
    const timeSpentSec = Math.max(
      1,
      Math.round((now.getTime() - new Date(this.questionStartedAt).getTime()) / 1000),
    );
    const answer: SessionAnswer = {
      questionId: question.id,
      selectedAnswers: [...this.selectedAnswers],
      textAnswer: this.textAnswer,
      submitted: true,
      correct,
      answeredAt: now.toISOString(),
      timeSpentSec,
    };
    this.answers[question.id] = answer;
    this.progressStore.recordAnswer({
      question,
      selectedAnswers: this.selectedAnswers,
      textAnswer: this.textAnswer,
      correct,
      mode: this.config.mode,
      sessionId: this.sessionId,
      timeSpentSec,
    });
    this.submitted = true;
    if (this.config.mode === 'study') {
      this.revealed = true;
    }
    this.persistActive();
    return correct;
  }

  next(): void {
    if (this.finished) return;
    if (this.isLastQuestion) {
      this.finish();
      return;
    }
    this.currentIndex += 1;
    this.resetQuestionState();
    this.questionStartedAt = new Date().toISOString();
    this.persistActive();
  }

  acknowledgeTimeout(): void {
    if (!this.timeExpired) return;
    this.timeExpired = false;
    this.next();
  }

  finish(): SessionResult {
    if (this.finished) {
      return this.buildResult();
    }
    this.recordUnanswered();
    const result = this.buildResult();
    this.progressStore.saveSession(result);
    this.progressStore.clearActiveQuiz();
    this.finished = true;
    this.revealed = false;
    return result;
  }

  tick(): void {
    if (!this.active || !this.config.timed || this.submitted) return;
    this.totalElapsedSec += 1;
    if (this.timeLeftSec === null) return;
    this.timeLeftSec = Math.max(0, this.timeLeftSec - 1);
    if (this.timeLeftSec === 0) {
      this.timeExpired = true;
      this.submitCurrent(true);
    }
  }

  discardSaved(): void {
    this.progressStore.clearActiveQuiz();
  }

  reset(): void {
    this.questionIds = [];
    this.answers = {};
    this.currentIndex = 0;
    this.selectedAnswers = [];
    this.textAnswer = '';
    this.submitted = false;
    this.revealed = false;
    this.finished = false;
    this.startedAt = '';
    this.questionStartedAt = '';
    this.timeLeftSec = null;
    this.totalElapsedSec = 0;
    this.sessionId = '';
    this.timeExpired = false;
    this.noQuestionsAvailable = false;
  }

  private initialize(config: QuizConfig, ids: string[], saved?: PersistedQuiz): void {
    this.config = { ...config };
    this.questionIds = [...ids];
    this.answers = saved ? { ...saved.answers } : {};
    this.currentIndex = saved
      ? Math.min(saved.currentIndex, Math.max(0, ids.length - 1))
      : 0;
    this.startedAt = saved?.startedAt ?? new Date().toISOString();
    this.questionStartedAt = saved?.questionStartedAt ?? new Date().toISOString();
    this.timeLeftSec = config.timed ? (saved?.timeLeftSec ?? config.secondsPerQuestion) : null;
    this.totalElapsedSec = saved?.totalElapsedSec ?? 0;
    this.sessionId = saved?.id ?? createId('quiz');
    this.finished = false;
    this.timeExpired = false;
    this.noQuestionsAvailable = false;

    // При восстановлении текущий вопрос мог уже быть отвечен: не даём отправить его повторно.
    const savedCurrent = saved?.answers[this.questionIds[this.currentIndex] ?? ''];
    this.selectedAnswers = savedCurrent?.selectedAnswers ? [...savedCurrent.selectedAnswers] : [];
    this.textAnswer = savedCurrent?.textAnswer ?? '';
    this.submitted = Boolean(savedCurrent?.submitted);
    this.revealed = Boolean(savedCurrent?.submitted) && config.mode === 'study';
    this.persistActive();
  }

  private resetQuestionState(): void {
    this.selectedAnswers = [];
    this.textAnswer = '';
    this.submitted = false;
    this.revealed = false;
    this.timeExpired = false;
    this.timeLeftSec = this.config.timed ? this.config.secondsPerQuestion : null;
  }

  private recordUnanswered(): void {
    const now = new Date().toISOString();
    for (const question of this.questions) {
      if (this.answers[question.id]?.submitted) continue;
      const answer: SessionAnswer = {
        questionId: question.id,
        selectedAnswers: [],
        textAnswer: '',
        submitted: true,
        correct: false,
        answeredAt: now,
        timeSpentSec: 0,
      };
      this.answers[question.id] = answer;
      this.progressStore.recordAnswer({
        question,
        selectedAnswers: [],
        textAnswer: '',
        correct: false,
        mode: this.config.mode,
        sessionId: this.sessionId,
        timeSpentSec: 0,
      });
    }
  }

  private buildResult(): SessionResult {
    const finishedAt = new Date().toISOString();
    const answers = this.questions
      .map((question) => this.answers[question.id])
      .filter((answer): answer is SessionAnswer => answer !== undefined);
    const topicsMap = new Map<string, TopicResult>();
    for (const question of this.questions) {
      const answer = this.answers[question.id];
      const topic = topicsMap.get(question.topic) ?? {
        topic: question.topic,
        total: 0,
        correct: 0,
      };
      topic.total += 1;
      if (answer?.correct) topic.correct += 1;
      topicsMap.set(question.topic, topic);
    }
    return {
      id: this.sessionId,
      mode: this.config.mode,
      categoryId: this.config.categoryId,
      difficulties: [...this.config.difficulties],
      startedAt: this.startedAt,
      finishedAt,
      durationSec: Math.max(
        1,
        Math.round((Date.now() - new Date(this.startedAt).getTime()) / 1000),
      ),
      total: this.questionIds.length,
      correct: answers.filter((answer) => answer.correct).length,
      answers,
      topics: [...topicsMap.values()],
      questionIds: [...this.questionIds],
    };
  }

  private persistActive(): void {
    if (this.finished || this.total === 0) return;
    this.progressStore.saveActiveQuiz({
      id: this.sessionId,
      config: this.config,
      questionIds: [...this.questionIds],
      answers: { ...this.answers },
      currentIndex: this.currentIndex,
      startedAt: this.startedAt,
      questionStartedAt: this.questionStartedAt,
      timeLeftSec: this.timeLeftSec,
      totalElapsedSec: this.totalElapsedSec,
    });
  }
}
