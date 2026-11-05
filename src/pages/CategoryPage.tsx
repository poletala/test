import { useMemo, useState, type CSSProperties } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import { CATEGORY_BY_ID } from '../data/categories';
import { computeCategoryTopicStats } from '../utils/stats';
import { buildQuestionIds, filterQuestions } from '../utils/questions';
import { formatPercent, pluralizeRu } from '../utils/format';
import { CATEGORY_IDS, type CategoryId, type Difficulty, type QuizConfig } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { Button, ButtonLink } from '../components/common/Button';
import { DifficultyBadge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Ring } from '../components/common/Ring';
import { Icon } from '../components/common/Icon';
import { EmptyState } from '../components/common/EmptyState';

const DIFFICULTIES: Difficulty[] = ['junior', 'junior-plus', 'middle'];

export const CategoryPage = observer(function CategoryPage() {
  const { categoryId } = useParams();
  const { questions, progress, quiz, ui } = useStores();
  const navigate = useNavigate();
  const [difficulties, setDifficulties] = useState<Difficulty[]>(DIFFICULTIES);
  const [count, setCount] = useState(10);
  const [starting, setStarting] = useState(false);

  const isValid = CATEGORY_IDS.includes(categoryId as CategoryId);
  const id = categoryId as CategoryId;
  const category = isValid ? CATEGORY_BY_ID[id] : null;
  const categoryQuestions = useMemo(
    () => (category ? questions.filter((question) => question.category === category.id) : []),
    [questions, category],
  );
  const stats = progress.getOverallStats(questions).byCategory.find(
    (item) => item.categoryId === id,
  );
  const topics = category
    ? computeCategoryTopicStats(questions, progress.toState(), category.id)
    : [];

  if (!category || !stats) {
    return (
      <div className="page">
        <EmptyState
          icon="alert"
          title="Такого модуля нет"
          description="Проверьте адрес или вернитесь к списку направлений."
          action={<ButtonLink to="/">На главную</ButtonLink>}
        />
      </div>
    );
  }

  const difficultyCounts = DIFFICULTIES.map((difficulty) => ({
    difficulty,
    count: categoryQuestions.filter((question) => question.difficulty === difficulty).length,
  }));
  const available = filterQuestions(categoryQuestions, {
    categoryId: category.id,
    difficulties,
  }).length;
  const actualCount = Math.min(count, available);
  const style = { '--category-accent': category.accent } as CSSProperties;

  const toggleDifficulty = (difficulty: Difficulty) => {
    setDifficulties((current) =>
      current.includes(difficulty)
        ? current.filter((item) => item !== difficulty)
        : [...current, difficulty],
    );
  };

  const startQuiz = () => {
    if (progress.activeQuiz) {
      ui.notify('Сначала завершите текущую сессию, чтобы не потерять её прогресс.', 'warning');
      navigate('/quiz');
      return;
    }
    if (difficulties.length === 0 || available === 0) {
      ui.notify('Выберите хотя бы один уровень сложности.', 'warning');
      return;
    }
    setStarting(true);
    const config: QuizConfig = {
      mode: 'study',
      categoryId: category.id,
      difficulties,
      count: actualCount,
      timed: false,
      secondsPerQuestion: 90,
    };
    const started = quiz.start(config);
    setStarting(false);
    if (started) navigate('/quiz');
    else ui.notify('Не удалось собрать вопросы для этой выборки.', 'warning');
  };

  const startMistakes = () => {
    if (progress.activeQuiz) {
      ui.notify('Сначала завершите текущую сессию, чтобы не потерять её прогресс.', 'warning');
      navigate('/quiz');
      return;
    }
    const ids = buildQuestionIds({
      mode: 'mistakes',
      categoryId: category.id,
      difficulties: DIFFICULTIES,
      count: 20,
      questions,
      progress: progress.toState(),
    });
    if (ids.length === 0) {
      ui.notify('В этом модуле пока нет вопросов с ошибками.', 'info');
      return;
    }
    const started = quiz.start({
      mode: 'mistakes',
      categoryId: category.id,
      difficulties: DIFFICULTIES,
      count: 20,
      timed: false,
      secondsPerQuestion: 90,
    });
    if (started) navigate('/quiz');
  };

  return (
    <div className="page category-page" style={style}>
      <Link to="/" className="back-link">
        <Icon name="arrow-left" size={16} /> Все направления
      </Link>

      <PageHeader
        eyebrow={`Модуль · ${category.shortTitle}`}
        title={category.title}
        description={category.description}
        action={
          <ButtonLink
            to="/practice"
            variant="secondary"
            icon="layers"
          >
            Все режимы
          </ButtonLink>
        }
      />

      <section className="category-hero">
        <span className="category-hero__icon" aria-hidden="true">
          {category.icon}
        </span>
        <div className="category-hero__main">
          <div className="category-hero__numbers">
            <div>
              <strong>{categoryQuestions.length}</strong>
              <span>вопросов</span>
            </div>
            <div>
              <strong>{stats.answered}</strong>
              <span>пройдено</span>
            </div>
            <div>
              <strong>{formatPercent(stats.accuracy)}</strong>
              <span>точность</span>
            </div>
          </div>
          <ProgressBar
            value={stats.answered}
            max={categoryQuestions.length}
            label={`Прогресс модуля ${category.title}`}
          />
          <p>
            {stats.answered === 0
              ? 'Модуль ещё не начат. Начните с Junior-вопросов, затем переходите к практике.'
              : `Вы закрыли ${stats.answered} ${pluralizeRu(
                  stats.answered,
                  'вопрос',
                  'вопроса',
                  'вопросов',
                )}. До полного прохождения осталось ${Math.max(
                  0,
                  categoryQuestions.length - stats.answered,
                )}.`}
          </p>
        </div>
        <Ring value={stats.mastery} sublabel="мастерство" size={128} />
      </section>

      <div className="category-layout">
        <div className="category-layout__main">
          <section className="panel">
            <div className="panel__head">
              <div>
                <h2>Темы модуля</h2>
                <p>Отслеживайте покрытие и точность, чтобы не переучивать знакомое.</p>
              </div>
              <span className="panel__hint">{topics.length} тем</span>
            </div>
            <div className="topic-table">
              {topics.map((topic) => (
                <div className="topic-row" key={topic.topic}>
                  <div className="topic-row__name">
                    <span className="topic-row__marker" />
                    <div>
                      <strong>{topic.topic}</strong>
                      <span>
                        {topic.answered} / {topic.total} вопросов
                      </span>
                    </div>
                  </div>
                  <div className="topic-row__bar">
                    <ProgressBar
                      value={topic.answered}
                      max={topic.total}
                      size="sm"
                      tone={topic.answered === 0 ? 'accent' : 'success'}
                      label={`Покрытие темы ${topic.topic}`}
                    />
                  </div>
                  <span className={`topic-row__accuracy ${topic.accuracy !== null && topic.accuracy < 60 ? 'topic-row__accuracy--weak' : ''}`}>
                    {topic.accuracy === null ? '—' : formatPercent(topic.accuracy)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <div>
                <h2>Уровни сложности</h2>
                <p>Junior — база, Junior+ — практическое применение, Middle — поведение и tradeoffs.</p>
              </div>
            </div>
            <div className="difficulty-cards">
              {difficultyCounts.map(({ difficulty, count: difficultyCount }) => (
                <button
                  key={difficulty}
                  type="button"
                  className={`difficulty-card ${difficulties.includes(difficulty) ? 'difficulty-card--on' : ''}`}
                  onClick={() => toggleDifficulty(difficulty)}
                  aria-pressed={difficulties.includes(difficulty)}
                >
                  <DifficultyBadge difficulty={difficulty} />
                  <strong>{difficultyCount}</strong>
                  <span>{pluralizeRu(difficultyCount, 'вопрос', 'вопроса', 'вопросов')}</span>
                  <i aria-hidden="true">{difficulties.includes(difficulty) ? '✓' : '+'}</i>
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="category-layout__aside">
          <section className="panel start-panel">
            <span className="eyebrow">Тренировка</span>
            <h2>Соберите сессию</h2>
            <p>Вопросы перемешаются. В режиме обучения разбор появится сразу после ответа.</p>

            <fieldset className="field-group">
              <legend>Количество вопросов</legend>
              <div className="segmented">
                {[5, 10, 20, 50].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={count === value ? 'segmented__item segmented__item--active' : 'segmented__item'}
                    onClick={() => setCount(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="start-panel__summary">
              <span>Доступно по фильтрам</span>
              <strong>
                {actualCount} {pluralizeRu(actualCount, 'вопрос', 'вопроса', 'вопросов')}
              </strong>
            </div>

            <Button fullWidth size="lg" icon="play" onClick={startQuiz} disabled={actualCount === 0 || starting}>
              Начать обучение
            </Button>
            <Button fullWidth variant="secondary" icon="refresh" onClick={startMistakes}>
              Практика ошибок
            </Button>
            <p className="start-panel__note">
              <Icon name="shield" size={14} /> Без таймера. Можно пользоваться подсказками.
            </p>
          </section>

          <section className="panel">
            <h2 className="panel__small-title">Как проходить модуль</h2>
            <ul className="tip-list">
              <li>
                <Icon name="book" size={16} /> Сначала ответьте без подсказки — так видна реальная
                картина.
              </li>
              <li>
                <Icon name="refresh" size={16} /> Повторяйте ошибки через день, а не сразу.
              </li>
              <li>
                <Icon name="target" size={16} /> Цель — объяснить ответ вслух, а не угадать вариант.
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
});
