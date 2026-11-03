import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

function classes(variant: Variant, size: Size, fullWidth: boolean, extra?: string) {
  return ['btn', `btn--${variant}`, `btn--${size}`, fullWidth ? 'btn--full' : '', extra ?? '']
    .filter(Boolean)
    .join(' ');
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={classes(variant, size, fullWidth, className)} {...props}>
      {icon && iconPosition === 'left' ? <Icon name={icon} size={18} /> : null}
      <span>{children}</span>
      {icon && iconPosition === 'right' ? <Icon name={icon} size={18} /> : null}
    </button>
  );
}

type ButtonLinkProps = BaseProps & LinkProps;

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={classes(variant, size, fullWidth, className)} {...props}>
      {icon && iconPosition === 'left' ? <Icon name={icon} size={18} /> : null}
      <span>{children}</span>
      {icon && iconPosition === 'right' ? <Icon name={icon} size={18} /> : null}
    </Link>
  );
}
