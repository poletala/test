import type { Question } from '../types';
import { javascriptPart1 } from './javascript/part1';
import { javascriptPart2 } from './javascript/part2';
import { javascriptPart3 } from './javascript/part3';
import { typescriptPart1 } from './typescript/part1';
import { typescriptPart2 } from './typescript/part2';
import { supplementalQuestions } from './supplemental';
//import { reactPart2 } from './react/part2';
//import { reactPart3 } from './react/part3';
//import { mobxPart1 } from './mobx/part1';
//import { mobxPart2 } from './mobx/part2';
//import { nodejsPart1 } from './nodejs/part1';
//import { nodejsPart2 } from './nodejs/part2';
//import { htmlCssPart1 } from './html-css/part1';
//import { htmlCssPart2 } from './html-css/part2';
//import { browserPart1 } from './browser/part1';
//import { browserPart2 } from './browser/part2';
//import { architectureQuestions } from './architecture/questions';
//import { testingQuestions } from './testing/questions';
//import { algorithmsQuestions } from './algorithms/questions';

/**
 * Единственная точка сборки банка вопросов. UI не импортирует отдельные пакеты,
 * поэтому добавление новой темы не затрагивает компоненты.
 */
export const QUESTIONS: readonly Question[] = [
  ...javascriptPart1,
  ...javascriptPart2,
  ...javascriptPart3,
  ...typescriptPart1,
  ...typescriptPart2,
  ...supplementalQuestions,
  // ...reactPart1,
  // ...reactPart2,
  // ...reactPart3,
  // ...mobxPart1,
  // ...mobxPart2,
  // ...nodejsPart1,
  // ...nodejsPart2,
  // ...htmlCssPart1,
  // ...htmlCssPart2,
  // ...browserPart1,
  // ...browserPart2,
  // ...architectureQuestions,
  // ...testingQuestions,
  // ...algorithmsQuestions,
];

export const QUESTION_BY_ID = new Map(QUESTIONS.map((question) => [question.id, question]));
