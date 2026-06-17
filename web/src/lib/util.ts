import i18n from '../i18n';

/** "today" / "yesterday" / "3 days ago" / "14 Jun" from an ISO string. */
export function paidLabel(iso: string | null): string | null {
  if (!iso) return null;
  const t = i18n.t.bind(i18n);
  const d = new Date(iso);
  const now = new Date();
  const days = Math.round(
    (new Date(now.toDateString()).getTime() - new Date(d.toDateString()).getTime()) / 86400000,
  );
  if (days <= 0) return t('time.today');
  if (days === 1) return t('time.yesterday');
  if (days < 7) return t('time.daysAgo', { count: days });
  const lang = i18n.language || 'en';
  return `${d.getDate()} ${d.toLocaleString(lang, { month: 'short' })}`;
}

export const nowISO = () => new Date().toISOString();

const PALETTE = [
  'var(--avatar-1)', 'var(--avatar-2)', 'var(--avatar-3)', 'var(--avatar-4)',
  'var(--avatar-5)', 'var(--avatar-6)', 'var(--avatar-7)', 'var(--avatar-8)',
];

function hashName(name = ''): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const avatarColor = (name: string) => PALETTE[hashName(name) % PALETTE.length];

export function initials(name = ''): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
