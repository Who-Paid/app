export function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <div style={{
      position: 'absolute', top: 'calc(8px + var(--wp-pad-top))', left: '50%', zIndex: 200,
      background: 'var(--ink-900)', color: 'var(--paper)', padding: '11px 18px', borderRadius: 999,
      fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13.5, boxShadow: 'var(--shadow-lg)',
      whiteSpace: 'nowrap', animation: 'wp-toast-rise .3s ease both', maxWidth: '88%',
    }}>{msg}</div>
  );
}
