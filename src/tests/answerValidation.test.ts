import {
  getCorrectOptionTexts,
  isAnswerComplete,
  isAnswerCorrect,
  normalizeCompletion,
} from '../utils/answerValidation';
import {
  completionQuestion,
  multipleChoiceQuestion,
  singleChoiceQuestion,
} from './fixtures';

describe('валидация ответов', () => {
  it('принимает только единственный верный вариант single-choice', () => {
    expect(isAnswerCorrect(singleChoiceQuestion, ['b'])).toBe(true);
    expect(isAnswerCorrect(singleChoiceQuestion, ['a'])).toBe(false);
    expect(isAnswerCorrect(singleChoiceQuestion, ['b', 'a'])).toBe(false);
  });

  it('требует точный набор для multiple-choice', () => {
    expect(isAnswerCorrect(multipleChoiceQuestion, ['a', 'b'])).toBe(true);
    expect(isAnswerCorrect(multipleChoiceQuestion, ['b', 'a'])).toBe(true);
    expect(isAnswerCorrect(multipleChoiceQuestion, ['a'])).toBe(false);
    expect(isAnswerCorrect(multipleChoiceQuestion, ['a', 'b', 'c'])).toBe(false);
  });

  it('нормализует регистр и пробелы в code-completion', () => {
    expect(
      isAnswerCorrect(completionQuestion, [], '  ARR.FILTER( Boolean )  '),
    ).toBe(true);
    expect(
      isAnswerCorrect(completionQuestion, [], 'arr.filter((x) => Boolean(x))'),
    ).toBe(true);
    expect(isAnswerCorrect(completionQuestion, [], 'arr.map(Boolean)')).toBe(false);
    expect(isAnswerComplete(completionQuestion, [], '   ')).toBe(false);
    expect(isAnswerComplete(completionQuestion, [], 'arr.filter(Boolean)')).toBe(true);
  });

  it('сохраняет регистр, если completion требует его явно', () => {
    expect(
      normalizeCompletion('Boolean', {
        acceptedAnswers: ['Boolean'],
        placeholder: '...',
        caseSensitive: true,
      }),
    ).toBe('Boolean');
    expect(
      normalizeCompletion(' boolean ', {
        acceptedAnswers: ['Boolean'],
        placeholder: '...',
        caseSensitive: true,
      }),
    ).toBe('boolean');
  });

  it('возвращает тексты правильных вариантов', () => {
    expect(getCorrectOptionTexts(multipleChoiceQuestion)).toEqual([
      'unknown требует narrowing',
      'any отключает проверку',
    ]);
  });
});
