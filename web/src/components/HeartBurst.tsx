import { useMemo } from 'react';

const COLS = ['#FF6353', '#FF8578', '#FF4D6D', '#FFC93D'];

export function HeartBurst({
  count = 11,
  originX = '50%',
  originY = '50%',
  spread = 96,
  rise = 64,
}: {
  count?: number;
  originX?: string;
  originY?: string;
  spread?: number;
  rise?: number;
}) {
  const hearts = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const ang = (-90 + (Math.random() * 150 - 75)) * Math.PI / 180;
      const dist = spread * (0.45 + Math.random() * 0.7);
      return {
        dx: Math.cos(ang) * dist,
        dy: Math.sin(ang) * dist - rise * Math.random(),
        sc: 0.7 + Math.random() * 0.9,
        rot: Math.random() * 60 - 30,
        col: COLS[i % COLS.length],
        dur: 760 + Math.random() * 420,
        delay: Math.random() * 130,
        sz: 15 + Math.random() * 17,
      };
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  return (
    <div style={{ position: 'absolute', left: originX, top: originY, width: 0, height: 0, pointerEvents: 'none', zIndex: 25 }}>
      {hearts.map((h, i) => (
        <svg key={i} viewBox="0 0 24 24" width={h.sz} height={h.sz} style={{
          position: 'absolute', left: 0, top: 0,
          '--dx': `${h.dx}px`, '--dy': `${h.dy}px`,
          '--sc': h.sc, '--rot': `${h.rot}deg`,
          animation: `ck-heart ${h.dur}ms ${h.delay}ms cubic-bezier(.2,.7,.3,1) forwards`,
          filter: 'drop-shadow(0 4px 5px rgba(28,27,41,.28))',
        } as React.CSSProperties}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={h.col} />
          <ellipse cx="8.6" cy="8" rx="2.1" ry="1.4" fill="rgba(255,255,255,.55)" transform="rotate(-30 8.6 8)" />
        </svg>
      ))}
    </div>
  );
}
