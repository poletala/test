import type { Question } from '../types';

export const singleChoiceQuestion: Question = {
  id: 'test-single',
  category: 'javascript',
  topic: 'Scope и замыкания',
  difficulty: 'junior',
  type: 'single-choice',
  question: 'Какое значение вернёт замыкание?',
  code: 'let x = 1; const f = () => x; x = 2; f();',
  codeLanguage: 'javascript',
  options: [
    { id: 'a', text: '1', explanation: 'Неверно: значение читается в момент вызова.' },
    { id: 'b', text: '2', explanation: 'Верно: замыкание видит актуальное значение.' },
    { id: 'c', text: 'undefined', explanation: 'Неверно: переменная инициализирована.' },
    { id: 'd', text: 'ReferenceError', explanation: 'Неверно: переменная находится в области видимости.' },
  ],
  correctAnswers: ['b'],
  explanation: 'Замыкание хранит ссылку на переменную, поэтому после изменения x функция вернёт 2. Это не снимок значения, а живая привязка.',
  commonMistakes: ['Считать замыкание снимком значения.', 'Ожидать ошибку области видимости.'],
  interviewTip: 'Объясните разницу между привязкой переменной и значением.',
  summary: 'Замыкание видит актуальное значение переменной.',
  tags: ['closures'],
};

export const multipleChoiceQuestion: Question = {
  id: 'test-multiple',
  category: 'typescript',
  topic: 'any, unknown и never',
  difficulty: 'middle',
  type: 'multiple-choice',
  question: 'Какие утверждения о типах верны? Выберите все верные варианты.',
  options: [
    { id: 'a', text: 'unknown требует narrowing', explanation: 'Верно: напрямую использовать unknown нельзя.' },
    { id: 'b', text: 'any отключает проверку', explanation: 'Верно: any совместим с чем угодно.' },
    { id: 'c', text: 'never — синоним void', explanation: 'Неверно: never означает недостижимое значение.' },
    { id: 'd', text: 'unknown шире any', explanation: 'Неверно: any отключает проверки, unknown безопаснее, но не «шире».' },
  ],
  correctAnswers: ['a', 'b'],
  explanation: 'unknown требует проверки перед использованием, а any отключает проверку типов. never обозначает недостижимое значение, void — отсутствие полезного возвращаемого значения. Это разные роли в системе типов.',
  commonMistakes: ['Путать never и void.', 'Считать unknown небезопасным.'],
  interviewTip: 'Сравнивайте типы по уровню безопасности и назначению.',
  summary: 'unknown безопасен, any отключает проверки, never — недостижимость.',
  tags: ['types'],
};

export const completionQuestion: Question = {
  id: 'test-completion',
  category: 'javascript',
  topic: 'Массивы и коллекции',
  difficulty: 'junior-plus',
  type: 'code-completion',
  question: 'Введите выражение, которое оставит в массиве только truthy-значения.',
  completion: {
    acceptedAnswers: ['arr.filter(Boolean)', 'arr.filter((x) => Boolean(x))'],
    placeholder: 'arr.method(...)',
    inputHint: 'Используйте filter и Boolean',
    caseSensitive: false,
    ignoreWhitespace: true,
  },
  correctAnswers: ['arr.filter(Boolean)'],
  explanation: 'filter(Boolean) передаёт каждый элемент в Boolean и оставляет только truthy-значения. Это не удаляет false-подобные значения из исходного массива, а создаёт новый.',
  commonMistakes: ['Использовать map вместо filter.', 'Забыть, что filter не мутирует массив.'],
  interviewTip: 'Уточните, что создаётся новый массив.',
  summary: 'filter(Boolean) отбирает truthy-элементы.',
  tags: ['array', 'filter'],
};

export const timedQuestion: Question = {
  ...singleChoiceQuestion,
  id: 'test-timed',
  difficulty: 'middle',
  explanation: 'Тестовый вопрос для таймера с достаточной длиной объяснения. Замыкание хранит ссылку на переменную, поэтому после изменения x функция вернёт 2. Это не снимок значения, а живая привязка. Проверка таймера не зависит от содержания.',
};

export const questionsFixture = [
  singleChoiceQuestion,
  multipleChoiceQuestion,
  completionQuestion,
  timedQuestion,
];
