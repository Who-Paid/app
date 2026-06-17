import { GoldCoin } from '../components/GoldCoin';
import { Avatar } from '../components/ui/Avatar';
import type { Table } from '../lib/types';

export function ClaimSeat({ table, onClaim }: { table: Table; onClaim: (personId: string) => void }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 90, background: 'var(--surface-app)',
      display: 'flex', flexDirection: 'column',
      padding: 'calc(var(--wp-pad-top) + 26px) 22px calc(26px + var(--wp-pad-bottom))',
      animation: 'wp-claim-in .3s ease both',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}>
        <GoldCoin size={54} mood="idle" />
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>Joining</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--ink-700)' }}>{table.name}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 27, margin: '6px 0 2px' }}>Who are you?</h2>
        <p style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>Pick your name to join the table</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 28 }}>
        {table.people.map((p) => {
          const isCreator = !!p.isMe;
          return isCreator ? (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 14, background: 'var(--paper-2)',
              border: '2px solid var(--ink-100)', borderRadius: 20, padding: '12px 16px',
              opacity: 0.5, textAlign: 'left',
            }}>
              <Avatar name={p.name || 'Guest'} src={p.profilePhoto ?? p.photo ?? null} size="sm" />
              <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: 'var(--ink-300)' }}>
                {p.name || 'Someone'}
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, color: 'var(--ink-300)', whiteSpace: 'nowrap' }}>already joined</span>
            </div>
          ) : (
            <button key={p.id} onClick={() => onClaim(p.id)} className="wp-claim-opt"
              style={{
                display: 'flex', alignItems: 'center', gap: 14, background: 'var(--card)',
                border: '2px solid var(--ink-900)', borderRadius: 20, padding: '12px 16px',
                cursor: 'pointer', boxShadow: 'var(--pop-ink)', textAlign: 'left',
              }}>
              <Avatar name={p.name || 'Guest'} src={p.profilePhoto ?? p.photo ?? null} size="sm" />
              <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: 'var(--ink-900)' }}>
                {p.name || 'Open seat'}
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'var(--ink-300)', whiteSpace: 'nowrap' }}>this is me ›</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
