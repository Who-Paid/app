import { useState } from 'react';
import { signInWithApple } from '../lib/auth';

export function AppleSignInButton() {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (loading) return;
    setLoading(true);
    await signInWithApple();
    // Page will redirect; if it doesn't (e.g. syncEnabled is false), reset.
    setLoading(false);
  };

  return (
    <button
      onClick={handlePress}
      disabled={loading}
      aria-label="Sign in with Apple"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        width: '100%', padding: '15px 22px',
        background: loading ? '#333' : '#000',
        color: '#fff',
        border: 'none', borderRadius: 'var(--radius-pill)',
        fontFamily: '-apple-system, "Helvetica Neue", sans-serif',
        fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em',
        cursor: loading ? 'not-allowed' : 'pointer',
        boxShadow: loading ? 'none' : '0 4px 0 rgba(0,0,0,.35)',
        opacity: loading ? 0.7 : 1,
        transition: 'opacity .15s ease, box-shadow .08s ease, transform .08s ease',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
      }}
      onMouseDown={(e) => {
        if (!loading) {
          e.currentTarget.style.transform = 'translateY(3px)';
          e.currentTarget.style.boxShadow = '0 1px 0 rgba(0,0,0,.35)';
        }
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 0 rgba(0,0,0,.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 0 rgba(0,0,0,.35)';
      }}
    >
      <AppleLogo />
      {loading ? 'Signing in…' : 'Sign in with Apple'}
    </button>
  );
}

function AppleLogo() {
  return (
    <svg width="17" height="21" viewBox="0 0 18 22" fill="currentColor" aria-hidden="true">
      <path d="M14.95 11.6c-.03-2.41 1.97-3.57 2.06-3.63-1.13-1.65-2.88-1.87-3.5-1.89-1.49-.15-2.9.96-3.66.96-.75 0-1.91-.94-3.14-.92-1.62.03-3.12.97-3.95 2.45C.89 11.33 2 16.12 3.7 18.35c.84 1.18 1.84 2.5 3.14 2.46 1.26-.05 1.74-.81 3.27-.81 1.53 0 1.96.81 3.3.78 1.37-.02 2.23-1.2 3.06-2.39.52-.76.93-1.69 1.21-2.69-2.92-1.15-2.84-4.72-.73-5.9zM12.59 4.03c.7-.85 1.17-2.01 1.04-3.2-1.01.04-2.24.67-2.96 1.53-.65.75-1.21 1.95-1.06 3.1 1.12.08 2.27-.57 2.98-1.43z" />
    </svg>
  );
}
