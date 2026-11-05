import type { Difficulty, Question, QuizConfig, QuizMode } from '../types';
import type { ProgressState } from '../types';

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const item = result[i];
    const other = result[j];
    if (item !== undefined && other !== undefined) {
      result[i] = other;
      result[j] = item;
    }
  }
  return result;
}

export function createQuestionMap(questions: readonly Question[]): Map<string, Question> {
  return new Map(questions.map((question) => [question.id, question]));
}

export function filterQuestions(
  questions: readonly Question[],
  config: Pick<QuizConfig, 'categoryId' | 'difficulties'>,
): Question[] {
  return questions.filter((question) => {
    if (config.categoryId !== 'all' && question.category !== config.categoryId) {
      return false;
    }
    return config.difficulties.includes(question.difficulty);
  });
}

export interface BuildSessionOptions {
  mode: QuizMode;
  categoryId: QuizConfig['categoryId'];
  difficulties: Difficulty[];
  count: number;
  questions: readonly Question[];
  progress: ProgressState;
}

/** Выбирает вопросы для режима. Возвращает перемешанную выборку без дублей. */
export function buildQuestionIds(options: BuildSessionOptions): string[] {
  const { mode, questions, progress } = options;
  let pool = filterQuestions(questions, options);

  if (mode === 'mistakes') {
    pool = pool.filter((question) => {
      const record = progress.questions[question.id];
      return Boolean(record && (record.lastCorrect === false || record.firstAttemptCorrect === false));
    });
  }
  if (mode === 'bookmarks') {
    const bookmarks = new Set(progress.bookmarks);
    pool = pool.filter((question) => bookmarks.has(question.id));
  }
  if (mode === 'middle') {
    pool = pool.filter(
      (question) => question.difficulty === 'junior-plus' || question.difficulty === 'middle',
    );
  }
  if (mode === 'random') {
    // Сначала берём по одному вопросу из каждой темы, затем второй круг и т. д.
    // Так случайная сессия не превращается в пять вопросов подряд про замыкания.
    const groups = new Map<string, Question[]>();
    for (const question of shuffle(pool)) {
      const group = groups.get(question.topic) ?? [];
      group.push(question);
      groups.set(question.topic, group);
    }
    const topicGroups = shuffle([...groups.values()]);
    const picked: Question[] = [];
    let round = 0;
    while (picked.length < options.count) {
      let added = 0;
      for (const group of topicGroups) {
        const question = group[round];
        if (question && picked.length < options.count) {
          picked.push(question);
          added += 1;
        }
      }
      if (added === 0) break;
      round += 1;
    }
    return picked.map((question) => question.id);
  }

  return shuffle(pool)
    .slice(0, Math.min(options.count, pool.length))
    .map((question) => question.id);
}

export function getDefaultDifficulties(mode: QuizMode): Difficulty[] {
  if (mode === 'middle') return ['junior-plus', 'middle'];
  return ['junior', 'junior-plus', 'middle'];
}

export function getDefaultCount(mode: QuizMode): number {
  if (mode === 'interview') return 10;
  if (mode === 'mistakes' || mode === 'bookmarks') return 20;
  return 10;
}
