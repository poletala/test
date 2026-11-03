import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import { CATEGORY_BY_ID } from '../data/categories';
import { computeReadiness, READINESS_WEIGHTS_TEXT } from '../utils/readiness';
import { formatPercent, pluralizeRu } from '../utils/format';
import type { ReadinessDimension } from '../types';
import { createDefaultConfig } from '../stores/QuizStore';
import { PageHeader } from '../components/layout/PageHeader';
import { Ring } from '../components/common/Ring';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';
import { Button, ButtonLink } from '../components/common/Button';
import { Icon } from '../components/common/Icon';

const STATUS_LABELS: Record<ReadinessDimension['status'], string> = {
  'not-started': 'Не начато',
  weak: 'Слабый уровень',
  developing: 'Развивается',
  confident: 'Уверенно',
  strong: 'Сильно',
};

const STATUS_TONES: Record<
  ReadinessDimension['status'],
  'neutral' | 'danger' | 'warning' | 'accent' | 'success'
> = {
  'not-started': 'neutral',
  weak: 'danger',
  developing: 'warning',
  confident: 'accent',
  strong: 'success',
};

export const ReadinessPage = observer(function ReadinessPage() {
  const { questions, progress, quiz, ui } = useStores();
  const navigate = useNavigate();
  const readiness = computeReadiness(questions, progress.toState());
  const stats = progress.getOverallStats(questions);
  const state = progress.toState();

  const weakCategoryIds = new Set(
    readiness.weakDimensions.flatMap((dimension) => dimension.categories),
  );
  const recommended = questions
    .filter((question) => {
      const record = state.questions[question.id];
      return !record || record.attempts === 0 || record.lastCorrect === false;
    })
    .sort((a, b) => {
      const aWeak = weakCategoryIds.size === 0 || weakCategoryIds.has(a.category) ? 0 : 1;
      const bWeak = weakCategoryIds.size === 0 || weakCategoryIds.has(b.category) ? 0 : 1;
      if (aWeak !== bWeak) return aWeak - bWeak;
      return a.category.localeCompare(b.category);
    })
    .slice(0, 5);

  const startRecommended = () => {
    if (progress.activeQuiz) {
      ui.notify('Сначала завершите текущую сессию — рекомендации не должны её перезаписать.', 'warning');
      return;
    }
    if (recommended.length === 0) return;
    const config = {
      ...createDefaultConfig('study'),
      count: recommended.length,
    };
    if (quiz.startCustom(config, recommended.map((question) => question.id))) {
      navigate('/quiz');
    } else {
      ui.notify('Не удалось собрать рекомендации.', 'warning');
    }
  };

  const statusLabel =
    readiness.overall === 0
      ? 'Нужна диагностика'
      : readiness.overall < 50
        ? 'Ранний этап'
        : readiness.overall < 70
          ? 'База формируется'
          : readiness.overall < 85
            ? 'Почти готово'
            : 'Уверенный Middle';

  return (
    <div className="page readiness-page">
      <PageHeader
        eyebrow="Оценка готовности"
        title="Карта сильных и слабых направлений"
        description="Прозрачная оценка на основе ваших ответов. Она показывает, что стоит повторить, но не заменяет реальное собеседование."
        action={
          <ButtonLink to="/practice" variant="secondary" icon="practice">
            К практике
          </ButtonLink>
        }
      />

      <section className="readiness-hero">
        <div className="readiness-hero__score">
          <Ring value={readiness.overall} size={184} stroke={12} sublabel="readiness" />
          <div>
            <span className="eyebrow">Оценка по практике</span>
            <h2>{statusLabel}</h2>
            <p>
              {readiness.overall === 0
                ? 'Ответьте на несколько вопросов из разных модулей — оценка появится сразу. Сейчас все направления отмечены как непройденные.'
                : `Средний результат по девяти направлениям. Слабее всего: ${
                    readiness.weakDimensions[0]?.title ?? 'нет явных провалов'
                  }.`}
            </p>
          </div>
        </div>
        <div className="readiness-hero__stats">
          <div>
            <strong>{formatPercent(stats.firstAttemptAccuracy)}</strong>
            <span>точность первой попытки</span>
          </div>
          <div>
            <strong>{stats.answeredQuestions}</strong>
            <span>из {stats.totalQuestions} вопросов пройдено</span>
          </div>
          <div>
            <strong>{stats.masteredQuestions}</strong>
            <span>закреплено полностью</span>
          </div>
        </div>
      </section>

      <div className="readiness-layout">
        <section className="panel">
          <div className="panel__head">
            <div>
              <h2>Направления</h2>
              <p>Покрытие и стабильность ответов, а не скорость прохождения.</p>
            </div>
            <span className="panel__hint">{readiness.dimensions.length} областей</span>
          </div>
          <div className="dimension-grid">
            {readiness.dimensions.map((dimension) => (
              <article className="dimension-card" key={dimension.id}>
                <div className="dimension-card__head">
                  <h3>{dimension.title}</h3>
                  <Badge tone={STATUS_TONES[dimension.status]}>
                    {STATUS_LABELS[dimension.status]}
                  </Badge>
                </div>
                <p>{dimension.description}</p>
                <div className="dimension-card__score">
                  <strong>{dimension.score}%</strong>
                  <span>
                    {dimension.answered} / {dimension.total} вопросов
                  </span>
                </div>
                <ProgressBar
                  value={dimension.score}
                  tone={dimension.score >= 70 ? 'success' : dimension.score >= 40 ? 'warning' : 'danger'}
                  size="sm"
                  label={`Готовность: ${dimension.title}`}
                />
                <p className="dimension-card__recommendation">{dimension.recommendation}</p>
                <div className="dimension-card__links">
                  {dimension.categories.map((categoryId) => (
                    <ButtonLink
                      key={categoryId}
                      to={`/category/${categoryId}`}
                      variant="ghost"
                      size="sm"
                      icon="arrow-right"
                      iconPosition="right"
                    >
                      {CATEGORY_BY_ID[categoryId].shortTitle}
                    </ButtonLink>
                  ))}
                  {dimension.id === 'debugging' ? (
                    <ButtonLink to="/practice?mode=middle" variant="ghost" size="sm">
                      Практика Middle
                    </ButtonLink>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="readiness-aside">
          <section className="panel">
            <div className="panel__head">
              <h2>Слабые темы</h2>
              <Icon name="alert" size={18} />
            </div>
            {stats.weakest.length > 0 ? (
              <ul className="topic-rank">
                {stats.weakest.map((topic) => (
                  <li key={`${topic.categoryId}-${topic.topic}`}>
                    <span className="topic-rank__index topic-rank__index--weak">!</span>
                    <div>
                      <Link to={`/category/${topic.categoryId}`}>{topic.topic}</Link>
                      <span>{CATEGORY_BY_ID[topic.categoryId].shortTitle} · {topic.answered} отв.</span>
                    </div>
                    <strong>{formatPercent(topic.accuracy)}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="panel__empty">
                Как только появятся ответы, здесь будут темы с минимальной точностью.
              </p>
            )}
          </section>

          <section className="panel recommendations">
            <div className="panel__head">
              <h2>Рекомендуемые вопросы</h2>
              <span className="panel__hint">{recommended.length}</span>
            </div>
            <p className="recommendations__lead">
              Приоритет — непройденным вопросам из отстающих направлений.
            </p>
            <ul className="recommended-list">
              {recommended.map((question) => (
                <li key={question.id}>
                  <span className={`difficulty-dot difficulty-dot--${question.difficulty}`} />
                  <div>
                    <strong>{question.question}</strong>
                    <span>
                      {CATEGORY_BY_ID[question.category].shortTitle} · {question.topic}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <Button
              fullWidth
              icon="play"
              onClick={startRecommended}
              disabled={recommended.length === 0}
            >
              Тренировать рекомендации
            </Button>
            <p className="recommendations__note">
              {recommended.length} {pluralizeRu(recommended.length, 'вопрос', 'вопроса', 'вопросов')} в персональной выборке.
            </p>
          </section>

          <section className="panel methodology">
            <div className="panel__head">
              <h2>Как считается оценка</h2>
              <Icon name="chart" size={18} />
            </div>
            <div className="methodology__weights">
              <span><b>55%</b> первый ответ</span>
              <span><b>20%</b> последняя попытка</span>
              <span><b>25%</b> стабильность</span>
            </div>
            <p>{READINESS_WEIGHTS_TEXT}</p>
            <div className="methodology__legend">
              <span><i className="status-dot status-dot--danger" /> &lt; 50 — слабо</span>
              <span><i className="status-dot status-dot--warning" /> 50–69 — средне</span>
              <span><i className="status-dot status-dot--accent" /> 70–84 — уверенно</span>
              <span><i className="status-dot status-dot--success" /> 85+ — сильно</span>
            </div>
            <p className="methodology__caveat">
              Это практическая эвристика. Она не учитывает soft skills, опыт проектов и
              стресс на реальном интервью и не гарантирует трудоустройство.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
});
