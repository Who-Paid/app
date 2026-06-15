import type { ReactNode } from 'react';

type Color = 'mint' | 'neutral';

export function Badge({
  children, color = 'mint', solid = false, dot = false,
}: { children: ReactNode; color?: Color; solid?: boolean; dot?: boolean }) {
  const cls = ['wp-badge', `wp-badge--${color}`, solid ? 'wp-badge--solid' : '', dot ? 'wp-badge--dot' : '']
    .filter(Boolean).join(' ');
  return <span className={cls}>{children}</span>;
}
