import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import { CATEGORIES, CATEGORY_BY_ID, MODE_LABELS } from '../data/categories';
import { computeReadiness } from '../utils/readiness';
import { getRecentAttempts } from '../utils/stats';
import { formatDuration, formatPercent, formatRelativeDate, pluralizeRu } from '../utils/format';
import { createDefaultConfig } from '../stores/QuizStore';
import { PageHeader } from '../components/layout/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Ring } from '../components/common/Ring';
import { Button, ButtonLink } from '../components/common/Button';
import { Icon } from '../components/common/Icon';
import { CategoryCard } from '../components/dashboard/CategoryCard';
import { ActivityList } from '../components/dashboard/ActivityList';
import type { QuizConfig } from '../types';

export const DashboardPage = observer(function DashboardPage() {
  const { questions, progress, quiz, ui } = useStores();
  const navigate = useNavigate();
  const stats = progress.getOverallStats(questions);
  const readiness = computeReadiness(questions, progress.toState());
  const activity = getRecentAttempts(progress.toState(), 5);
  const active = progress.activeQuiz;

  const activeCount = active
    ? Object.values(active.answers).filter((answer) => answer.submitted).length
    : 0;

  const startMode = (mode: QuizConfig['mode']) => {
    const config = createDefaultConfig(mode);
    if (mode === 'middle') {
      config.difficulties = ['junior-plus', 'middle'];
      config.count = 12;
    }
    if (quiz.start(config)) {
      navigate('/quiz');
    } else {
      ui.notify('Для этого режима пока нет подходящих вопросов.', 'warning');
    }
  };

  const weakCategories = [...stats.byCategory]
    .filter((item) => item.answered < item.total)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 3);

  return (
    <div className="page dashboard-page">
      <PageHeader
        eyebrow="Подготовка к Middle Frontend"
        title="Учитесь думать как инженер, а не запоминать ответы"
        description="350 вопросов с разбором механизмов, отладкой и реальными сценариями. Прогресс хранится в браузере — можно вернуться в любой момент."
        action={
          active ? (
            <ButtonLink to="/quiz" icon="play" size="lg">
              Продолжить сессию
            </ButtonLink>
          ) : (
            <Button icon="play" size="lg" onClick={() => navigate('/practice')}>
              Начать тренировку
            </Button>
          )
        }
      />

      {active ? (
        <section className="continue-banner">
          <span className="continue-banner__icon">
            <Icon name="refresh" size={22} />
          </span>
          <div className="continue-banner__body">
            <strong>Незавершённая сессия · {MODE_LABELS[active.config.mode]}</strong>
            <span>
              {activeCount} из {active.questionIds.length} вопросов · начата{' '}
              {formatRelativeDate(active.startedAt)}
            </span>
          </div>
          <ButtonLink to="/quiz" variant="secondary" size="sm" icon="arrow-right" iconPosition="right">
            Продолжить
          </ButtonLink>
        </section>
      ) : null}

      <div className="dashboard-hero-grid">
        <section className="hero-card">
          <div className="hero-card__content">
            <span className="eyebrow">
              <Icon name="sparkles" size={16} /> Системная практика
            </span>
            <h2>От уверенного Junior к сильному Middle</h2>
            <p>
              Начните с диагностики: 10 смешанных вопросов покажут, где теория уже работает,
              а где пока только узнаётся. После каждой ошибки вы получите разбор, а не сухое «неверно».
            </p>
            <div className="hero-card__actions">
              <ButtonLink to="/practice" icon="play">
                Выбрать режим
              </ButtonLink>
              <Button variant="secondary" icon="flame" onClick={() => startMode('middle')}>
                Middle Challenge
              </Button>
            </div>
            <div className="hero-card__facts">
              <span>
                <strong>10</strong> модулей
              </span>
              <span>
                <strong>6</strong> форматов
              </span>
              <span>
                <strong>3</strong> уровня
              </span>
            </div>
          </div>
          <div className="hero-card__art" aria-hidden="true">
            <div className="code-orb">
              <span>const</span> <b>next</b> <span>=</span> <i>level</i>
              <small>Middle</small>
            </div>
          </div>
        </section>

        <section className="readiness-card">
          <div className="readiness-card__head">
            <span className="eyebrow">Готовность</span>
            <Link to="/readiness" className="text-link">
              Подробнее <Icon name="arrow-right" size={15} />
            </Link>
          </div>
          <div className="readiness-card__main">
            <Ring value={readiness.overall} sublabel="оценка" size={122} />
            <div>
              <strong className="readiness-card__title">
                {readiness.overall === 0
                  ? 'Нужна диагностика'
                  : readiness.overall < 50
                    ? 'Есть пробелы'
                    : readiness.overall < 70
                      ? 'Развивающийся уровень'
                      : readiness.overall < 85
                        ? 'Уверенная база'
                        : 'Сильный уровень'}
              </strong>
              <p>
                {readiness.overall === 0
                  ? 'Ответьте на первые вопросы, чтобы оценка стала содержательной.'
                  : `Слабое направление: ${readiness.weakDimensions[0]?.title ?? 'пока нет'}.`}
              </p>
            </div>
          </div>
          <div className="readiness-card__foot">
            <span>
              <Icon name="target" size={15} /> Оценка по практике, не гарантия оффера
            </span>
          </div>
        </section>
      </div>

      <section className="stats-grid" aria-label="Общая статистика">
        <StatCard
          icon="layers"
          label="Всего вопросов"
          value={stats.totalQuestions}
          hint="10 учебных модулей"
          tone="neutral"
        />
        <StatCard
          icon="check"
          label="Пройдено"
          value={stats.answeredQuestions}
          hint={`${stats.masteredQuestions} закреплено`}
          tone="success"
        />
        <StatCard
          icon="target"
          label="Точность с первой попытки"
          value={formatPercent(stats.firstAttemptAccuracy)}
          hint={`${stats.totalAttempts} попыток всего`}
          tone="accent"
        />
        <StatCard
          icon="bookmark"
          label="В закладках"
          value={stats.bookmarks}
          hint="для повторения"
          tone="warning"
        />
      </section>

      <div className="dashboard-columns">
        <section className="panel panel--wide">
          <div className="panel__head">
            <div>
              <h2>Карта знаний</h2>
              <p>Прогресс по каждому направлению. Заходите в модуль, чтобы выбрать сложность.</p>
            </div>
            <Link className="text-link" to="/practice">
              Все режимы <Icon name="arrow-right" size={15} />
            </Link>
          </div>
          <div className="category-grid">
            {CATEGORIES.map((category) => {
              const categoryStats = stats.byCategory.find(
                (item) => item.categoryId === category.id,
              );
              return categoryStats ? (
                <CategoryCard key={category.id} category={category} stats={categoryStats} />
              ) : null;
            })}
          </div>
        </section>

        <aside className="dashboard-aside">
          <section className="panel">
            <div className="panel__head">
              <h2>Сильные темы</h2>
              <span className="panel__hint">по точности</span>
            </div>
            {stats.strongest.length > 0 ? (
              <ul className="topic-rank">
                {stats.strongest.map((topic, index) => (
                  <li key={`${topic.categoryId}-${topic.topic}`}>
                    <span className="topic-rank__index">{index + 1}</span>
                    <div>
                      <Link to={`/category/${topic.categoryId}`}>{topic.topic}</Link>
                      <span>{CATEGORY_BY_ID[topic.categoryId].shortTitle}</span>
                    </div>
                    <strong>{formatPercent(topic.accuracy)}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="panel__empty">Пока нет данных. Ответьте хотя бы на несколько вопросов.</p>
            )}
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2>Требует внимания</h2>
              <Link className="text-link" to="/readiness">
                План
              </Link>
            </div>
            {stats.weakest.length > 0 ? (
              <ul className="topic-rank">
                {stats.weakest.map((topic) => (
                  <li key={`${topic.categoryId}-${topic.topic}`}>
                    <span className="topic-rank__index topic-rank__index--weak">
                      <Icon name="alert" size={13} />
                    </span>
                    <div>
                      <Link to={`/category/${topic.categoryId}`}>{topic.topic}</Link>
                      <span>{CATEGORY_BY_ID[topic.categoryId].shortTitle}</span>
                    </div>
                    <strong>{formatPercent(topic.accuracy)}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="panel__empty">Слабые темы определятся после первых ответов.</p>
            )}
          </section>
        </aside>
      </div>

      <div className="dashboard-columns dashboard-columns--bottom">
        <section className="panel">
          <div className="panel__head">
            <h2>Последняя активность</h2>
            <span className="panel__hint">{formatRelativeDate(progress.lastActivityAt)}</span>
          </div>
          <ActivityList items={activity} questions={questions} />
        </section>

        <section className="panel focus-panel">
          <div className="panel__head">
            <h2>С чего продолжить</h2>
            <Icon name="target" size={18} />
          </div>
          <p className="focus-panel__intro">
            Наименее закрытые направления. Короткая сессия по 10 вопросов даст больше,
            чем бесконечный просмотр теории.
          </p>
          <ol className="focus-list">
            {weakCategories.map((item) => {
              const category = CATEGORY_BY_ID[item.categoryId];
              return (
                <li key={item.categoryId}>
                  <span className="focus-list__dot" style={{ background: category.accent }} />
                  <div>
                    <strong>{category.title}</strong>
                    <span>
                      {item.answered === 0
                        ? 'ещё не начато'
                        : `${item.answered} ${pluralizeRu(item.answered, 'вопрос', 'вопроса', 'вопросов')} пройдено`}
                    </span>
                  </div>
                  <Link
                    className="icon-button"
                    to={`/category/${item.categoryId}`}
                    aria-label={`Открыть ${category.title}`}
                  >
                    <Icon name="arrow-right" size={17} />
                  </Link>
                </li>
              );
            })}
          </ol>
          <Button variant="secondary" fullWidth icon="refresh" onClick={() => startMode('random')}>
            Случайные 10 вопросов
          </Button>
          {progress.completedSessions > 0 && progress.lastActivityAt ? (
            <p className="focus-panel__last">
              Последняя сессия: {formatDuration(
                progress.sessions[0]?.durationSec ?? 0,
              )} · {progress.completedSessions} всего
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
});
