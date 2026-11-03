import { Link } from 'react-router-dom';
import type { Question, QuizMode } from '../../types';
import { MODE_LABELS } from '../../data/categories';
import { formatRelativeDate } from '../../utils/format';
import { Icon } from '../common/Icon';

interface ActivityItem {
  questionId: string;
  at: string;
  correct: boolean;
  mode: string;
}

export function ActivityList({
  items,
  questions,
}: {
  items: ActivityItem[];
  questions: readonly Question[];
}) {
  if (items.length === 0) {
    return (
      <div className="activity-empty">
        <Icon name="clock" size={22} />
        <p>Здесь появится история ответов. Начните с короткой сессии на 10 вопросов.</p>
      </div>
    );
  }
  const map = new Map(questions.map((question) => [question.id, question]));
  return (
    <ul className="activity-list">
      {items.map((item) => {
        const question = map.get(item.questionId);
        const modeLabel = MODE_LABELS[item.mode as QuizMode] ?? 'Практика';
        return (
          <li key={`${item.questionId}-${item.at}`} className="activity-item">
            <span className={`activity-item__status activity-item__status--${item.correct ? 'ok' : 'bad'}`}>
              <Icon name={item.correct ? 'check' : 'close'} size={15} />
            </span>
            <div className="activity-item__body">
              <Link to={question ? `/category/${question.category}` : '/'}>
                {question?.question ?? 'Вопрос'}
              </Link>
              <span>
                {modeLabel} · {formatRelativeDate(item.at)}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
