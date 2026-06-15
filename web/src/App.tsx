import { useCallback, useEffect, useRef, useState } from 'react';
import type { Table } from './lib/types';
import { useTables } from './lib/useTables';
import { StartScreen } from './screens/StartScreen';
import { TableScreen } from './screens/TableScreen';
import { EditSheet } from './screens/EditSheet';
import { Toast } from './components/Toast';

type View = 'start' | 'table';

export default function App() {
  const { tables, syncEnabled, createTable, setPaid, savePerson, addPerson, joinByInvite } = useTables();
  const [view, setView] = useState<View>('start');
  const [openId, setOpenId] = useState<string | null>(null);
  const [edit, setEdit] = useState<{ tableId: string; personId: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  // Handle invite links: #/t/<id>
  useEffect(() => {
    const m = window.location.hash.match(/#\/t\/([\w-]+)/);
    if (!m) return;
    const id = m[1];
    (async () => {
      const t = await joinByInvite(id);
      if (t) {
        setOpenId(id);
        setView('table');
        flash(syncEnabled ? 'Joined a shared table 🔗' : 'Opened a shared table');
      } else {
        flash('That table link isn’t available');
      }
      history.replaceState(null, '', window.location.pathname + window.location.search);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = tables.find((t) => t.id === openId) || null;
  const editPerson = edit
    ? (tables.find((t) => t.id === edit.tableId)?.people.find((p) => p.id === edit.personId) ?? null)
    : null;
  const editTable = edit ? tables.find((t) => t.id === edit.tableId) ?? null : null;

  const startNew = () => {
    const t = createTable();
    setOpenId(t.id);
    setView('table');
    flash('New table — add who you ate with 🍽️');
  };

  const onInvite = async (table: Table) => {
    const url = `${window.location.origin}${window.location.pathname}#/t/${table.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Who Paid?', text: `Join “${table.name}” on Who Paid?`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      flash(syncEnabled ? 'Invite link copied 🔗 — they’ll see this table live' : 'Invite link copied 🔗');
    } catch {
      flash('Invite link: ' + url);
    }
  };

  return (
    <div className="wp-shell">
      <div style={{ position: 'relative', height: '100%' }}>
        {view === 'table' && current ? (
          <TableScreen
            table={current}
            onBack={() => setView('start')}
            onPaid={setPaid}
            onEditPerson={(tid, pid) => setEdit({ tableId: tid, personId: pid })}
            onAddPerson={(tid) => { addPerson(tid); flash('Third seat added — table splits in thirds'); }}
            onInvite={onInvite}
          />
        ) : (
          <div style={{ height: '100%', overflow: 'auto' }}>
            <StartScreen
              tables={tables}
              onOpen={(id) => { setOpenId(id); setView('table'); }}
              onNew={startNew}
            />
          </div>
        )}

        <Toast msg={toast} />

        {editPerson && editTable && (
          <EditSheet
            table={editTable}
            person={editPerson}
            onClose={() => setEdit(null)}
            onSave={savePerson}
            onMarkPaid={(tid, pid) => { setPaid(tid, pid); flash('Coin moved — paid stamp updated ✓'); }}
          />
        )}
      </div>
    </div>
  );
}
