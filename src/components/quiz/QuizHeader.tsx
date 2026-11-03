import { Link } from 'react-router-dom';
import type { QuizMode } from '../../types';
import { MODE_LABELS } from '../../data/categories';
import { formatClock } from '../../utils/format';
import { ProgressBar } from '../common/ProgressBar';
import { Icon } from '../common/Icon';

export function QuizHeader({
  current,
  total,
  mode,
  timeLeft,
  timed,
  submitted,
  onExit,
  onFinish,
}: {
  current: number;
  total: number;
  mode: QuizMode;
  timeLeft: number | null;
  timed: boolean;
  submitted: boolean;
  onExit: () => void;
  onFinish: () => void;
}) {
  return (
    <div className="quiz-header">
      <div className="quiz-header__top">
        <button type="button" className="back-link" onClick={onExit}>
          <Icon name="arrow-left" size={16} /> Выйти
        </button>
        <Link to="/practice" className="quiz-header__mode">
          <span className="live-dot" /> {MODE_LABELS[mode]}
        </Link>
        <div className="quiz-header__right">
          {timed && timeLeft !== null ? (
            <span className={`timer ${timeLeft <= 15 ? 'timer--danger' : ''} ${submitted ? 'timer--paused' : ''}`}>
              <Icon name="clock" size={16} />
              {submitted ? 'Пауза' : formatClock(timeLeft)}
            </span>
          ) : (
            <span className="quiz-header__untimed">
              <Icon name="book" size={15} /> Без таймера
            </span>
          )}
          <button type="button" className="btn btn--ghost btn--sm" onClick={onFinish}>
            Завершить
          </button>
        </div>
      </div>
      <div className="quiz-header__progress">
        <div className="quiz-header__progress-text">
          <span>
            Вопрос <strong>{current}</strong> из {total}
          </span>
          <span>{Math.round((current / Math.max(total, 1)) * 100)}%</span>
        </div>
        <ProgressBar
          value={current}
          max={Math.max(total, 1)}
          label="Прогресс сессии"
          size="sm"
        />
      </div>
    </div>
  );
}
