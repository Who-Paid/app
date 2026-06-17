import { AppleSignInButton } from '../components/AppleSignInButton';

export function AuthSheet({ onDismiss }: { onDismiss: () => void }) {
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
        padding: '20px 24px calc(28px + var(--wp-pad-bottom))',
        animation: 'wp-sheet-up .32s cubic-bezier(.34,1.3,.64,1) both',
        boxShadow: '0 -4px 32px rgba(28,27,41,.14)',
      }}>
        <div style={{ width: 44, height: 5, borderRadius: 99, background: 'var(--ink-300)', margin: '0 auto 24px' }} />

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, marginBottom: 8 }}>Back up your tables</h2>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-muted)', maxWidth: 280, margin: '0 auto' }}>
            Sign in so your tables follow you to any phone — and never get lost.
          </p>
        </div>

        <AppleSignInButton />

        <button
          onClick={onDismiss}
          style={{
            width: '100%', marginTop: 12, background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15,
            color: 'var(--text-muted)', padding: '12px 0', minHeight: 44,
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
