import { ProgressStore } from '../stores/ProgressStore';
import { QuizStore, createDefaultConfig } from '../stores/QuizStore';
import { createEmptyProgress } from '../utils/storage';
import { buildQuestionIds } from '../utils/questions';
import type { QuizConfig } from '../types';
import {
  completionQuestion,
  multipleChoiceQuestion,
  questionsFixture,
  singleChoiceQuestion,
  timedQuestion,
} from './fixtures';

function makeQuiz(questions = questionsFixture) {
  const progress = new ProgressStore(createEmptyProgress());
  return { quiz: new QuizStore(progress, questions), progress };
}

function studyConfig(count = 1): QuizConfig {
  return {
    ...createDefaultConfig('study'),
    categoryId: 'all',
    difficulties: ['junior', 'junior-plus', 'middle'],
    count,
  };
}

describe('QuizStore', () => {
  it('отправляет ответ только один раз и записывает прогресс', () => {
    const { quiz, progress } = makeQuiz();
    expect(quiz.startCustom(studyConfig(), [singleChoiceQuestion.id])).toBe(true);
    quiz.toggleOption('b');

    expect(quiz.submitCurrent()).toBe(true);
    expect(quiz.submitted).toBe(true);
    expect(quiz.revealed).toBe(true);
    expect(quiz.submitCurrent()).toBeNull();
    expect(progress.getRecord(singleChoiceQuestion.id)?.attempts).toBe(1);
  });

  it('переходит между вопросами и завершает сессию', () => {
    const { quiz, progress } = makeQuiz();
    quiz.startCustom(studyConfig(2), [singleChoiceQuestion.id, multipleChoiceQuestion.id]);

    expect(quiz.currentNumber).toBe(1);
    quiz.toggleOption('b');
    quiz.submitCurrent();
    quiz.next();
    expect(quiz.currentIndex).toBe(1);
    expect(quiz.currentQuestion?.id).toBe(multipleChoiceQuestion.id);

    quiz.toggleOption('a');
    quiz.toggleOption('b');
    expect(quiz.submitCurrent()).toBe(true);
    quiz.next();

    expect(quiz.finished).toBe(true);
    const result = progress.sessions[0];
    expect(result?.total).toBe(2);
    expect(result?.correct).toBe(2);
    expect(result?.answers).toHaveLength(2);
    expect(progress.activeQuiz).toBeNull();
  });

  it('не раскрывает разбор до завершения в режиме интервью', () => {
    const { quiz } = makeQuiz();
    const config = { ...studyConfig(1), mode: 'interview' as const, timed: false };
    quiz.startCustom(config, [singleChoiceQuestion.id]);
    quiz.toggleOption('b');
    quiz.submitCurrent();

    expect(quiz.submitted).toBe(true);
    expect(quiz.revealed).toBe(false);
    quiz.next();
    expect(quiz.finished).toBe(true);
  });

  it('проверяет multiple-choice как точный набор', () => {
    const { quiz } = makeQuiz();
    quiz.startCustom(studyConfig(1), [multipleChoiceQuestion.id]);
    quiz.toggleOption('a');
    quiz.submitCurrent();
    expect(quiz.revealed).toBe(true);
    expect(quiz.isCurrentCorrect).toBe(false);
  });

  it('принимает completion-ответ и нормализует его', () => {
    const { quiz } = makeQuiz();
    quiz.startCustom(studyConfig(1), [completionQuestion.id]);
    quiz.setTextAnswer('  ARR.FILTER(Boolean) ');
    expect(quiz.canSubmit).toBe(true);
    expect(quiz.submitCurrent()).toBe(true);
  });

  it('автоматически фиксирует ответ при истечении времени', () => {
    const { quiz, progress } = makeQuiz();
    const config = {
      ...studyConfig(1),
      mode: 'interview' as const,
      timed: true,
      secondsPerQuestion: 2,
    };
    quiz.startCustom(config, [timedQuestion.id]);
    quiz.tick();
    expect(quiz.timeLeftSec).toBe(1);
    expect(quiz.submitted).toBe(false);
    quiz.tick();

    expect(quiz.timeLeftSec).toBe(0);
    expect(quiz.submitted).toBe(true);
    expect(quiz.timeExpired).toBe(true);
    expect(progress.getRecord(timedQuestion.id)?.lastCorrect).toBe(false);

    quiz.acknowledgeTimeout();
    expect(quiz.finished).toBe(true);
    expect(quiz.latestResult?.correct).toBe(0);
  });

  it('восстанавливает активную сессию вместе с ответом', () => {
    const first = makeQuiz();
    first.quiz.startCustom(studyConfig(2), [
      singleChoiceQuestion.id,
      multipleChoiceQuestion.id,
    ]);
    first.quiz.toggleOption('b');
    first.quiz.submitCurrent();

    const restored = new QuizStore(first.progress, questionsFixture);
    expect(restored.resumeSaved()).toBe(true);
    expect(restored.currentQuestion?.id).toBe(singleChoiceQuestion.id);
    expect(restored.submitted).toBe(true);
    expect(restored.selectedAnswers).toEqual(['b']);
    expect(restored.revealed).toBe(true);
  });

  it('фильтрует вопросы по сложности и категории', () => {
    const state = createEmptyProgress();
    const onlyMiddle = buildQuestionIds({
      mode: 'study',
      categoryId: 'all',
      difficulties: ['middle'],
      count: 10,
      questions: questionsFixture,
      progress: state,
    });
    expect(onlyMiddle).toHaveLength(2);
    expect(onlyMiddle.every((id) => id !== singleChoiceQuestion.id)).toBe(true);

    const onlyTypeScript = buildQuestionIds({
      mode: 'study',
      categoryId: 'typescript',
      difficulties: ['middle'],
      count: 10,
      questions: questionsFixture,
      progress: state,
    });
    expect(onlyTypeScript).toEqual([multipleChoiceQuestion.id]);
  });

  it('собирает режимы ошибок и закладок', () => {
    const { progress } = makeQuiz();
    progress.recordAnswer({
      question: singleChoiceQuestion,
      selectedAnswers: ['a'],
      textAnswer: '',
      correct: false,
      mode: 'study',
      sessionId: 's1',
      timeSpentSec: 4,
    });
    progress.toggleBookmark(multipleChoiceQuestion.id);

    const mistakes = buildQuestionIds({
      mode: 'mistakes',
      categoryId: 'all',
      difficulties: ['junior', 'junior-plus', 'middle'],
      count: 10,
      questions: questionsFixture,
      progress: progress.toState(),
    });
    expect(mistakes).toContain(singleChoiceQuestion.id);

    const bookmarks = buildQuestionIds({
      mode: 'bookmarks',
      categoryId: 'all',
      difficulties: ['junior', 'junior-plus', 'middle'],
      count: 10,
      questions: questionsFixture,
      progress: progress.toState(),
    });
    expect(bookmarks).toEqual([multipleChoiceQuestion.id]);
  });

  it('не запускает пустую выборку', () => {
    const { quiz } = makeQuiz();
    const started = quiz.start({
      ...studyConfig(5),
      categoryId: 'algorithms',
    });
    expect(started).toBe(false);
    expect(quiz.noQuestionsAvailable).toBe(true);
  });
});
