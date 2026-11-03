import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import {
  CATEGORIES,
  CATEGORY_BY_ID,
  DIFFICULTY_LABELS,
  MODE_DESCRIPTIONS,
  MODE_LABELS,
} from '../data/categories';
import { buildQuestionIds, getDefaultDifficulties } from '../utils/questions';
import { formatRelativeDate, pluralizeRu } from '../utils/format';
import type { CategoryId, Difficulty, QuizConfig, QuizMode } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { Badge, DifficultyBadge } from '../components/common/Badge';
import { Icon, type IconName } from '../components/common/Icon';
import { Modal } from '../components/common/Modal';

const MODES: { mode: QuizMode; icon: IconName; accent: string; tag?: string }[] = [
  { mode: 'study', icon: 'book', accent: '#7c8cff', tag: 'Рекомендуем' },
  { mode: 'interview', icon: 'clock', accent: '#f59e0b', tag: 'С таймером' },
  { mode: 'mistakes', icon: 'refresh', accent: '#ef4444' },
  { mode: 'random', icon: 'sparkles', accent: '#8b5cf6' },
  { mode: 'middle', icon: 'flame', accent: '#22c55e', tag: 'Hard' },
  { mode: 'bookmarks', icon: 'bookmark', accent: '#ec4899' },
];

const DIFFICULTIES: Difficulty[] = ['junior', 'junior-plus', 'middle'];
const VALID_MODES = new Set<QuizMode>(MODES.map((item) => item.mode));

export const PracticePage = observer(function PracticePage() {
  const { questions, progress, quiz, ui } = useStores();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedMode = searchParams.get('mode') as QuizMode | null;
  const requestedCategory = searchParams.get('category') as CategoryId | null;
  const initialMode: QuizMode = requestedMode && VALID_MODES.has(requestedMode) ? requestedMode : 'study';
  const [mode, setMode] = useState<QuizMode>(initialMode);
  const [categoryId, setCategoryId] = useState<CategoryId | 'all'>(
    requestedCategory && CATEGORY_BY_ID[requestedCategory] ? requestedCategory : 'all',
  );
  const [difficulties, setDifficulties] = useState<Difficulty[]>(getDefaultDifficulties(initialMode));
  const [count, setCount] = useState(10);
  const [seconds, setSeconds] = useState(90);
  const [pendingConfig, setPendingConfig] = useState<QuizConfig | null>(null);

  useEffect(() => {
    setDifficulties(getDefaultDifficulties(mode));
    if (mode === 'random') setCategoryId('all');
    if (mode === 'middle') {
      setDifficulties(['junior-plus', 'middle']);
    }
  }, [mode]);

  const modeCounts = {
    study: questions.length,
    interview: questions.length,
    mistakes: progress.mistakeQuestionIds.length,
    random: questions.length,
    middle: questions.filter((question) => question.difficulty !== 'junior').length,
    bookmarks: progress.bookmarks.length,
  } satisfies Record<QuizMode, number>;

  const config: QuizConfig = useMemo(
    () => ({
      mode,
      categoryId: mode === 'random' ? 'all' : categoryId,
      difficulties: mode === 'middle' ? ['junior-plus', 'middle'] : difficulties,
      count,
      timed: mode === 'interview',
      secondsPerQuestion: seconds,
    }),
    [mode, categoryId, difficulties, count, seconds],
  );

  const availableIds = buildQuestionIds({
    ...config,
    questions,
    progress: progress.toState(),
  });
  const available = availableIds.length;
  const actualCount = Math.min(count, available);
  const active = progress.activeQuiz;

  const toggleDifficulty = (difficulty: Difficulty) => {
    if (mode === 'middle' && difficulty === 'junior') return;
    setDifficulties((current) =>
      current.includes(difficulty)
        ? current.filter((item) => item !== difficulty)
        : [...current, difficulty],
    );
  };

  const launch = (nextConfig: QuizConfig) => {
    if (available === 0) {
      ui.notify('Нет вопросов, подходящих под выбранные фильтры.', 'warning');
      return;
    }
    if (progress.activeQuiz) {
      setPendingConfig(nextConfig);
      return;
    }
    if (quiz.start(nextConfig)) navigate('/quiz');
  };

  const start = () => launch(config);

  const resume = () => {
    if (quiz.resumeSaved()) navigate('/quiz');
    else ui.notify('Не удалось восстановить сессию.', 'warning');
  };

  const confirmNew = () => {
    if (!pendingConfig) return;
    if (quiz.start(pendingConfig)) {
      setPendingConfig(null);
      navigate('/quiz');
    } else {
      ui.notify('Не удалось собрать сессию.', 'warning');
    }
  };

  return (
    <div className="page practice-page">
      <PageHeader
        eyebrow="Практика"
        title="Выберите формат работы"
        description="Шесть режимов под разные задачи: понять тему, проверить себя под таймер, закрыть ошибки или устроить стресс-тест уровня Middle."
      />

      {active ? (
        <section className="continue-banner">
          <span className="continue-banner__icon">
            <Icon name="refresh" size={22} />
          </span>
          <div className="continue-banner__body">
            <strong>У вас есть незавершённая сессия · {MODE_LABELS[active.config.mode]}</strong>
            <span>
              {Object.values(active.answers).filter((answer) => answer.submitted).length} из{' '}
              {active.questionIds.length} · {formatRelativeDate(active.startedAt)}
            </span>
          </div>
          <Button size="sm" variant="secondary" icon="play" onClick={resume}>
            Продолжить
          </Button>
        </section>
      ) : null}

      <div className="practice-layout">
        <div className="practice-layout__main">
          <div className="mode-grid" role="radiogroup" aria-label="Режим тренировки">
            {MODES.map((item) => {
              const selected = mode === item.mode;
              const disabled = modeCounts[item.mode] === 0;
              return (
                <button
                  key={item.mode}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`mode-card ${selected ? 'mode-card--active' : ''} ${disabled ? 'mode-card--disabled' : ''}`}
                  style={{ '--mode-accent': item.accent } as CSSProperties}
                  onClick={() => {
                    if (disabled) {
                      ui.notify(
                        item.mode === 'bookmarks'
                          ? 'Сначала добавьте хотя бы один вопрос в закладки.'
                          : 'Пока нет вопросов с ошибками — начните с режима обучения.',
                        'info',
                      );
                      return;
                    }
                    setMode(item.mode);
                  }}
                >
                  <span className="mode-card__icon">
                    <Icon name={item.icon} size={22} />
                  </span>
                  <span className="mode-card__body">
                    <span className="mode-card__title">
                      {MODE_LABELS[item.mode]}
                      {item.tag ? <Badge tone={item.mode === 'middle' ? 'warning' : 'accent'}>{item.tag}</Badge> : null}
                    </span>
                    <span className="mode-card__description">{MODE_DESCRIPTIONS[item.mode]}</span>
                    <span className="mode-card__count">
                      {modeCounts[item.mode]} {pluralizeRu(modeCounts[item.mode], 'вопрос', 'вопроса', 'вопросов')} доступно
                    </span>
                  </span>
                  <span className="mode-card__radio" aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <section className="panel">
            <div className="panel__head">
              <div>
                <h2>Настройка сессии</h2>
                <p>Ограничьте выборку, чтобы сфокусироваться на конкретном модуле и уровне.</p>
              </div>
            </div>

            <div className="setup-grid">
              <label className="field">
                <span className="field__label">Модуль</span>
                <select
                  className="select"
                  value={mode === 'random' ? 'all' : categoryId}
                  onChange={(event) => setCategoryId(event.target.value as CategoryId | 'all')}
                  disabled={mode === 'random'}
                >
                  <option value="all">Все модули · смешанная выборка</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
                {mode === 'random' ? (
                  <span className="field__hint">Случайный режим всегда смешивает все модули.</span>
                ) : null}
              </label>

              <div className="field">
                <span className="field__label">Количество вопросов</span>
                <div className="segmented">
                  {[5, 10, 20, 30].map((value) => (
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
              </div>

              {mode === 'interview' ? (
                <div className="field">
                  <span className="field__label">Время на вопрос</span>
                  <div className="segmented">
                    {[60, 90, 120].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={seconds === value ? 'segmented__item segmented__item--active' : 'segmented__item'}
                        onClick={() => setSeconds(value)}
                      >
                        {value} сек
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <fieldset className="field field--full">
              <legend className="field__label">Сложность</legend>
              <div className="difficulty-chips">
                {DIFFICULTIES.map((difficulty) => {
                  const selected = config.difficulties.includes(difficulty);
                  const disabled = mode === 'middle' && difficulty === 'junior';
                  const countInCategory = questions.filter(
                    (question) =>
                      (config.categoryId === 'all' || question.category === config.categoryId) &&
                      question.difficulty === difficulty,
                  ).length;
                  return (
                    <button
                      key={difficulty}
                      type="button"
                      className={`chip ${selected ? 'chip--selected' : ''} ${disabled ? 'chip--disabled' : ''}`}
                      onClick={() => toggleDifficulty(difficulty)}
                      aria-pressed={selected}
                      disabled={disabled}
                      title={disabled ? 'Режим Middle Challenge исключает Junior-вопросы' : undefined}
                    >
                      <DifficultyBadge difficulty={difficulty} />
                      <span>{DIFFICULTY_LABELS[difficulty]}</span>
                      <b>{countInCategory}</b>
                      {selected ? <Icon name="check" size={14} /> : null}
                    </button>
                  );
                })}
              </div>
              {mode === 'middle' ? (
                <span className="field__hint">В этом режиме Junior исключён намеренно: только Junior+ и Middle.</span>
              ) : null}
            </fieldset>

            <div className="start-bar">
              <div className="start-bar__summary">
                <span>К запуску</span>
                <strong>
                  {actualCount} {pluralizeRu(actualCount, 'вопрос', 'вопроса', 'вопросов')} ·{' '}
                  {MODE_LABELS[mode]}
                  {mode === 'interview' ? ` · ${seconds} сек/вопрос` : ''}
                </strong>
                {available < count ? (
                  <small>В выбранной выборке доступно только {available}. Запустим все.</small>
                ) : null}
              </div>
              <Button
                size="lg"
                icon={mode === 'interview' ? 'clock' : 'play'}
                onClick={start}
                disabled={actualCount === 0 || config.difficulties.length === 0}
              >
                {mode === 'interview' ? 'Начать интервью' : 'Начать сессию'}
              </Button>
            </div>
          </section>
        </div>

        <aside className="practice-layout__aside">
          <section className="panel mode-info">
            <span className="eyebrow">Выбранный режим</span>
            <h2>{MODE_LABELS[mode]}</h2>
            <p>{MODE_DESCRIPTIONS[mode]}</p>
            <ul className="mode-info__list">
              {mode === 'study' ? (
                <>
                  <li><Icon name="check" size={15} /> Мгновенный разбор</li>
                  <li><Icon name="check" size={15} /> Подсказки и code examples</li>
                  <li><Icon name="check" size={15} /> Без ограничения времени</li>
                </>
              ) : null}
              {mode === 'interview' ? (
                <>
                  <li><Icon name="clock" size={15} /> Таймер на каждый вопрос</li>
                  <li><Icon name="check" size={15} /> Разбор только в результатах</li>
                  <li><Icon name="check" size={15} /> Автопереход по истечении времени</li>
                </>
              ) : null}
              {mode === 'mistakes' ? (
                <>
                  <li><Icon name="refresh" size={15} /> Только вопросы с ошибками</li>
                  <li><Icon name="check" size={15} /> Первая попытка сохраняется отдельно</li>
                  <li><Icon name="check" size={15} /> Удобно для интервального повторения</li>
                </>
              ) : null}
              {mode === 'random' ? (
                <>
                  <li><Icon name="sparkles" size={15} /> Вопросы из всех 10 модулей</li>
                  <li><Icon name="check" size={15} /> Широкая диагностика</li>
                  <li><Icon name="check" size={15} /> Непредсказуемая выборка</li>
                </>
              ) : null}
              {mode === 'middle' ? (
                <>
                  <li><Icon name="flame" size={15} /> Только Junior+ и Middle</li>
                  <li><Icon name="check" size={15} /> Проверка сильных сторон</li>
                  <li><Icon name="check" size={15} /> Больше кода и tradeoffs</li>
                </>
              ) : null}
              {mode === 'bookmarks' ? (
                <>
                  <li><Icon name="bookmark" size={15} /> Только сохранённые вопросы</li>
                  <li><Icon name="check" size={15} /> Повторение важного</li>
                  <li><Icon name="check" size={15} /> Закладки хранятся локально</li>
                </>
              ) : null}
            </ul>
          </section>

          <section className="panel practice-tip">
            <Icon name="lightbulb" size={20} />
            <div>
              <strong>Как заниматься эффективнее</strong>
              <p>
                Сначала попробуйте ответить без подсказки. После разбора сформулируйте правило
                своими словами — это надёжнее повторного чтения.
              </p>
            </div>
          </section>
        </aside>
      </div>

      <Modal
        open={pendingConfig !== null}
        title="Начать новую сессию?"
        onClose={() => setPendingConfig(null)}
        onConfirm={confirmNew}
        confirmLabel="Начать заново"
        danger
      >
        <p>
          Текущая незавершённая сессия будет заменена. Сохранённые ответы и статистика
          останутся в прогрессе, но вернуться к самой сессии уже не получится.
        </p>
      </Modal>
    </div>
  );
});
