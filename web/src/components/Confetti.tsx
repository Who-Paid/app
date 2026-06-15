import { useMemo } from 'react';

const COLORS = ['var(--mint-400)', 'var(--coral-400)', 'var(--sun-300)', 'var(--sky-300)', 'var(--grape-300)', '#fff'];

export function Confetti({ count = 48 }: { count?: number }) {
  const bits = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      dur: 1.3 + Math.random() * 1.2,
      size: 7 + Math.random() * 8,
      color: COLORS[i % COLORS.length],
      rot: Math.random() * 360,
      round: Math.random() > 0.5,
    })),
    [count],
  );
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 40 }}>
      {bits.map((b) => (
        <span key={b.id} style={{
          position: 'absolute', top: -20, left: `${b.left}%`,
          width: b.size, height: b.size * (b.round ? 1 : 0.5),
          background: b.color, borderRadius: b.round ? '50%' : 2,
          transform: `rotate(${b.rot}deg)`,
          animation: `wp-fall ${b.dur}s ${b.delay}s cubic-bezier(.4,.1,.7,1) forwards`,
        }} />
      ))}
    </div>
  );
}
