export const CATEGORY_IDS = [
  'javascript',
  'typescript',
  'react',
  'mobx',
  'nodejs',
  'html-css',
  'browser',
  'architecture',
  'testing',
  'algorithms',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const DIFFICULTIES = ['junior', 'junior-plus', 'middle'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const QUESTION_TYPES = [
  'single-choice',
  'multiple-choice',
  'code-output',
  'find-bug',
  'scenario',
  'code-completion',
] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export type CodeLanguage =
  | 'javascript'
  | 'typescript'
  | 'tsx'
  | 'jsx'
  | 'html'
  | 'css'
  | 'bash'
  | 'json'
  | 'text';

export interface AnswerOption {
  /** Стабильный идентификатор внутри вопроса: "a", "b", "c", "d". */
  id: string;
  text: string;
  /**
   * Объяснение именно этого варианта. Для правильного варианта — почему он верен,
   * для неправильного — какая ментальная модель или деталь реализации ошибочны.
   */
  explanation: string;
}

export interface CompletionConfig {
  /** Варианты, которые считаются правильными после нормализации. */
  acceptedAnswers: string[];
  placeholder: string;
  caseSensitive?: boolean;
  /** Если true, пробелы по краям и повторные пробелы внутри схлопываются. */
  ignoreWhitespace?: boolean;
  /** Подсказка о формате ввода, не раскрывающая ответ. */
  inputHint?: string;
}

export interface Question {
  id: string;
  category: CategoryId;
  topic: string;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  code?: string;
  codeLanguage?: CodeLanguage;
  options?: AnswerOption[];
  /** Для choice-вопросов — id правильных вариантов; для completion — канонический ответ. */
  correctAnswers: string[];
  completion?: CompletionConfig;
  explanation: string;
  commonMistakes: string[];
  codeExample?: string;
  codeExampleLanguage?: CodeLanguage;
  interviewTip: string;
  hint?: string;
  summary: string;
  tags: string[];
}

export interface Category {
  id: CategoryId;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  accent: string;
  topics: readonly string[];
}

export type QuestionMap = Record<string, Question>;
