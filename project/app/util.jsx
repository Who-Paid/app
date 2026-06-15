// Shared helpers for the Who Paid? UI kit: Lucide <Icon>, <Confetti>, dates.

function Icon({ name, size = 22, stroke = 2.25, style = {}, className = '' }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    i.setAttribute('width', size);
    i.setAttribute('height', size);
    i.setAttribute('stroke-width', stroke);
    el.appendChild(i);
    window.lucide.createIcons();
  }, [name, size, stroke]);
  return (
    <span ref={ref} className={className}
      style={{ display: 'inline-flex', width: size, height: size, lineHeight: 0, ...style }} />
  );
}

// Falling confetti for the moment the coin lands.
function Confetti({ count = 50 }) {
  const colors = ['var(--mint-400)', 'var(--coral-400)', 'var(--sun-300)', 'var(--sky-300)', 'var(--grape-300)', '#fff'];
  const bits = React.useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 0.4,
    dur: 1.3 + Math.random() * 1.2, size: 7 + Math.random() * 8,
    color: colors[i % colors.length], rot: Math.random() * 360, round: Math.random() > 0.5,
  })), [count]);
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

const WP_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// "Today" / "Yesterday" / "14 Jun" from an ISO date string.
function paidLabel(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  const now = new Date('2026-06-15T12:00:00');
  const days = Math.round((new Date(now.toDateString()) - new Date(d.toDateString())) / 86400000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  return `${d.getDate()} ${WP_MONTHS[d.getMonth()]}`;
}
function todayISO() { return '2026-06-15T12:00:00'; }

if (typeof document !== 'undefined' && !document.getElementById('wp-kit-anims')) {
  const s = document.createElement('style');
  s.id = 'wp-kit-anims';
  s.textContent = `
    @keyframes wp-fall { to { transform: translateY(900px) rotate(720deg); opacity: 0; } }
    @keyframes wp-pop-in { 0% { transform: scale(.6); opacity: 0; } 60% { transform: scale(1.06); } 100% { transform: scale(1); opacity: 1; } }
    @keyframes wp-rise { from { transform: translateY(14px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes wp-sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes wp-coin-idle { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    .wp-pop-in { animation: wp-pop-in .5s cubic-bezier(.34,1.56,.64,1) both; }
    .wp-rise { animation: wp-rise .4s ease both; }
  `;
  document.head.appendChild(s);
}

Object.assign(window, { Icon, Confetti, paidLabel, todayISO });
