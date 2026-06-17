import { avatarColor, initials } from '../../lib/util';

type Size = 'sm' | 'md' | 'lg' | 'xl';

export function Avatar({
  name = '', src = null, size = 'md', ring = false, ringVariant = 'online',
}: { name?: string; src?: string | null; size?: Size; ring?: boolean; ringVariant?: 'online' | 'offline' }) {
  const ringClass = ring ? (ringVariant === 'offline' ? 'wp-avatar--ring-offline' : 'wp-avatar--ring') : '';
  const cls = ['wp-avatar', `wp-avatar--${size}`, ringClass].filter(Boolean).join(' ');
  return (
    <span className={cls} style={{ background: src ? undefined : avatarColor(name) }}>
      {src ? <img src={src} alt={name} /> : initials(name)}
    </span>
  );
}
