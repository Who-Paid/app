import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

export function IconButton({ label, children, className = '', ...rest }: Props) {
  return (
    <button className={['wp-iconbtn', className].filter(Boolean).join(' ')} aria-label={label} title={label} {...rest}>
      {children}
    </button>
  );
}
