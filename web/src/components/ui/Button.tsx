import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'sun';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export function Button({
  children, variant = 'primary', size = 'md', block = false,
  iconLeft, iconRight, className = '', ...rest
}: Props) {
  const variantClass = variant === 'primary' ? '' : `wp-btn--${variant}`;
  const cls = ['wp-btn', `wp-btn--${size}`, variantClass, block ? 'wp-btn--block' : '', className]
    .filter(Boolean).join(' ');
  return (
    <button className={cls} {...rest}>
      {iconLeft}{children}{iconRight}
    </button>
  );
}
