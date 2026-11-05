import type { CompletionConfig, Question } from '../types';

export function normalizeCompletion(value: string, config: CompletionConfig): string {
  let normalized = value.trim();
  if (config.ignoreWhitespace !== false) {
    normalized = normalized
      .replace(/\s+/g, ' ')
      // Для коротких выражений пробелы вокруг пунктуации не меняют смысл:
      // arr.filter( Boolean ) и arr.filter(Boolean) должны приниматься одинаково.
      .replace(/\s*([()[\]{},;.>])\s*/g, '$1');
  }
  if (!config.caseSensitive) {
    normalized = normalized.toLowerCase();
  }
  return normalized;
}

export function isAnswerComplete(
  question: Question,
  selectedAnswers: readonly string[],
  textAnswer = '',
): boolean {
  if (question.completion) {
    return textAnswer.trim().length > 0;
  }
  return selectedAnswers.length > 0;
}

export function isAnswerCorrect(
  question: Question,
  selectedAnswers: readonly string[],
  textAnswer = '',
): boolean {
  if (question.completion) {
    const normalized = normalizeCompletion(textAnswer, question.completion);
    const accepted = new Set(
      [...question.completion.acceptedAnswers, ...question.correctAnswers].map((answer) =>
        normalizeCompletion(answer, question.completion as CompletionConfig),
      ),
    );
    return accepted.has(normalized);
  }

  const expected = new Set(question.correctAnswers);
  const actual = new Set(selectedAnswers);
  if (expected.size !== actual.size) return false;
  for (const answer of expected) {
    if (!actual.has(answer)) return false;
  }
  return true;
}

export function isMultipleAnswerQuestion(question: Question): boolean {
  return question.type === 'multiple-choice';
}

export function getCorrectOptionTexts(question: Question): string[] {
  if (question.completion) {
    return [question.correctAnswers[0] ?? question.completion.acceptedAnswers[0] ?? ''];
  }
  return (question.options ?? [])
    .filter((option) => question.correctAnswers.includes(option.id))
    .map((option) => option.text);
}

export function getSelectedOptionTexts(
  question: Question,
  selectedAnswers: readonly string[],
): string[] {
  return (question.options ?? [])
    .filter((option) => selectedAnswers.includes(option.id))
    .map((option) => option.text);
}
