import { useRef, useState } from 'react';
import type { Profile } from '../lib/types';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { IconButton } from '../components/ui/IconButton';
import { Input } from '../components/ui/Input';

interface Props {
  profile: Profile;
  onBack: () => void;
  onSave: (next: Profile) => void;
}

export function ProfileScreen({ profile, onBack, onSave }: Props) {
  const [name, setName] = useState(profile.name);
  const [photo, setPhoto] = useState<string | null>(profile.photo);
  const fileRef = useRef<HTMLInputElement>(null);

  const changed = name.trim() !== profile.name || photo !== profile.photo;
  const canSave = changed && name.trim().length > 0;

  const pickFile = () => fileRef.current?.click();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(f);
    e.target.value = '';
  };

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      background: 'var(--surface-app)',
      paddingTop: 'var(--wp-pad-top)',
      paddingBottom: 'calc(var(--wp-pad-bottom) + 14px)',
      boxSizing: 'border-box',
    }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px 16px' }}>
        <IconButton label="Back" onClick={onBack}><Icon name="arrow-left" size={22} /></IconButton>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--ink-900)' }}>
          Profile
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 0', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* avatar + upload */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, paddingTop: 12 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar name={name || 'You'} src={photo} size="xl" ring />
            <button
              onClick={pickFile}
              aria-label="Upload photo"
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 32, height: 32, borderRadius: 99,
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
              color: 'var(--mint-600)', padding: '2px 0', whiteSpace: 'nowrap',
            }}
          >
            {photo ? 'Change photo' : 'Upload a photo'}
          </button>
          <p style={{
            margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)',
            textAlign: 'center', lineHeight: 1.5, maxWidth: 240,
          }}>
            This photo is shared with people in your synced tables.
          </p>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
        </div>

        {/* name */}
        <Input
          label="First name"
          placeholder="Your first name"
          value={name}
          maxLength={24}
          onChange={(e) => setName(e.target.value)}
        />

        {/* save */}
        <Button
          variant="primary" size="lg" block
          disabled={!canSave}
          onClick={() => onSave({ name: name.trim(), photo })}
        >
          Save profile
        </Button>
      </div>
    </div>
  );
}
