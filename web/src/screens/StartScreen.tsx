import { useState } from 'react';
import type { Table } from '../lib/types';
import { paidLabel } from '../lib/util';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';

function MiniTable({ table }: { table: Table }) {
  const n = table.people.length;
  const idx = table.people.findIndex((p) => p.id === table.paidBy);
  return (
    <div style={{
      width: 38, height: 46, borderRadius: 10, overflow: 'hidden', flex: 'none',
      border: '1.5px solid var(--border)', position: 'relative', background: 'var(--surface-sunken)',
    }}>
      {table.people.map((p, i) => (
        <div key={p.id} style={{
          position: 'absolute', left: 0, right: 0, top: `${(i / n) * 100}%`, height: `${(1 / n) * 100}%`,
          background: i === idx ? 'var(--mint-200)' : 'transparent',
          borderTop: i > 0 ? '1px solid var(--ink-100)' : 'none',
        }} />
      ))}
      {idx >= 0 && (
        <div style={{
          position: 'absolute', left: '50%', top: `${((idx + 0.5) / n) * 100}%`, transform: 'translate(-50%,-50%)',
          width: 16, height: 16, borderRadius: 99, background: 'var(--mint-400)', border: '2px solid #fff',
        }} />
      )}
    </div>
  );
}

export function StartScreen({
  tables, onOpen, onNew, onDelete,
}: { tables: Table[]; onOpen: (id: string) => void; onNew: () => void; onDelete: (id: string) => void }) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  return (
    <div style={{
      padding: 'calc(var(--wp-pad-top) + 8px) 20px calc(var(--wp-pad-bottom) + 14px)',
      display: 'flex', flexDirection: 'column', gap: 24, minHeight: '100%', boxSizing: 'border-box',
    }}>
      {/* brand */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <img src="logo-mark.svg" alt="" style={{ width: 32, height: 32 }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--ink-900)' }}>
            Who<span style={{ color: 'var(--mint-500)' }}>Paid</span>?
          </span>
        </div>
        <Avatar name="You" size="md" ring />
      </div>

      {/* hero */}
      <div style={{ marginTop: 4 }}>
        <h1 style={{ fontSize: 38, lineHeight: 1.02 }}>Whose round<br />was it again?</h1>
        <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: 15, marginTop: 10 }}>
          One coin per table. Whoever paid keeps it — flick it over when it&apos;s your shout.
        </p>
      </div>

      <Button variant="primary" size="lg" block onClick={onNew} iconLeft={<Icon name="plus" size={22} />}>
        Start new table
      </Button>

      {/* existing tables */}
      <div>
        <div className="wp-eyebrow" style={{ marginBottom: 12 }}>Your tables</div>
        {tables.length === 0 ? (
          <p style={{ color: 'var(--text-faint)', fontWeight: 600, fontSize: 14 }}>
            No tables yet — start one above.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tables.map((t) => {
              const payer = t.people.find((p) => p.id === t.paidBy);
              const payerName = payer ? (payer.isMe ? 'You' : payer.name) : '—';
              const others = t.people.filter((p) => !p.isMe).map((p) => p.name).filter(Boolean).join(' & ');
              const label = others || 'New table';
              const isConfirming = confirmId === t.id;
              return (
                <div key={t.id} className="wp-card wp-card--pad-md" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <button onClick={() => onOpen(t.id)} className="wp-card--interactive"
                    style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', width: '100%', cursor: 'pointer', font: 'inherit', background: 'none', border: 'none', padding: 0 }}>
                    <MiniTable table={t} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--ink-900)' }}>
                        {label}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2, fontWeight: 600 }}>
                        {payer ? `${payerName} paid last · ${paidLabel(t.paidAt)}` : 'No coin tossed yet'}
                      </div>
                    </div>
                    {t.synced ? <Badge color="mint" dot>synced</Badge> : <Badge color="neutral">just you</Badge>}
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmId(t.id); }}
                      aria-label="Delete table"
                      style={{ background: 'none', border: 'none', padding: '4px 2px', cursor: 'pointer', color: 'var(--text-faint)', lineHeight: 0 }}
                    >
                      <Icon name="trash-2" size={16} />
                    </button>
                  </button>
                  {isConfirming && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--ink-700)' }}>Delete {label}?</span>
                      <button onClick={() => setConfirmId(null)}
                        style={{ background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
                        Cancel
                      </button>
                      <button onClick={() => { setConfirmId(null); onDelete(t.id); }}
                        style={{ background: 'var(--red-500, #ef4444)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#fff' }}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
