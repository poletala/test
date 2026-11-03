import type {
  CategoryId,
  ProgressState,
  Question,
  ReadinessDimension,
} from '../types';
import { questionMastery } from './stats';

interface DimensionDefinition {
  id: string;
  title: string;
  description: string;
  categories: CategoryId[];
  topicMatchers: string[];
  recommendation: string;
}

const DIMENSIONS: DimensionDefinition[] = [
  {
    id: 'js-core',
    title: 'Основы JavaScript',
    description: 'Типы, области видимости, замыкания, прототипы, this и работа с объектами.',
    categories: ['javascript'],
    topicMatchers: [
      'Типы данных',
      'null и undefined',
      'Сравнение и coercion',
      'Truthy и falsy',
      'Scope и замыкания',
      'var, let, const и hoisting',
      'this и контекст',
      'Функции',
      'Прототипы и классы',
      'Копирование объектов',
      'Деструктуризация и операторы',
      'Массивы и коллекции',
    ],
    recommendation: 'Повторите замыкания, this, прототипы и coercion — это база всех остальных тем.',
  },
  {
    id: 'js-async',
    title: 'Асинхронный JavaScript',
    description: 'Event Loop, промисы, async/await, микро- и макрозадачи, обработка ошибок.',
    categories: ['javascript'],
    topicMatchers: ['Event Loop и асинхронность', 'Promise и async/await', 'Обработка ошибок'],
    recommendation: 'Разберите порядок микрозадач и промисов, затем потренируйте async/await и гонки запросов.',
  },
  {
    id: 'react-runtime',
    title: 'React: рендеринг и хуки',
    description: 'Render/commit, state snapshots, зависимости эффектов, ререндеры и идентичность.',
    categories: ['react'],
    topicMatchers: [
      'Модель рендеринга',
      'Virtual DOM и reconciliation',
      'Fiber и commit',
      'State и props',
      'useState и батчинг',
      'useEffect и зависимости',
      'useRef',
      'useMemo и useCallback',
      'useReducer и useContext',
      'Custom hooks и правила',
      'memo и оптимизация',
      'Keys и идентичность',
      'Context и ререндеры',
    ],
    recommendation: 'Сфокусируйтесь на useEffect, замыканиях в хуках и правилах идентичности компонентов.',
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    description: 'Narrowing, generics, utility и conditional types, типизация React-кода.',
    categories: ['typescript'],
    topicMatchers: [],
    recommendation: 'Потренируйте generic-ограничения, discriminated unions и типизацию хуков без any.',
  },
  {
    id: 'mobx',
    title: 'MobX',
    description: 'Реактивность, computed, actions, observer и архитектура сторов.',
    categories: ['mobx'],
    topicMatchers: [],
    recommendation: 'Повторите dependency tracking, computed и правила изменения observable-состояния.',
  },
  {
    id: 'browser',
    title: 'Браузер и веб',
    description: 'DOM, события, сеть, безопасность, кэширование и Web Vitals.',
    categories: ['browser'],
    topicMatchers: [],
    recommendation: 'Закройте пробелы в событиях, CORS, кэшировании и метриках производительности.',
  },
  {
    id: 'architecture',
    title: 'Архитектура',
    description: 'Границы модулей, композиция, state management и технические tradeoffs.',
    categories: ['architecture'],
    topicMatchers: [],
    recommendation: 'Практикуйте объяснение tradeoffs: границы фич, API-слой и выбор state-подхода.',
  },
  {
    id: 'testing',
    title: 'Тестирование',
    description: 'Пирамида тестов, RTL, моки, асинхронность и проверка поведения.',
    categories: ['testing'],
    topicMatchers: [],
    recommendation: 'Пишите тесты через поведение пользователя и не забывайте про cleanup и async-assertions.',
  },
  {
    id: 'debugging',
    title: 'Практическая отладка',
    description: 'Задачи на поиск бага, предсказание вывода кода и причинно-следственный анализ.',
    categories: [],
    topicMatchers: [],
    recommendation: 'Разберите задачи «найди баг» и code output: проговаривайте порядок выполнения вслух.',
  },
];

function statusFor(score: number, answered: number): ReadinessDimension['status'] {
  if (answered === 0) return 'not-started';
  if (score < 50) return 'weak';
  if (score < 70) return 'developing';
  if (score < 85) return 'confident';
  return 'strong';
}

export function computeReadiness(
  questions: readonly Question[],
  progress: ProgressState,
): { dimensions: ReadinessDimension[]; overall: number; weakDimensions: ReadinessDimension[] } {
  const dimensions: ReadinessDimension[] = DIMENSIONS.map((definition) => {
    const eligible = questions.filter((question) => {
      if (definition.id === 'debugging') {
        return (
          question.type === 'find-bug' ||
          question.type === 'code-output' ||
          question.tags.includes('debug')
        );
      }
      if (!definition.categories.includes(question.category)) return false;
      if (definition.topicMatchers.length === 0) return true;
      return definition.topicMatchers.includes(question.topic);
    });

    let masterySum = 0;
    let answered = 0;
    for (const question of eligible) {
      const record = progress.questions[question.id];
      if (!record || record.attempts === 0) continue;
      masterySum += questionMastery(record);
      answered += 1;
    }
    const score = eligible.length > 0 ? Math.round(masterySum / eligible.length) : 0;
    return {
      id: definition.id,
      title: definition.title,
      description: definition.description,
      categories: definition.categories,
      topicMatchers: definition.topicMatchers,
      score,
      answered,
      total: eligible.length,
      status: statusFor(score, answered),
      recommendation: definition.recommendation,
    };
  });

  const overall =
    dimensions.length > 0
      ? Math.round(dimensions.reduce((sum, dimension) => sum + dimension.score, 0) / dimensions.length)
      : 0;

  const weakDimensions = [...dimensions]
    .filter((dimension) => dimension.status !== 'strong')
    .sort((a, b) => a.score - b.score);

  return { dimensions, overall, weakDimensions };
}

export const READINESS_WEIGHTS_TEXT =
  'Оценка прозрачна: 55% даёт верный первый ответ, 20% — последняя попытка, 25% — стабильность (доля верных среди всех попыток). Неотвеченные вопросы дают 0. Итог — среднее по девяти направлениям, поэтому пробелы в покрытии снижают оценку.';
