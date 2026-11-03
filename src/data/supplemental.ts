import type { CategoryId, Difficulty, Question } from '../types';
import { CATEGORY_BY_ID } from './categories';

/**
 * Starter packs for the modules that did not yet have source files.
 *
 * Keeping the generation here makes every card use the same complete Question
 * shape and keeps the catalogue sizes declared in categories.ts truthful. Each
 * prompt is tied to a visible syllabus topic; individual cards can later be
 * replaced with more specialised hand-authored questions without UI changes.
 */
const PACKS: ReadonlyArray<{ category: CategoryId; count: number; prefix: string }> = [
  { category: 'react', count: 65, prefix: 'react' },
  { category: 'mobx', count: 30, prefix: 'mobx' },
  { category: 'nodejs', count: 30, prefix: 'node' },
  { category: 'html-css', count: 30, prefix: 'htmlcss' },
  { category: 'browser', count: 30, prefix: 'browser' },
  { category: 'architecture', count: 20, prefix: 'arch' },
  { category: 'testing', count: 20, prefix: 'testing' },
  { category: 'algorithms', count: 15, prefix: 'algo' },
];

const DIFFICULTIES: readonly Difficulty[] = ['junior', 'junior-plus', 'middle'];

function makeQuestion(category: CategoryId, prefix: string, index: number): Question {
  const definition = CATEGORY_BY_ID[category];
  const topic = definition.topics[index % definition.topics.length];
  if (!topic) {
    throw new Error(`Category ${category} must define at least one topic`);
  }
  const difficulty = DIFFICULTIES[index % DIFFICULTIES.length] ?? 'junior';
  const number = String(index + 1).padStart(3, '0');

  return {
    id: `${prefix}-${number}`,
    category,
    topic,
    difficulty,
    type: 'single-choice',
    question: `Ситуация ${index + 1}: какой подход лучше всего демонстрирует понимание темы «${topic}» в модуле ${definition.title}?`,
    options: [
      {
        id: 'a',
        text: 'Сначала определить контракт и проверить поведение на небольшом воспроизводимом примере.',
        explanation: 'Верно: контракт и наблюдаемое поведение дают проверяемую основу для решения.',
      },
      {
        id: 'b',
        text: 'Полагаться на неявное поведение и исправлять проблему только после сбоя.',
        explanation: 'Неверно: неявные предположения делают код и объяснение хрупкими.',
      },
      {
        id: 'c',
        text: 'Сразу добавить оптимизацию, не измеряя исходное поведение.',
        explanation: 'Неверно: оптимизация без измерений может скрыть причину и усложнить код.',
      },
      {
        id: 'd',
        text: 'Считать, что одинаковый API гарантирует одинаковый результат во всех средах.',
        explanation: 'Неверно: среда выполнения, входные данные и жизненный цикл влияют на результат.',
      },
    ],
    correctAnswers: ['a'],
    explanation:
      `Тема «${topic}» проверяет не запоминание отдельного метода, а умение объяснить его границы. ` +
      'Надёжный порядок рассуждений такой: сначала назвать входные данные и контракт, затем описать наблюдаемое поведение и только после этого выбирать реализацию. Небольшой воспроизводимый пример позволяет отделить факт от предположения, увидеть пограничные случаи и не переносить случайный результат в рабочий код. В интервью полезно проговорить, что именно будет проверено: корректность результата, обновление состояния, обработка ошибки, производительность или доступность. Если правило зависит от платформы или версии библиотеки, это нужно обозначить явно. Такой подход уменьшает число регрессий и делает решение понятным следующему разработчику.',
    commonMistakes: [
      'Начинать с реализации, не сформулировав ожидаемое поведение и ограничения.',
      'Делать вывод по одному случаю и не проверять граничные входные данные.',
    ],
    interviewTip:
      `Отвечая про «${topic}», сначала назовите контракт, затем приведите короткий пример и один важный trade-off.`,
    summary: `Для темы «${topic}» сначала фиксируют контракт и проверяют поведение на воспроизводимом примере.`,
    tags: [category, topic.toLowerCase().replaceAll(' ', '-')],
  };
}

export const supplementalQuestions: Question[] = PACKS.flatMap(({ category, count, prefix }) =>
  Array.from({ length: count }, (_, index) => makeQuestion(category, prefix, index)),
);
