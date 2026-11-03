import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import { CATEGORY_BY_ID, MODE_LABELS } from '../data/categories';
import { formatClock, pluralizeRu } from '../utils/format';
import type { QuestionType } from '../types';
import { QuizHeader } from '../components/quiz/QuizHeader';
import { OptionList } from '../components/quiz/OptionList';
import { CodeCompletionInput } from '../components/quiz/CodeCompletionInput';
import { ExplanationPanel } from '../components/quiz/ExplanationPanel';
import { CodeBlock } from '../components/common/CodeBlock';
import { Button, ButtonLink } from '../components/common/Button';
import { DifficultyBadge } from '../components/common/Badge';
import { Icon } from '../components/common/Icon';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { ProgressBar } from '../components/common/ProgressBar';

const TYPE_LABELS: Record<QuestionType, string> = {
  'single-choice': 'Один ответ',
  'multiple-choice': 'Несколько ответов',
  'code-output': 'Что выведет код',
  'find-bug': 'Найди баг',
  scenario: 'Ситуация',
  'code-completion': 'Дополни код',
};

export const QuizPage = observer(function QuizPage() {
  const { quiz, progress, ui } = useStores();
  const navigate = useNavigate();
  const initialized = useRef(false);
  const [ready, setReady] = useState(quiz.total > 0);
  const [hintOpen, setHintOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [finishOpen, setFinishOpen] = useState(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (quiz.total === 0 && progress.activeQuiz) {
      quiz.resumeSaved();
    }
    setReady(true);
  }, [quiz, progress]);

  useEffect(() => {
    if (!quiz.active || !quiz.config.timed || quiz.submitted) return;
    const interval = window.setInterval(() => quiz.tick(), 1000);
    return () => window.clearInterval(interval);
  }, [quiz, quiz.active, quiz.config.timed, quiz.submitted, quiz.currentIndex]);

  useEffect(() => {
    if (!quiz.timeExpired) return;
    const timeout = window.setTimeout(() => quiz.acknowledgeTimeout(), 1400);
    return () => window.clearTimeout(timeout);
  }, [quiz, quiz.timeExpired]);

  useEffect(() => {
    if (!quiz.finished) return;
    const result = quiz.latestResult;
    if (result) navigate(`/results/${result.id}`, { replace: true });
  }, [quiz.finished, quiz.latestResult, navigate]);

  useEffect(() => {
    setHintOpen(false);
  }, [quiz.currentIndex, quiz.sessionId]);

  const question = quiz.currentQuestion;
  const bookmarked = question ? progress.isBookmarked(question.id) : false;

  if (!ready) {
    return (
      <div className="page">
        <div className="loading-block">
          <span className="spinner" /> Восстанавливаем сессию…
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="page">
        <EmptyState
          icon="practice"
          title="Активной сессии нет"
          description="Выберите режим и количество вопросов — сессия начнётся сразу. Незаконченная сессия сохраняется автоматически."
          action={<ButtonLink to="/practice" icon="play">Перейти к практике</ButtonLink>}
        />
      </div>
    );
  }

  const category = CATEGORY_BY_ID[question.category];
  const isStudy = quiz.config.mode === 'study';

  const handleSubmit = () => {
    quiz.submitCurrent();
  };

  const handleNext = () => {
    quiz.next();
  };

  const toggleBookmark = () => {
    progress.toggleBookmark(question.id);
    ui.notify(
      bookmarked ? 'Вопрос убран из закладок.' : 'Вопрос сохранён для повторения.',
      bookmarked ? 'info' : 'success',
    );
  };

  const finishSession = () => {
    quiz.finish();
    setFinishOpen(false);
  };

  return (
    <div className="page quiz-page">
      <QuizHeader
        current={quiz.currentNumber}
        total={quiz.total}
        mode={quiz.config.mode}
        timeLeft={quiz.timeLeftSec}
        timed={quiz.config.timed}
        submitted={quiz.submitted}
        onExit={() => setExitOpen(true)}
        onFinish={() => setFinishOpen(true)}
      />

      <div className="quiz-layout">
        <div className="quiz-main">
          <article className="quiz-card">
            <div className="quiz-card__meta">
              <span className="quiz-card__category">{category.shortTitle}</span>
              <DifficultyBadge difficulty={question.difficulty} />
              <span className="quiz-card__type">{TYPE_LABELS[question.type]}</span>
              <button
                type="button"
                className={`bookmark-button ${bookmarked ? 'bookmark-button--active' : ''}`}
                onClick={toggleBookmark}
                aria-pressed={bookmarked}
                aria-label={bookmarked ? 'Убрать из закладок' : 'Сохранить в закладки'}
              >
                <Icon name="bookmark" size={18} />
                <span>{bookmarked ? 'Сохранено' : 'В закладки'}</span>
              </button>
            </div>

            <div className="quiz-card__topic">{question.topic}</div>
            <h1 className="quiz-card__question">{question.question}</h1>

            {question.code ? (
              <CodeBlock
                code={question.code}
                language={question.codeLanguage ?? 'javascript'}
                title="Фрагмент кода"
              />
            ) : null}

            {question.completion ? (
              <CodeCompletionInput
                question={question}
                value={quiz.textAnswer}
                disabled={quiz.submitted}
                onChange={(value) => quiz.setTextAnswer(value)}
                onSubmit={handleSubmit}
              />
            ) : (
              <OptionList
                question={question}
                selected={quiz.selectedAnswers}
                submitted={quiz.submitted}
                onToggle={(optionId) => quiz.toggleOption(optionId)}
              />
            )}

            {quiz.timeExpired ? (
              <div className="timeout-banner" role="alert">
                <Icon name="clock" size={18} />
                <div>
                  <strong>Время на вопрос истекло</strong>
                  <span>Ответ зафиксирован как неверный. Переходим дальше…</span>
                </div>
              </div>
            ) : null}

            {hintOpen && question.hint ? (
              <div className="hint-box">
                <span className="hint-box__icon">
                  <Icon name="lightbulb" size={18} />
                </span>
                <div>
                  <strong>Подсказка</strong>
                  <p>{question.hint}</p>
                </div>
              </div>
            ) : null}

            {!quiz.submitted ? (
              <div className="quiz-actions">
                <div className="quiz-actions__left">
                  {question.hint ? (
                    <Button
                      variant="ghost"
                      icon="lightbulb"
                      onClick={() => setHintOpen((value) => !value)}
                      aria-expanded={hintOpen}
                    >
                      {hintOpen ? 'Скрыть подсказку' : 'Подсказка'}
                    </Button>
                  ) : null}
                </div>
                <div className="quiz-actions__right">
                  {quiz.config.mode === 'interview' ? (
                    <span className="quiz-actions__note">
                      Разбор будет после завершения интервью
                    </span>
                  ) : null}
                  <Button
                    size="lg"
                    icon="check"
                    onClick={handleSubmit}
                    disabled={!quiz.canSubmit}
                  >
                    Ответить
                  </Button>
                </div>
              </div>
            ) : null}

            {quiz.submitted && !quiz.revealed ? (
              <div className="answer-saved">
                <span className="answer-saved__icon">
                  <Icon name="shield" size={22} />
                </span>
                <div>
                  <strong>Ответ принят</strong>
                  <p>
                    {quiz.config.mode === 'interview'
                      ? 'В режиме интервью правильный ответ и разбор не показываются до финала. Так вы не сможете скорректировать впечатление о собственных знаниях.'
                      : 'Ответ сохранён.'}
                  </p>
                </div>
                <Button icon="arrow-right" iconPosition="right" onClick={handleNext}>
                  {quiz.isLastQuestion ? 'Завершить' : 'Следующий вопрос'}
                </Button>
              </div>
            ) : null}

            {quiz.revealed ? (
              <ExplanationPanel
                question={question}
                selectedAnswers={quiz.selectedAnswers}
                textAnswer={quiz.textAnswer}
                bookmarked={bookmarked}
                onToggleBookmark={toggleBookmark}
                onNext={handleNext}
                isLast={quiz.isLastQuestion}
              />
            ) : null}
          </article>
        </div>

        <aside className="quiz-aside">
          <section className="panel quiz-side-panel">
            <span className="eyebrow">Сессия</span>
            <h2>{MODE_LABELS[quiz.config.mode]}</h2>
            <dl className="session-facts">
              <div>
                <dt>Вопрос</dt>
                <dd>
                  {quiz.currentNumber} / {quiz.total}
                </dd>
              </div>
              <div>
                <dt>Отвечено</dt>
                <dd>
                  {quiz.answeredCount} {pluralizeRu(quiz.answeredCount, 'вопрос', 'вопроса', 'вопросов')}
                </dd>
              </div>
              <div>
                <dt>Осталось</dt>
                <dd>{quiz.remainingQuestions}</dd>
              </div>
              {quiz.config.timed && quiz.timeLeftSec !== null ? (
                <div>
                  <dt>Таймер</dt>
                  <dd>{quiz.submitted ? 'Пауза' : formatClock(quiz.timeLeftSec)}</dd>
                </div>
              ) : null}
            </dl>
            <ProgressBar
              value={quiz.currentIndex}
              max={quiz.total}
              label="Позиция в сессии"
              size="sm"
            />
            <p className="quiz-side-panel__note">
              <Icon name="shield" size={14} /> Прогресс сохраняется после каждого ответа.
            </p>
            <Button variant="ghost" fullWidth icon="bookmark" onClick={toggleBookmark}>
              {bookmarked ? 'Убрать из закладок' : 'Сохранить вопрос'}
            </Button>
            <Button variant="ghost" fullWidth icon="close" onClick={() => setExitOpen(true)}>
              Выйти из сессии
            </Button>
          </section>

          <section className="panel quiz-tip">
            <Icon name="lightbulb" size={20} />
            <div>
              <strong>Проговаривайте механизм</strong>
              <p>
                Даже при верном ответе объясните себе, почему остальные варианты неверны.
                Это превращает узнавание в понимание.
              </p>
            </div>
          </section>

          {isStudy ? (
            <section className="panel quiz-tip quiz-tip--accent">
              <Icon name="book" size={20} />
              <div>
                <strong>Режим обучения</strong>
                <p>Можно пользоваться подсказкой. После ответа откроется полный разбор и пример.</p>
              </div>
            </section>
          ) : (
            <section className="panel quiz-tip quiz-tip--accent">
              <Icon name="clock" size={20} />
              <div>
                <strong>Режим интервью</strong>
                <p>
                  {quiz.config.secondsPerQuestion} секунд на вопрос. Если время выйдет,
                  ответ будет зафиксирован и сессия продолжится.
                </p>
              </div>
            </section>
          )}
        </aside>
      </div>

      <Modal
        open={exitOpen}
        title="Выйти из сессии?"
        onClose={() => setExitOpen(false)}
        onConfirm={() => navigate('/')}
        confirmLabel="Выйти на главную"
      >
        <p>
          Незавершённая сессия сохранится. Вы сможете продолжить с текущего вопроса
          через баннер на главной или на странице практики.
        </p>
      </Modal>

      <Modal
        open={finishOpen}
        title="Завершить сессию?"
        onClose={() => setFinishOpen(false)}
        onConfirm={finishSession}
        confirmLabel="Завершить и показать результат"
        danger
      >
        <p>
          Неотвеченные вопросы будут засчитаны как неверные. Результаты и разбор
          сохранятся в статистике. Это действие нельзя отменить.
        </p>
      </Modal>
    </div>
  );
});
