import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import { CATEGORY_BY_ID, MODE_LABELS } from '../data/categories';
import { formatDuration, formatPercent, pluralizeRu } from '../utils/format';
import { createDefaultConfig } from '../stores/QuizStore';
import type { SessionResult } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { Button, ButtonLink } from '../components/common/Button';
import { Ring } from '../components/common/Ring';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { EmptyState } from '../components/common/EmptyState';
import { ExplanationPanel } from '../components/quiz/ExplanationPanel';
import { Icon } from '../components/common/Icon';

function reviewRecommendation(result: SessionResult): string[] {
  const weakTopics = result.topics
    .filter((topic) => topic.total > 0 && topic.correct / topic.total < 0.6)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)
    .slice(0, 3);
  if (weakTopics.length === 0) {
    return [
      'Повысьте сложность: перейдите на Junior+ и Middle-вопросы.',
      'Попробуйте режим интервью с таймером — он проверяет не только знание, но и скорость формулирования.',
      'Вернитесь к ошибкам через день, чтобы закрепить материал интервально.',
    ];
  }
  return weakTopics.map(
    (topic) =>
      `Повторите «${topic.topic}»: ${topic.correct} из ${topic.total} верно. Начните с разбора ошибок и одного практического примера.`,
  );
}

export const ResultsPage = observer(function ResultsPage() {
  const { sessionId } = useParams();
  const { quiz, progress, questions, ui } = useStores();
  const navigate = useNavigate();
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const result = sessionId ? quiz.getSessionById(sessionId) : quiz.latestResult;

  if (!result) {
    return (
      <div className="page">
        <EmptyState
          icon="chart"
          title="Результат не найден"
          description="Возможно, сессия ещё не завершена или история была очищена. Запустите новую тренировку."
          action={<ButtonLink to="/practice" icon="play">К практике</ButtonLink>}
        />
      </div>
    );
  }

  const accuracy = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
  const incorrect = result.total - result.correct;
  const questionMap = new Map(questions.map((question) => [question.id, question]));
  const wrongTopics = [...result.topics]
    .filter((topic) => topic.total > 0)
    .sort((a, b) => a.correct / a.total - b.correct / b.total);
  const scoreLabel =
    accuracy >= 85
      ? 'Сильный результат'
      : accuracy >= 70
        ? 'Уверенная база'
        : accuracy >= 50
          ? 'Есть над чем работать'
          : 'Нужно вернуться к основам';

  const startMistakes = () => {
    const config = {
      ...createDefaultConfig('mistakes'),
      categoryId: result.categoryId,
      difficulties: result.difficulties,
      count: 20,
    };
    if (quiz.start(config)) navigate('/quiz');
    else ui.notify('В этой сессии пока нет ошибок для повторной практики.', 'info');
  };

  const repeatSession = () => {
    const config = {
      ...createDefaultConfig(result.mode),
      categoryId: result.categoryId,
      difficulties: result.difficulties,
      count: result.total,
      timed: result.mode === 'interview',
      secondsPerQuestion: 90,
    };
    if (quiz.start(config)) navigate('/quiz');
    else ui.notify('Не удалось собрать вопросы для повторной сессии.', 'warning');
  };

  return (
    <div className="page results-page">
      <PageHeader
        eyebrow={`Результат · ${MODE_LABELS[result.mode]}`}
        title={scoreLabel}
        description={`Сессия завершена ${new Intl.DateTimeFormat('ru-RU', {
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(result.finishedAt))}. Разбор доступен ниже.`}
        action={
          <div className="page-header__actions">
            <Button variant="secondary" icon="refresh" onClick={startMistakes}>
              Разобрать ошибки
            </Button>
            <Button icon="play" onClick={repeatSession}>
              Пройти ещё раз
            </Button>
          </div>
        }
      />

      <section className="result-hero">
        <Ring value={accuracy} size={156} sublabel="точность" />
        <div className="result-hero__main">
          <span className="eyebrow">
            {result.correct} из {result.total} верно
          </span>
          <h2>{scoreLabel}</h2>
          <p>
            {accuracy >= 70
              ? 'Вы уверенно держите базу. Проверьте, сможете ли объяснить те же механизмы вслух и без подсказок.'
              : 'Результат — это диагностика, а не приговор. Сначала разберите ошибки, затем повторите тему через практический пример.'}
          </p>
          <div className="result-hero__meta">
            <span>
              <Icon name="clock" size={15} /> {formatDuration(result.durationSec)}
            </span>
            <span>
              <Icon name="layers" size={15} /> {result.total}{' '}
              {pluralizeRu(result.total, 'вопрос', 'вопроса', 'вопросов')}
            </span>
            <span>
              <Icon name="bookmark" size={15} />{' '}
              {result.categoryId === 'all'
                ? 'Все модули'
                : CATEGORY_BY_ID[result.categoryId].title}
            </span>
          </div>
        </div>
        <div className="result-hero__score">
          <span>Правильных</span>
          <strong>{result.correct}</strong>
          <span className="result-hero__wrong">{incorrect} с ошибкой</span>
        </div>
      </section>

      <div className="stats-grid stats-grid--three">
        <StatCard icon="check" label="Верных ответов" value={result.correct} tone="success" />
        <StatCard icon="close" label="Ошибок" value={incorrect} tone="warning" />
        <StatCard
          icon="target"
          label="Точность сессии"
          value={formatPercent(accuracy)}
          hint="в этой сессии, не за всё время"
          tone="accent"
        />
      </div>

      <div className="results-columns">
        <section className="panel">
          <div className="panel__head">
            <div>
              <h2>По темам</h2>
              <p>Где знания уже работают, а где нужен ещё один проход.</p>
            </div>
          </div>
          <div className="result-topics">
            {wrongTopics.map((topic) => {
              const topicAccuracy = topic.total > 0 ? Math.round((topic.correct / topic.total) * 100) : 0;
              return (
                <div key={topic.topic} className="result-topic">
                  <div className="result-topic__head">
                    <span>{topic.topic}</span>
                    <strong>
                      {topic.correct}/{topic.total} · {topicAccuracy}%
                    </strong>
                  </div>
                  <ProgressBar
                    value={topic.correct}
                    max={topic.total}
                    tone={topicAccuracy >= 70 ? 'success' : topicAccuracy >= 50 ? 'warning' : 'danger'}
                    size="sm"
                    label={`Результат по теме ${topic.topic}`}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel recommendations">
          <div className="panel__head">
            <h2>Что делать дальше</h2>
            <Icon name="target" size={18} />
          </div>
          <ol>
            {reviewRecommendation(result).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <p className="recommendations__note">
            Оценка основана только на этой сессии. Общая готовность учитывает все попытки
            и покрытие банка вопросов.
          </p>
          <ButtonLink to="/readiness" variant="secondary" fullWidth icon="readiness">
            Открыть карту готовности
          </ButtonLink>
        </section>
      </div>

      <section className="panel review-panel">
        <div className="panel__head">
          <div>
            <h2>Разбор вопросов</h2>
            <p>
              Правильный ответ, объяснение выбора и типичные ошибки. В режиме интервью
              именно здесь открывается отложенный разбор.
            </p>
          </div>
          <span className="panel__hint">{result.answers.length} вопросов</span>
        </div>
        <div className="review-list">
          {result.questionIds.map((questionId, index) => {
            const question = questionMap.get(questionId);
            const answer = result.answers.find((item) => item.questionId === questionId);
            if (!question || !answer) return null;
            const open = openQuestion === questionId;
            return (
              <div key={questionId} className={`review-item ${open ? 'review-item--open' : ''}`}>
                <button
                  type="button"
                  className="review-item__head"
                  onClick={() => setOpenQuestion(open ? null : questionId)}
                  aria-expanded={open}
                >
                  <span className={`review-item__status ${answer.correct ? 'review-item__status--ok' : 'review-item__status--bad'}`}>
                    <Icon name={answer.correct ? 'check' : 'close'} size={15} />
                  </span>
                  <span className="review-item__number">{index + 1}</span>
                  <span className="review-item__question">
                    <strong>{question.question}</strong>
                    <span>{question.topic} · {question.difficulty === 'junior' ? 'Junior' : question.difficulty === 'junior-plus' ? 'Junior+' : 'Middle'}</span>
                  </span>
                  <Icon name="chevron-down" size={18} />
                </button>
                {open ? (
                  <div className="review-item__body">
                    <ExplanationPanel
                      question={question}
                      selectedAnswers={answer.selectedAnswers}
                      textAnswer={answer.textAnswer}
                      bookmarked={progress.isBookmarked(question.id)}
                      onToggleBookmark={() => progress.toggleBookmark(question.id)}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <div className="results-actions">
        <ButtonLink to="/" variant="ghost" icon="arrow-left">
          На главную
        </ButtonLink>
        <ButtonLink to="/readiness" variant="secondary" icon="target">
          Карта готовности
        </ButtonLink>
        <ButtonLink to="/practice" icon="play">
          Новая тренировка
        </ButtonLink>
      </div>
    </div>
  );
});
