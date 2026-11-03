import type { ReactNode } from 'react';
import type { Difficulty } from '../../types';
import { DIFFICULTY_LABELS } from '../../data/categories';

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={`badge badge--difficulty badge--${difficulty}`}>
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'accent' | 'success' | 'danger' | 'warning';
}) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}
