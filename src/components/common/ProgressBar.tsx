interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  tone?: 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

export function ProgressBar({
  value,
  max = 100,
  label,
  tone = 'accent',
  size = 'md',
}: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      className={`progress progress--${size} progress--${tone}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      aria-label={label}
    >
      <span className="progress__fill" style={{ width: `${percent}%` }} />
    </div>
  );
}
