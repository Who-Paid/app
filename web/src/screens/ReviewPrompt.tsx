import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { markReviewAsked } from '../lib/pro';

// Replace with your actual App Store / Play Store URL before publishing
const STORE_URL = 'https://apps.apple.com/app/who-paid';

interface Props {
  onClose: () => void;
}

export function ReviewPrompt({ onClose }: Props) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(0);
  const [rating, setRating] = useState(0);
  const [done, setDone] = useState(false);

  const choose = (n: number) => {
    setRating(n);
    markReviewAsked();
    setDone(true);
    if (n >= 4) {
      setTimeout(() => {
        window.open(STORE_URL, '_blank', 'noopener');
        onClose();
      }, 700);
    } else {
      setTimeout(onClose, 1800);
    }
  };

  const dismiss = () => { markReviewAsked(); onClose(); };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', left: 16, right: 16, bottom: 'calc(20px + var(--wp-pad-bottom))',
        background: 'var(--surface-app)', borderRadius: 20, padding: '18px 20px',
        boxShadow: 'var(--shadow-xl)', animation: 'wp-sheet-up .28s cubic-bezier(.34,1.3,.64,1) both',
        pointerEvents: 'all',
      }}>
        {done ? (
          <div style={{ textAlign: 'center', padding: '6px 0' }}>
            <div style={{ fontSize: 30, marginBottom: 6 }}>{rating >= 4 ? '🙌' : '🙏'}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>
              {rating >= 4 ? t('review.openingStore') : t('review.thanksFeedback')}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                {t('review.enjoying')}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 12 }}>
                {t('review.ratingHelps')}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => choose(n)}
                    onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
                    style={{
                      flex: 1, border: 'none', background: 'none', cursor: 'pointer', padding: '2px 0',
                      fontSize: 26, transition: 'filter .12s, transform .12s',
                      filter: (hovered || rating) >= n ? 'none' : 'grayscale(1) opacity(.35)',
                      transform: hovered === n ? 'scale(1.18)' : 'scale(1)',
                    }}>⭐</button>
                ))}
              </div>
            </div>
            <button onClick={dismiss} style={{
              border: 'none', background: 'none', cursor: 'pointer', padding: 4,
              color: 'var(--text-faint)', lineHeight: 0, flex: 'none',
            }}>✕</button>
          </div>
        )}
      </div>
    </div>
  );
}
