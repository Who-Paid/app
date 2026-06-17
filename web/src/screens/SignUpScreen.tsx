import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Profile } from '../lib/types';
import { compressImage } from '../lib/compressImage';
import { Avatar } from '../components/ui/Avatar';
import { Icon } from '../components/ui/Icon';
import { IconButton } from '../components/ui/IconButton';
import { Input } from '../components/ui/Input';
import { GoldCoin } from '../components/GoldCoin';

interface Props {
  profile: Profile;
  onBack: () => void;
  onSave: (next: Profile) => void;
  isLoggedIn?: boolean;
  onSignOut?: () => void;
}

function AppleLogo() {
  return (
    <svg width="17" height="21" viewBox="0 0 18 22" fill="currentColor" aria-hidden="true">
      <path d="M14.95 11.6c-.03-2.41 1.97-3.57 2.06-3.63-1.13-1.65-2.88-1.87-3.5-1.89-1.49-.15-2.9.96-3.66.96-.75 0-1.91-.94-3.14-.92-1.62.03-3.12.97-3.95 2.45C.89 11.33 2 16.12 3.7 18.35c.84 1.18 1.84 2.5 3.14 2.46 1.26-.05 1.74-.81 3.27-.81 1.53 0 1.96.81 3.3.78 1.37-.02 2.23-1.2 3.06-2.39.52-.76.93-1.69 1.21-2.69-2.92-1.15-2.84-4.72-.73-5.9zM12.59 4.03c.7-.85 1.17-2.01 1.04-3.2-1.01.04-2.24.67-2.96 1.53-.65.75-1.21 1.95-1.06 3.1 1.12.08 2.27-.57 2.98-1.43z" />
    </svg>
  );
}

export function SignUpScreen({ profile, onBack, onSave, isLoggedIn = false, onSignOut }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState(() => (profile.name === 'You' ? '' : profile.name));
  const [photo, setPhoto] = useState<string | null>(profile.photo);
  const [email, setEmail] = useState('');
  const [emailState, setEmailState] = useState<'idle' | 'sent'>('idle');
  const fileRef = useRef<HTMLInputElement>(null);

  const hasName = name.trim().length > 0;
  const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const buildProfile = (): Profile => ({ name: name.trim() || 'You', photo });

  const handleApple = () => {
    if (!hasName) return;
    onSave(buildProfile());
  };

  const handleMagicLink = () => {
    if (!hasName || !hasEmail) return;
    setEmailState('sent');
  };

  const pickFile = () => fileRef.current?.click();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const compressed = await compressImage(ev.target?.result as string, 256);
      setPhoto(compressed);
    };
    reader.readAsDataURL(f);
    e.target.value = '';
  };

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      background: 'var(--surface-app)',
      paddingTop: 'var(--wp-pad-top)',
      boxSizing: 'border-box',
    }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px 10px', flexShrink: 0 }}>
        <IconButton label={t('common.back')} onClick={onBack}>
          <Icon name="arrow-left" size={22} />
        </IconButton>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--ink-900)' }}>
          {t('signUp.title')}
        </span>
      </div>

      {/* scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 22px calc(var(--wp-pad-bottom) + 28px)', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* pitch card — only shown when not yet signed in */}
        {!isLoggedIn && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            background: 'var(--sun-100)',
            border: '2px solid var(--ink-900)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 18px',
            boxShadow: '0 4px 0 var(--ink-900)',
            animation: 'wp-pop-in .32s cubic-bezier(.34,1.4,.64,1) both',
          }}>
            <div style={{ flexShrink: 0 }}>
              <GoldCoin size={50} mood="idle" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--ink-900)', lineHeight: 1.2, marginBottom: 5 }}>
                {t('signUp.pitchHeadline')}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-700)', lineHeight: 1.45 }}>
                {t('signUp.pitchSub')}
              </div>
            </div>
          </div>
        )}

        {/* avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, animation: 'wp-pop-in .32s .06s cubic-bezier(.34,1.4,.64,1) both' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar name={name || t('common.you')} src={photo} size="xl" ring ringVariant={isLoggedIn ? 'online' : 'offline'} />
            <button
              onClick={pickFile}
              aria-label={t('profile.uploadLabel')}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 34, height: 34, borderRadius: 99,
                background: 'var(--ink-900)', color: 'var(--paper)',
                border: '3px solid var(--surface-app)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', padding: 0,
              }}
            >
              <Icon name="camera" size={14} />
            </button>
          </div>
          <button
            onClick={pickFile}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
              color: 'var(--mint-600)', padding: '2px 0',
            }}
          >
            {photo ? t('profile.changePhoto') : t('signUp.addPhoto')}
          </button>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5, maxWidth: 240 }}>
            {t('profile.photoNote')}
          </p>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
        </div>

        {/* name input */}
        <div style={{ animation: 'wp-pop-in .32s .1s cubic-bezier(.34,1.4,.64,1) both' }}>
          <Input
            placeholder={t('signUp.namePlaceholder')}
            value={name}
            maxLength={24}
            autoComplete="given-name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* auth section */}
        {isLoggedIn ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'wp-pop-in .32s .14s cubic-bezier(.34,1.4,.64,1) both' }}>
            <button
              onClick={() => onSave(buildProfile())}
              disabled={!hasName}
              className="wp-btn wp-btn--lg wp-btn--block"
            >
              Save profile
            </button>
            <button
              onClick={onSignOut}
              style={{
                width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15,
                color: 'var(--red-500, #ef4444)', padding: '12px 0', minHeight: 44,
              }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'wp-pop-in .32s .14s cubic-bezier(.34,1.4,.64,1) both' }}>

            {/* Apple */}
            <button
              onClick={handleApple}
              disabled={!hasName}
              className="wp-btn wp-btn--lg wp-btn--apple wp-btn--block"
            >
              <AppleLogo />
              {t('signUp.continueApple')}
            </button>

            {/* divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '2px 0' }}>
              <div style={{ flex: 1, height: 1.5, background: 'var(--line)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>
                {t('signUp.orEmail')}
              </span>
              <div style={{ flex: 1, height: 1.5, background: 'var(--line)' }} />
            </div>

            {/* email block */}
            {emailState === 'idle' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Input
                  placeholder={t('signUp.emailPlaceholder')}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  prefix={<Icon name="mail" size={16} color="var(--text-faint)" />}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  onClick={handleMagicLink}
                  disabled={!hasName || !hasEmail}
                  className="wp-btn wp-btn--lg wp-btn--secondary wp-btn--block"
                >
                  {t('signUp.magicLinkCta')}
                </button>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                  {hasName ? t('signUp.magicLinkHelper') : t('signUp.magicLinkHelperNoName')}
                </p>
              </div>
            ) : (
              <div style={{
                background: 'var(--mint-50)',
                border: '2px solid var(--ink-900)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 20px 18px',
                boxShadow: '0 4px 0 var(--mint-600)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center',
                animation: 'wp-pop-in .32s cubic-bezier(.34,1.4,.64,1) both',
              }}>
                <div style={{ fontSize: 30, lineHeight: 1 }}>📬</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: 'var(--ink-900)', lineHeight: 1.2 }}>
                  {t('signUp.sentTitle')}
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-700)', lineHeight: 1.5, margin: 0, maxWidth: 260 }}>
                  {t('signUp.sentBody', { email: email.trim() })}
                </p>
                <button
                  onClick={() => onSave(buildProfile())}
                  className="wp-btn wp-btn--lg wp-btn--block"
                  style={{ marginTop: 4 }}
                >
                  {t('signUp.sentCta')}
                </button>
                <button
                  onClick={() => { setEmailState('idle'); setEmail(''); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13.5,
                    color: 'var(--text-muted)', padding: '6px 0', minHeight: 44,
                  }}
                >
                  {t('signUp.sentChange')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* footer — only shown for sign-in flow */}
        {!isLoggedIn && (
          <p style={{ margin: '4px 0 0', textAlign: 'center', fontSize: 12, color: 'var(--text-faint)', fontWeight: 500, letterSpacing: '.01em' }}>
            {t('signUp.footer')}
          </p>
        )}
      </div>
    </div>
  );
}
