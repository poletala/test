import { QUESTIONS } from '../data';
import { EXPECTED_QUESTION_COUNTS, CATEGORIES } from '../data/categories';
import { validateQuestionBank } from '../data/validate';
import { CATEGORY_IDS, QUESTION_TYPES } from '../types';

describe('банк вопросов', () => {
  it('содержит 350 вопросов и проходит структурную валидацию', () => {
    expect(QUESTIONS).toHaveLength(350);
    expect(validateQuestionBank(QUESTIONS)).toEqual([]);
  });

  it('соблюдает количество вопросов в каждом модуле', () => {
    for (const categoryId of CATEGORY_IDS) {
      expect(QUESTIONS.filter((question) => question.category === categoryId)).toHaveLength(
        EXPECTED_QUESTION_COUNTS[categoryId],
      );
    }
  });

  it('не содержит дублей id и текстов вопросов', () => {
    const ids = QUESTIONS.map((question) => question.id);
    const normalizedTexts = QUESTIONS.map((question) =>
      question.question.trim().toLowerCase().replace(/\s+/g, ' '),
    );
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(normalizedTexts).size).toBe(normalizedTexts.length);
  });

  it('покрывает все шесть форматов вопросов', () => {
    const types = new Set(QUESTIONS.map((question) => question.type));
    expect([...types].sort()).toEqual([...QUESTION_TYPES].sort());
  });

  it('у каждой темы модуля есть хотя бы один вопрос', () => {
    for (const category of CATEGORIES) {
      const categoryTopics = new Set(
        QUESTIONS.filter((question) => question.category === category.id).map(
          (question) => question.topic,
        ),
      );
      for (const topic of category.topics) {
        expect(categoryTopics.has(topic), `${category.id}: ${topic}`).toBe(true);
      }
    }
  });

  it('не содержит незаполненных маркеров и заглушек', () => {
    for (const question of QUESTIONS) {
      expect(question.question).not.toMatch(/\bTODO\b|\.\.\.$/i);
      expect(question.explanation).not.toMatch(/\bTODO\b|\.\.\.$/i);
    }
  });

  it('React и MobX содержат только авторские вопросы, без шаблонных «Ситуаций»', () => {
    const authored = QUESTIONS.filter(
      (question) => question.category === 'react' || question.category === 'mobx',
    );
    expect(authored).toHaveLength(95);
    for (const question of authored) {
      expect(question.question).not.toMatch(/^Ситуация \d+:/);
    }
  });

  it('соблюдает распределение сложности в готовых React и MobX модулях', () => {
    for (const [category, expected] of [
      ['react', { junior: 16, 'junior-plus': 23, middle: 26 }],
      ['mobx', { junior: 8, 'junior-plus': 10, middle: 12 }],
    ] as const) {
      const questions = QUESTIONS.filter((question) => question.category === category);
      for (const [difficulty, count] of Object.entries(expected)) {
        expect(
          questions.filter((question) => question.difficulty === difficulty),
          `${category}: ${difficulty}`,
        ).toHaveLength(count);
      }
    }
  });

  it('не дублирует наборы вариантов в готовых React и MobX вопросах', () => {
    const authored = QUESTIONS.filter(
      (question) => question.category === 'react' || question.category === 'mobx',
    );
    const signatures = authored
      .filter((question) => question.options)
      .map((question) =>
        (question.options ?? [])
          .map((option) => option.text.trim().toLowerCase())
          .sort()
          .join('|'),
      );
    expect(new Set(signatures).size).toBe(signatures.length);
  });
});
