export type Mood = 'idle' | 'flick' | 'pay' | 'safe';

function GoldFace({ size, mood }: { size: number; mood: Mood }) {
  const dark = '#5C3D00';
  const E = size * 0.205;   // eye white diameter
  const P = size * 0.092;   // pupil diameter

  const eyeWhite: React.CSSProperties = {
    width: E, height: E, borderRadius: '50%', background: '#fff',
    display: 'grid', placeItems: 'center',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,.18)',
    position: 'relative', overflow: 'hidden',
  };
  const pupil: React.CSSProperties = {
    width: P, height: P, borderRadius: '50%', background: '#1C1B29', position: 'absolute',
  };

  let eyes: React.ReactNode;
  if (mood === 'idle') {
    eyes = (
      <div style={{ display: 'flex', gap: size * 0.085 }}>
        <div style={{ ...eyeWhite, animation: 'ck-blink 4.2s ease-in-out infinite' }}>
          <div style={{ ...pupil, animation: 'ck-eye-l 2.6s ease-in-out infinite' }} />
        </div>
        <div style={{ ...eyeWhite, animation: 'ck-blink 4.2s ease-in-out infinite' }}>
          <div style={{ ...pupil, animation: 'ck-eye-r 2.6s ease-in-out infinite' }} />
        </div>
      </div>
    );
  } else if (mood === 'flick') {
    // wide surprised eyes, pupils small & up
    const wide = { ...eyeWhite, height: E * 1.25, borderRadius: '46%' };
    const small: React.CSSProperties = { ...pupil, width: P * 0.8, height: P * 0.8, top: '22%', left: '50%', transform: 'translateX(-50%)' };
    eyes = (
      <div style={{ display: 'flex', gap: size * 0.085 }}>
        <div style={wide}><div style={small} /></div>
        <div style={wide}><div style={small} /></div>
      </div>
    );
  } else if (mood === 'pay') {
    // worried: pupils up, anxious angled brows, trembling
    const up: React.CSSProperties = { ...pupil, top: '14%', left: '50%', transform: 'translateX(-50%)' };
    const brow: React.CSSProperties = { position: 'absolute', top: -size * 0.07, width: E * 0.95, height: size * 0.035, borderRadius: 99, background: dark };
    eyes = (
      <div style={{ display: 'flex', gap: size * 0.085, animation: 'ck-tremble .5s ease-in-out infinite' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ ...brow, left: 0, transform: 'rotate(14deg)' }} />
          <div style={eyeWhite}><div style={up} /></div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ ...brow, right: 0, transform: 'rotate(-14deg)' }} />
          <div style={eyeWhite}><div style={up} /></div>
        </div>
      </div>
    );
  } else {
    // safe — happy squint arcs
    const arc: React.CSSProperties = {
      width: E, height: E * 0.62,
      borderTop: `${size * 0.045}px solid ${dark}`,
      borderRadius: `${E}px ${E}px 0 0`,
    };
    eyes = (
      <div style={{ display: 'flex', gap: size * 0.085, alignItems: 'flex-end' }}>
        <div style={arc} />
        <div style={arc} />
      </div>
    );
  }

  let mouth: React.ReactNode;
  if (mood === 'idle') {
    mouth = <div style={{ width: size * 0.32, height: size * 0.15, borderBottom: `${size * 0.05}px solid ${dark}`, borderRadius: `0 0 ${size}px ${size}px` }} />;
  } else if (mood === 'flick') {
    mouth = <div style={{ width: size * 0.16, height: size * 0.19, background: dark, borderRadius: '50%' }} />;
  } else if (mood === 'pay') {
    // gritted-teeth grimace 😬
    mouth = (
      <div style={{ width: size * 0.42, height: size * 0.16, background: dark, borderRadius: size * 0.04, display: 'flex', alignItems: 'stretch', gap: size * 0.012, padding: size * 0.022, boxSizing: 'border-box' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ flex: 1, background: '#FFF7EE', borderRadius: 2 }} />
        ))}
      </div>
    );
  } else {
    // safe — big open grin + tongue
    mouth = (
      <div style={{ position: 'relative', width: size * 0.42, height: size * 0.22, background: dark, borderRadius: `${size * 0.04}px ${size * 0.04}px ${size}px ${size}px`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -size * 0.06, left: '50%', transform: 'translateX(-50%)', width: size * 0.2, height: size * 0.16, background: '#FF8578', borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* eyes */}
      <div style={{ position: 'absolute', top: mood === 'safe' ? '33%' : '29%', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        {eyes}
      </div>
      {/* sweat drop for 'pay' */}
      {mood === 'pay' && (
        <div style={{ position: 'absolute', top: '24%', right: '20%', width: size * 0.07, height: size * 0.1, background: 'linear-gradient(#88C0FF,#4DA2FF)', borderRadius: '50% 50% 50% 50% / 70% 70% 40% 40%', transform: 'rotate(8deg)', animation: 'ck-sweat 1.3s ease-in infinite' }} />
      )}
      {/* blush for 'safe' */}
      {mood === 'safe' && (
        <>
          <div style={{ position: 'absolute', top: '52%', left: '16%', width: size * 0.12, height: size * 0.07, background: 'rgba(255,99,83,.5)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '52%', right: '16%', width: size * 0.12, height: size * 0.07, background: 'rgba(255,99,83,.5)', borderRadius: '50%' }} />
        </>
      )}
      {/* mouth */}
      <div style={{ position: 'absolute', top: mood === 'safe' ? '60%' : '58%', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        {mouth}
      </div>
    </div>
  );
}

interface GoldCoinProps {
  size?: number;
  mood?: Mood;
  drop?: boolean;
}

export function GoldCoin({ size = 180, mood = 'idle', drop = true }: GoldCoinProps) {
  return (
    <div style={{ position: 'relative', width: size, height: size, filter: drop ? 'drop-shadow(0 8px 12px rgba(28,27,41,.22))' : 'none' }}>
      {/* dark edge — gives the coin a 3-D rim */}
      <div style={{ position: 'absolute', inset: 0, top: size * 0.06, borderRadius: '50%', background: '#D89A00' }} />
      {/* main coin body */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(150deg,#FFE9A8,#FFC93D 58%,#F5B400)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: size * 0.13, borderRadius: '50%', border: '3px dashed rgba(120,80,0,.22)' }} />
        <GoldFace size={size} mood={mood} />
      </div>
    </div>
  );
}
