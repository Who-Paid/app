import { avatarColor, initials } from '../../lib/util';

type Size = 'sm' | 'md' | 'lg' | 'xl';

export function Avatar({
  name = '', src = null, size = 'md', ring = false,
}: { name?: string; src?: string | null; size?: Size; ring?: boolean }) {
  const cls = ['wp-avatar', `wp-avatar--${size}`, ring ? 'wp-avatar--ring' : ''].filter(Boolean).join(' ');
  return (
    <span className={cls} style={{ background: src ? undefined : avatarColor(name) }}>
      {src ? <img src={src} alt={name} /> : initials(name)}
    </span>
  );
}
