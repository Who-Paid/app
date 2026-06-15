import { useRef, useState } from 'react';
import type { Person, Table } from '../lib/types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Icon } from '../components/ui/Icon';

interface Props {
  table: Table;
  person: Person;
  onClose: () => void;
  onSave: (tableId: string, personId: string, upd: Partial<Person>) => void;
  onMarkPaid: (tableId: string, personId: string) => void;
}

export function EditSheet({ table, person, onClose, onSave, onMarkPaid }: Props) {
  const [name, setName] = useState(person.name || '');
  const [amount, setAmount] = useState(person.amount != null ? String(person.amount) : '');
  const [photo, setPhoto] = useState<string | null>(person.photo || null);
  const fileRef = useRef<HTMLInputElement>(null);
  const isPayer = table.paidBy === person.id;

  const pickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setPhoto(r.result as string);
    r.readAsDataURL(f);
  };

  const save = () => {
    onSave(table.id, person.id, {
      name: person.isMe ? person.name : (name.trim() || ''),
      amount: amount.trim() === '' ? null : parseFloat(amount) || 0,
      photo,
    });
    onClose();
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 90 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(28,27,41,.45)' }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'var(--surface-app)', borderRadius: '28px 28px 0 0',
        padding: '12px 22px calc(22px + var(--wp-pad-bottom))', boxShadow: 'var(--shadow-xl)',
        animation: 'wp-sheet-up .32s cubic-bezier(.34,1.3,.64,1) both',
      }}>
        <div style={{ width: 44, height: 5, borderRadius: 99, background: 'var(--ink-300)', margin: '0 auto 16px' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ fontSize: 23 }}>{person.isMe ? 'You' : (person.name || 'Add name')}</h2>
          <button onClick={onClose} aria-label="Close" style={{
            width: 36, height: 36, borderRadius: 99, border: 'none', cursor: 'pointer',
            background: 'var(--surface-sunken)', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="x" size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div onClick={() => fileRef.current?.click()} style={{
              width: 76, height: 76, borderRadius: 20, flex: 'none', cursor: 'pointer', overflow: 'hidden',
              border: photo ? 'none' : '2px dashed var(--ink-300)',
              background: photo ? `center/cover url(${photo})` : 'var(--card)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-300)',
            }}>{!photo && <Icon name="camera" size={26} />}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-strong)' }}>
                {photo ? 'Photo added' : 'Snap a photo'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>
                Fill their side of the table.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
                  {photo ? 'Replace' : 'Add photo'}
                </Button>
                {photo && <Button variant="ghost" size="sm" onClick={() => setPhoto(null)}>Remove</Button>}
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={pickPhoto} style={{ display: 'none' }} />
          </div>

          {!person.isMe && (
            <Input label="Their name" placeholder="e.g. Daniel" value={name} onChange={(e) => setName(e.target.value)} />
          )}
          <Input label="Amount they paid" prefix="$" amount inputMode="decimal" placeholder="0.00"
            value={amount} onChange={(e) => setAmount(e.target.value)} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 2 }}>
            <Button variant="primary" size="lg" block onClick={save}>Save</Button>
            {!isPayer && (
              <Button variant="secondary" size="md" block iconLeft={<Icon name="coins" size={20} />}
                onClick={() => { onMarkPaid(table.id, person.id); onClose(); }}>
                Mark {person.isMe ? 'you' : 'them'} as paid
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
