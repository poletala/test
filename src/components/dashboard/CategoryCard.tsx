import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import type { Category, CategoryStats } from '../../types';
import { formatPercent } from '../../utils/format';
import { ProgressBar } from '../common/ProgressBar';
import { Icon } from '../common/Icon';

export function CategoryCard({
  category,
  stats,
}: {
  category: Category;
  stats: CategoryStats;
}) {
  const style = { '--category-accent': category.accent } as CSSProperties;
  return (
    <Link to={`/category/${category.id}`} className="category-card" style={style}>
      <div className="category-card__top">
        <span className="category-card__icon" aria-hidden="true">
          {category.icon}
        </span>
        <span className="category-card__arrow">
          <Icon name="arrow-up-right" size={18} />
        </span>
      </div>
      <div className="category-card__body">
        <h3>{category.title}</h3>
        <p>{stats.answered} из {stats.total} вопросов</p>
      </div>
      <div className="category-card__progress">
        <ProgressBar
          value={stats.answered}
          max={stats.total}
          size="sm"
          label={`Пройдено вопросов: ${category.title}`}
        />
        <div className="category-card__meta">
          <span>Точность: {formatPercent(stats.accuracy)}</span>
          <span>{stats.mastery}% мастерства</span>
        </div>
      </div>
    </Link>
  );
}
