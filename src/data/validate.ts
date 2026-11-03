import type { Question } from '../types';
import { CATEGORY_IDS, DIFFICULTIES, QUESTION_TYPES } from '../types';
import { CATEGORIES, EXPECTED_QUESTION_COUNTS } from './categories';

export interface ValidationIssue {
  questionId: string;
  field: string;
  message: string;
}

const CATEGORY_TOPICS = new Map(
  CATEGORIES.map((category) => [category.id, new Set(category.topics)]),
);

export function validateQuestion(question: Question): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const push = (field: string, message: string) =>
    issues.push({ questionId: question.id, field, message });

  if (!question.id.trim()) push('id', 'Пустой id');
  if (!CATEGORY_IDS.includes(question.category)) push('category', 'Неизвестная категория');
  if (!DIFFICULTIES.includes(question.difficulty)) push('difficulty', 'Неизвестная сложность');
  if (!QUESTION_TYPES.includes(question.type)) push('type', 'Неизвестный тип вопроса');
  if (!question.question.trim()) push('question', 'Пустой текст вопроса');
  if (!question.explanation.trim()) push('explanation', 'Пустое объяснение');
  if (question.explanation.trim().length < 300) {
    push('explanation', 'Объяснение короче 300 символов');
  }
  if (!question.interviewTip.trim()) push('interviewTip', 'Пустой совет для интервью');
  if (!question.summary.trim()) push('summary', 'Пустое резюме');
  if (question.commonMistakes.length < 2) {
    push('commonMistakes', 'Нужно минимум два частых заблуждения');
  }
  if (question.tags.length < 2) push('tags', 'Нужно минимум два тега');

  const allowedTopics = CATEGORY_TOPICS.get(question.category);
  if (allowedTopics && !allowedTopics.has(question.topic)) {
    push('topic', `Тема «${question.topic}» не принадлежит категории`);
  }

  if (question.type === 'code-completion') {
    if (!question.completion) {
      push('completion', 'У code-completion отсутствует completion');
    } else {
      if (question.completion.acceptedAnswers.length < 1) {
        push('completion.acceptedAnswers', 'Нет допустимых ответов');
      }
      if (!question.completion.placeholder.trim()) {
        push('completion.placeholder', 'Нет placeholder');
      }
    }
    if (question.options && question.options.length > 0) {
      push('options', 'У code-completion не должно быть options');
    }
    if (question.correctAnswers.length === 0) push('correctAnswers', 'Нет правильного ответа');
  } else {
    if (!question.options || question.options.length !== 4) {
      push('options', 'У choice-вопроса должно быть ровно 4 варианта');
    } else {
      const optionIds = new Set<string>();
      for (const option of question.options) {
        if (optionIds.has(option.id)) push('options', `Дублирующийся id варианта: ${option.id}`);
        optionIds.add(option.id);
        if (!option.text.trim()) push('options.text', `Пустой текст варианта ${option.id}`);
        if (!option.explanation.trim()) {
          push('options.explanation', `Нет объяснения варианта ${option.id}`);
        }
      }
      for (const answer of question.correctAnswers) {
        if (!optionIds.has(answer)) {
          push('correctAnswers', `Вариант ${answer} не существует`);
        }
      }
      if (question.correctAnswers.length === 0) {
        push('correctAnswers', 'Нет правильного ответа');
      }
      if (question.type === 'multiple-choice' && question.correctAnswers.length < 2) {
        push('correctAnswers', 'В multiple-choice должно быть минимум 2 верных варианта');
      }
      if (question.type !== 'multiple-choice' && question.correctAnswers.length !== 1) {
        push('correctAnswers', 'В single-answer вопросе должен быть ровно один правильный вариант');
      }
    }
  }

  if (question.type === 'code-output' || question.type === 'find-bug') {
    if (!question.code?.trim()) push('code', 'Для задачи на код обязателен code');
    if (!question.codeLanguage) push('codeLanguage', 'Не указан язык кода');
  }

  return issues;
}

export function validateQuestionBank(questions: readonly Question[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenQuestionTexts = new Set<string>();

  for (const question of questions) {
    if (seenIds.has(question.id)) {
      issues.push({ questionId: question.id, field: 'id', message: 'Дублирующийся id' });
    }
    seenIds.add(question.id);
    const normalizedText = question.question.trim().toLowerCase();
    if (seenQuestionTexts.has(normalizedText)) {
      issues.push({
        questionId: question.id,
        field: 'question',
        message: 'Дублирующийся текст вопроса',
      });
    }
    seenQuestionTexts.add(normalizedText);
    issues.push(...validateQuestion(question));
  }

  for (const categoryId of CATEGORY_IDS) {
    const count = questions.filter((question) => question.category === categoryId).length;
    const expected = EXPECTED_QUESTION_COUNTS[categoryId];
    if (count !== expected) {
      issues.push({
        questionId: categoryId,
        field: 'categoryCount',
        message: `Ожидалось ${expected} вопросов, найдено ${count}`,
      });
    }
  }

  return issues;
}
