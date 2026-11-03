import { CATEGORIES } from '../data/categories';
import type {
  CategoryId,
  CategoryStats,
  OverallStats,
  ProgressState,
  Question,
  TopicStats,
} from '../types';

export function questionMastery(record: {
  firstAttemptCorrect: boolean | null;
  lastCorrect: boolean | null;
  attempts: number;
  correctAttempts: number;
}): number {
  if (record.attempts === 0) return 0;
  const first = record.firstAttemptCorrect ? 55 : 0;
  const last = record.lastCorrect ? 20 : 0;
  const consistency = (record.correctAttempts / record.attempts) * 25;
  return Math.round(first + last + consistency);
}

export function computeOverallStats(
  questions: readonly Question[],
  progress: ProgressState,
): OverallStats {
  const categoryStats: CategoryStats[] = [];
  const topicMap = new Map<string, TopicStats>();

  for (const category of CATEGORIES) {
    const categoryQuestions = questions.filter((question) => question.category === category.id);
    let answered = 0;
    let correctness = 0;
    let attempts = 0;
    let masterySum = 0;

    for (const question of categoryQuestions) {
      const record = progress.questions[question.id];
      const topicKey = `${category.id}::${question.topic}`;
      const existing = topicMap.get(topicKey) ?? {
        categoryId: category.id,
        topic: question.topic,
        total: 0,
        answered: 0,
        correct: 0,
        accuracy: null,
      };
      existing.total += 1;
      if (record && record.attempts > 0) {
        answered += 1;
        attempts += record.attempts;
        correctness += record.correctAttempts;
        masterySum += questionMastery(record);
        existing.answered += 1;
        existing.correct += record.correctAttempts;
      }
      topicMap.set(topicKey, existing);
    }

    categoryStats.push({
      categoryId: category.id,
      total: categoryQuestions.length,
      answered,
      correct: correctness,
      accuracy: attempts > 0 ? Math.round((correctness / attempts) * 100) : null,
      mastery:
        categoryQuestions.length > 0
          ? Math.round(masterySum / categoryQuestions.length)
          : 0,
    });
  }

  const allRecords = Object.entries(progress.questions).filter(([, record]) => record.attempts > 0);
  const totalAttempts = allRecords.reduce((sum, [, record]) => sum + record.attempts, 0);
  const totalCorrectAttempts = allRecords.reduce(
    (sum, [, record]) => sum + record.correctAttempts,
    0,
  );
  const answeredQuestions = allRecords.length;
  const firstAttemptCorrect = allRecords.filter(
    ([, record]) => record.firstAttemptCorrect === true,
  ).length;
  const masteredQuestions = allRecords.filter(
    ([, record]) => record.firstAttemptCorrect === true && record.lastCorrect === true,
  ).length;

  // Точность тем считаем по сохранённым attempts, а не приблизительно.
  const topicStats = [...topicMap.values()];
  for (const topic of topicStats) {
    const topicQuestions = questions.filter(
      (question) =>
        question.category === topic.categoryId && question.topic === topic.topic,
    );
    let attempts = 0;
    let correct = 0;
    for (const question of topicQuestions) {
      const record = progress.questions[question.id];
      if (!record) continue;
      attempts += record.attempts;
      correct += record.correctAttempts;
    }
    topic.accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : null;
    topic.correct = correct;
  }

  const rankedTopics = topicStats
    .filter((topic) => topic.answered >= 1 && topic.accuracy !== null)
    .sort((a, b) => (b.accuracy ?? 0) - (a.accuracy ?? 0));

  return {
    totalQuestions: questions.length,
    answeredQuestions,
    masteredQuestions,
    firstAttemptCorrect,
    firstAttemptAccuracy:
      answeredQuestions > 0
        ? Math.round((firstAttemptCorrect / answeredQuestions) * 100)
        : null,
    overallAccuracy:
      totalAttempts > 0 ? Math.round((totalCorrectAttempts / totalAttempts) * 100) : null,
    totalAttempts,
    bookmarks: progress.bookmarks.length,
    byCategory: categoryStats,
    strongest: rankedTopics.slice(0, 3),
    weakest: [...rankedTopics].reverse().slice(0, 3),
  };
}

export function getRecentAttempts(
  progress: ProgressState,
  limit = 6,
): { questionId: string; at: string; correct: boolean; mode: string }[] {
  const events = Object.entries(progress.questions).flatMap(([questionId, record]) =>
    record.history.map((event) => ({
      questionId,
      at: event.at,
      correct: event.correct,
      mode: event.mode,
    })),
  );
  return events
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, limit);
}

export function computeCategoryTopicStats(
  questions: readonly Question[],
  progress: ProgressState,
  categoryId: CategoryId,
): TopicStats[] {
  const categoryQuestions = questions.filter((question) => question.category === categoryId);
  const topics = new Map<string, TopicStats>();
  for (const question of categoryQuestions) {
    const topic = topics.get(question.topic) ?? {
      categoryId,
      topic: question.topic,
      total: 0,
      answered: 0,
      correct: 0,
      accuracy: null,
    };
    topic.total += 1;
    const record = progress.questions[question.id];
    if (record && record.attempts > 0) {
      topic.answered += 1;
      topic.correct += record.correctAttempts;
    }
    topics.set(question.topic, topic);
  }
  for (const topic of topics.values()) {
    const related = categoryQuestions.filter((question) => question.topic === topic.topic);
    let attempts = 0;
    let correct = 0;
    for (const question of related) {
      const record = progress.questions[question.id];
      if (!record) continue;
      attempts += record.attempts;
      correct += record.correctAttempts;
    }
    topic.accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : null;
  }
  return [...topics.values()];
}

export function getTopicAccuracyForQuestionIds(
  questions: readonly Question[],
  questionIds: readonly string[],
  progress: ProgressState,
): TopicStats[] {
  const ids = new Set(questionIds);
  const topics = new Map<string, TopicStats>();
  for (const question of questions) {
    if (!ids.has(question.id)) continue;
    const key = `${question.category}::${question.topic}`;
    const stat = topics.get(key) ?? {
      categoryId: question.category,
      topic: question.topic,
      total: 0,
      answered: 0,
      correct: 0,
      accuracy: null,
    };
    stat.total += 1;
    const record = progress.questions[question.id];
    if (record && record.attempts > 0) {
      stat.answered += 1;
      stat.correct += record.correctAttempts;
    }
    topics.set(key, stat);
  }
  return [...topics.values()];
}
