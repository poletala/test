import { Icon, type IconName } from './Icon';

export function StatCard({
  icon,
  label,
  value,
  hint,
  tone = 'accent',
}: {
  icon: IconName;
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'accent' | 'success' | 'warning' | 'neutral';
}) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <span className="stat-card__icon">
        <Icon name={icon} size={21} />
      </span>
      <div>
        <span className="stat-card__label">{label}</span>
        <strong className="stat-card__value">{value}</strong>
        {hint ? <span className="stat-card__hint">{hint}</span> : null}
      </div>
    </div>
  );
}
