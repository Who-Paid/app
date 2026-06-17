import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import type { Person, Table } from '../lib/types';
import { compressImage } from '../lib/compressImage';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Icon } from '../components/ui/Icon';

function fmtTime(iso: string, lang: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString(lang, { day: 'numeric', month: 'short' });
}

interface Props {
  table: Table;
  person: Person;
  onClose: () => void;
  onSave: (tableId: string, personId: string, upd: Partial<Person>) => void;
  onRemove: (tableId: string, personId: string) => void;
}

export function EditSheet({ table, person, onClose, onSave, onRemove }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState(person.name || '');
  const [photo, setPhoto] = useState<string | null>(person.photo || null);
  const [payments, setPayments] = useState<{ id: string; amount: number; addedAt?: string }[]>(() => {
    if (person.payments && person.payments.length > 0) return person.payments;
    if (person.amount != null) return [{ id: crypto.randomUUID(), amount: person.amount }];
    return [];
  });
  const [addValue, setAddValue] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const total = payments.reduce((s, p) => s + p.amount, 0);

  const pickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = async () => {
      const compressed = await compressImage(r.result as string, 512);
      setPhoto(compressed);
    };
    r.readAsDataURL(f);
  };

  const confirmAdd = () => {
    const v = parseFloat(addValue);
    if (!isNaN(v) && v > 0) {
      setPayments((ps) => [...ps, { id: crypto.randomUUID(), amount: v, addedAt: new Date().toISOString() }]);
    }
    setAddValue('');
    setShowAdd(false);
  };

  const save = () => {
    onSave(table.id, person.id, {
      name: person.isMe ? person.name : (name.trim() || ''),
      amount: payments.length > 0 ? total : null,
      payments,
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
          <h2 style={{ fontSize: 23 }}>{person.isMe ? t('editSheet.titleSelf') : (person.name || t('common.addName'))}</h2>
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
                {photo ? t('editSheet.photoAdded') : t('editSheet.snapPhoto')}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>
                {person.isMe ? t('editSheet.beautifySelf') : t('editSheet.beautifyOther')}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
                  {photo ? t('editSheet.replacePhoto') : t('editSheet.addPhoto')}
                </Button>
                {photo && <Button variant="ghost" size="sm" onClick={() => setPhoto(null)}>{t('editSheet.removePhoto')}</Button>}
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={pickPhoto} style={{ display: 'none' }} />
          </div>

          {!person.isMe && (
            <Input label={t('editSheet.theirName')} placeholder={t('editSheet.namePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} />
          )}

          {/* Payments section */}
          <div style={{ background: 'var(--surface-sunken)', borderRadius: 16, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.03em' }}>{t('editSheet.total')}</span>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
                color: payments.length > 0 ? 'var(--ink-900)' : 'var(--ink-300)',
              }}>
                {payments.length > 0 ? `$${total.toFixed(2)}` : '—'}
              </span>
            </div>

            {payments.length > 0 && (
              <div style={{ borderTop: '1px solid var(--ink-100)', marginTop: 10, paddingTop: 6 }}>
                {payments.map((p, i) => (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '5px 0',
                    borderBottom: i < payments.length - 1 ? '1px solid var(--ink-100)' : 'none',
                  }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-900)' }}>${p.amount.toFixed(2)}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {p.addedAt && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-faint)', fontVariantNumeric: 'tabular-nums' }}>
                          {fmtTime(p.addedAt, i18n.language || 'en')}
                        </span>
                      )}
                      <button
                        onClick={() => setPayments((ps) => ps.filter((x) => x.id !== p.id))}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-muted)', display: 'flex' }}
                      ><Icon name="x" size={15} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showAdd ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <span style={{ fontSize: 15, color: 'var(--text-muted)', fontWeight: 600 }}>$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={addValue}
                  onChange={(e) => setAddValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmAdd();
                    if (e.key === 'Escape') { setAddValue(''); setShowAdd(false); }
                  }}
                  autoFocus
                  style={{
                    flex: 1, border: 'none', background: 'transparent', outline: 'none',
                    fontSize: 15, fontWeight: 600, color: 'var(--ink-900)',
                    fontFamily: 'var(--font-display)',
                  }}
                />
                <Button variant="primary" size="sm" onClick={confirmAdd}>{t('editSheet.add')}</Button>
              </div>
            ) : (
              <button
                onClick={() => setShowAdd(true)}
                style={{
                  marginTop: 10, border: 'none', background: 'none', cursor: 'pointer', padding: 0,
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: 13, fontWeight: 700, color: 'var(--text-muted)',
                }}
              >
                <Icon name="plus" size={14} />
                {t('editSheet.addPaymentLabel')}
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 2 }}>
            <Button variant="primary" size="lg" block onClick={save}>{t('common.save')}</Button>
            {table.people.length >= 3 && !person.isMe && (
              <Button variant="ghost" size="md" block iconLeft={<Icon name="trash-2" size={18} />}
                onClick={() => { onRemove(table.id, person.id); onClose(); }}
                style={{ color: 'var(--red-500, #ef4444)' }}>
                {t('editSheet.remove', { name: person.name || t('common.openSeat') })}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
