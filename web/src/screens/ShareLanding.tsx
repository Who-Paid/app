import { GoldCoin } from '../components/GoldCoin';

const STORE_URL = 'https://apps.apple.com/app/who-paid';

export function ShareLanding({ tableName, onDismiss }: { tableName: string; onDismiss: () => void }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
      <div
        onClick={onDismiss}
        style={{ position: 'absolute', inset: 0, background: 'rgba(28,27,41,.45)' }}
      />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--surface-app)',
        borderRadius: '28px 28px 0 0',
        padding: '16px 24px calc(28px + var(--wp-pad-bottom))',
        animation: 'wp-sheet-up .32s cubic-bezier(.34,1.3,.64,1) both',
        boxShadow: '0 -4px 32px rgba(28,27,41,.14)',
      }}>
        <div style={{ width: 44, height: 5, borderRadius: 99, background: 'var(--ink-300)', margin: '0 auto 24px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, marginBottom: 28 }}>
          <GoldCoin size={64} mood="idle" />
          <h2 style={{ fontSize: 21, margin: 0 }}>You're invited to "{tableName}"</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, fontWeight: 500, maxWidth: 280, margin: 0 }}>
            Save the table and see the coin move live — get Who Paid? to sync.
          </p>
        </div>

        <a
          href={STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: 'var(--ink-900)', color: '#fff',
            borderRadius: 14, padding: '14px 20px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16,
          }}
        >
          <svg width={18} height={22} viewBox="0 0 18 22" fill="currentColor" aria-hidden="true">
            <path d="M14.95 11.6c-.03-2.41 1.97-3.57 2.06-3.63-1.13-1.65-2.88-1.87-3.5-1.89-1.49-.15-2.9.96-3.66.96-.75 0-1.91-.94-3.14-.92-1.62.03-3.12.97-3.95 2.45C.89 11.33 2 16.12 3.7 18.35c.84 1.18 1.84 2.5 3.14 2.46 1.26-.05 1.74-.81 3.27-.81 1.53 0 1.96.81 3.3.78 1.37-.02 2.23-1.2 3.06-2.39.52-.76.93-1.69 1.21-2.69-2.92-1.15-2.84-4.72-.73-5.9zM12.59 4.03c.7-.85 1.17-2.01 1.04-3.2-1.01.04-2.24.67-2.96 1.53-.65.75-1.21 1.95-1.06 3.1 1.12.08 2.27-.57 2.98-1.43z" />
          </svg>
          Download on App Store
        </a>

        <button
          onClick={onDismiss}
          style={{
            width: '100%', marginTop: 10, background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15,
            color: 'var(--text-muted)', padding: '12px 0',
          }}
        >
          Continue in browser
        </button>
      </div>
    </div>
  );
}
