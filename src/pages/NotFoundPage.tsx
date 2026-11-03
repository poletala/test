import { ButtonLink } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

export function NotFoundPage() {
  return (
    <div className="page">
      <EmptyState
        icon="code"
        title="404 · Страница не найдена"
        description="Похоже, этот маршрут не существует. Вернитесь к обзору или начните новую тренировку."
        action={
          <div className="empty-state__buttons">
            <ButtonLink to="/" variant="secondary">На главную</ButtonLink>
            <ButtonLink to="/practice" icon="play">К практике</ButtonLink>
          </div>
        }
      />
    </div>
  );
}
