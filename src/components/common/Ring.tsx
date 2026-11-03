interface RingProps {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  tone?: 'accent' | 'success' | 'warning' | 'danger';
}

export function Ring({
  value,
  size = 132,
  stroke = 10,
  label,
  sublabel,
  tone = 'accent',
}: RingProps) {
  const safe = Math.min(100, Math.max(0, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (safe / 100) * circumference;
  return (
    <div
      className={`ring ring--${tone}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `Прогресс: ${Math.round(safe)}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="ring__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
        />
        <circle
          className="ring__value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring__content">
        <strong>{Math.round(safe)}%</strong>
        {sublabel ? <span>{sublabel}</span> : null}
      </div>
    </div>
  );
}
