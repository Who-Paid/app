import type { CSSProperties } from 'react';

export function ShareUpIcon({ size = 20, stroke = 2.25, style }: { size?: number; stroke?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"
         strokeLinejoin="round" style={{ display: 'inline-block', ...style }}>
      <path d="M12 3v12" />
      <path d="M8 7l4-4 4 4" />
      <path d="M7 11H5.5A1.5 1.5 0 0 0 4 12.5v6A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 18.5 11H17" />
    </svg>
  );
}
