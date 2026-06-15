import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  prefix?: ReactNode;
  amount?: boolean;
}

export function Input({ label, prefix, amount = false, className = '', ...rest }: Props) {
  const id = useId();
  return (
    <label className={['wp-field', className].filter(Boolean).join(' ')} htmlFor={id}>
      {label && <span className="wp-field__label">{label}</span>}
      <span className="wp-field__wrap">
        {prefix && <span className="wp-field__prefix">{prefix}</span>}
        <input id={id} className={['wp-input', amount ? 'wp-input--amount' : ''].filter(Boolean).join(' ')} {...rest} />
      </span>
    </label>
  );
}
