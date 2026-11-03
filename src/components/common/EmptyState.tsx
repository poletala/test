import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export function EmptyState({
  icon = 'book',
  title,
  description,
  action,
}: {
  icon?: IconName;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">
        <Icon name={icon} size={30} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  );
}
