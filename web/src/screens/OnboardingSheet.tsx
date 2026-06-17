import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoldCoin } from '../components/GoldCoin';
import { Button } from '../components/ui/Button';

interface Props {
  onDone: (name?: string) => void;
}

export function OnboardingSheet({ onDone }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 380);
    return () => clearTimeout(timer);
  }, []);

  const submit = () => {
    if (name.trim()) onDone(name.trim());
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(28,27,41,.5)' }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'var(--surface-app)', borderRadius: '28px 28px 0 0',
        padding: '12px 24px calc(28px + var(--wp-pad-bottom))',
        boxShadow: 'var(--shadow-xl)',
        animation: 'wp-sheet-up .36s cubic-bezier(.34,1.3,.64,1) both',
      }}>
        {/* handle */}
        <div style={{ width: 44, height: 5, borderRadius: 99, background: 'var(--ink-300)', margin: '0 auto 24px' }} />

        {/* coin */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <GoldCoin size={68} mood="idle" />
        </div>

        {/* copy */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h2 style={{ fontSize: 26, marginBottom: 8 }}>{t('onboarding.title')}</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>
            {t('onboarding.body')}{' '}
            <span style={{ color: 'var(--text-faint)' }}>{t('onboarding.bodySub')}</span>
          </p>
        </div>

        {/* input */}
        <div className="wp-field__wrap" style={{ marginBottom: 16 }}>
          <input
            ref={inputRef}
            className="wp-input"
            placeholder={t('onboarding.placeholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
            autoComplete="given-name"
            style={{ fontSize: 17 }}
          />
        </div>

        {/* actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button variant="primary" size="lg" block onClick={submit} disabled={!name.trim()}>
            {t('onboarding.cta')}
          </Button>
          <Button variant="ghost" size="md" block onClick={() => onDone()}>
            {t('onboarding.skip')}
          </Button>
        </div>
      </div>
    </div>
  );
}
