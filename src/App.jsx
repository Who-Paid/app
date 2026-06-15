import WP_DATA from './data.js'
import { todayISO } from './util.jsx'
import StartScreen from './StartScreen.jsx'
import TableScreen from './TableScreen.jsx'
import EditSheet from './EditSheet.jsx'

function WPToast({ msg }) {
  if (!msg) return null
  return (
    <div style={{
      position: 'absolute', top: 'calc(8px + var(--wp-pad-top))', left: '50%', transform: 'translateX(-50%)', zIndex: 200,
      background: 'var(--ink-900)', color: 'var(--paper)', padding: '11px 18px', borderRadius: 999,
      fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13.5, boxShadow: 'var(--shadow-lg)',
      whiteSpace: 'nowrap', animation: 'wp-rise .3s ease both', maxWidth: '88%',
    }}>{msg}</div>
  )
}

let WP_UID = 100
function wpNewTable() {
  WP_UID += 1
  return {
    id: `t${WP_UID}`, name: 'New table', synced: false, paidBy: null, paidAt: null,
    people: [
      { id: `o${WP_UID}`, name: '', photo: null, amount: null },
      { id: 'me', name: 'Me', isMe: true, photo: null, amount: null },
    ],
  }
}

export default function WPApp({ Frame, padTop = '54px', padBottom = '18px' }) {
  const { useState } = React
  const [tables, setTables] = useState(() => JSON.parse(JSON.stringify(WP_DATA.tables)))
  const [view, setView] = useState('start')
  const [openId, setOpenId] = useState(null)
  const [edit, setEdit] = useState(null)
  const [toast, setToast] = useState(null)

  const T = (id) => tables.find((t) => t.id === id)
  const flash = (msg) => { setToast(msg); clearTimeout(flash._t); flash._t = setTimeout(() => setToast(null), 2400) }
  const patch = (tableId, fn) => setTables((ts) => ts.map((t) => t.id === tableId ? fn(t) : t))

  const startNew = () => {
    const t = wpNewTable()
    setTables((ts) => [t, ...ts])
    setOpenId(t.id); setView('table')
    flash('New table — add who you ate with 🍽️')
  }
  const onPaid = (tableId, personId) => patch(tableId, (t) => ({ ...t, paidBy: personId, paidAt: todayISO() }))
  const onSavePerson = (tableId, personId, upd) => {
    patch(tableId, (t) => ({ ...t, people: t.people.map((p) => p.id === personId ? { ...p, ...upd } : p) }))
    setEdit(null)
  }
  const onMarkPaid = (tableId, personId) => { onPaid(tableId, personId); setEdit(null); flash('Coin moved — paid stamp updated ✓') }
  const onAddPerson = (tableId) => {
    WP_UID += 1; const nid = `o${WP_UID}`
    patch(tableId, (t) => {
      if (t.people.length >= 3) return t
      const me = t.people.find((p) => p.isMe)
      const others = t.people.filter((p) => !p.isMe)
      return { ...t, people: [...others, { id: nid, name: '', photo: null, amount: null }, me] }
    })
    flash('Third seat added — table splits in thirds')
  }
  const onInvite = () => flash('Invite link copied 🔗 — they\'ll see this table live')

  let body
  if (view === 'table' && openId && T(openId)) {
    body = (
      <TableScreen
        table={T(openId)} meName={WP_DATA.meName}
        onBack={() => setView('start')} onPaid={onPaid}
        onEditPerson={(tid, pid) => setEdit({ tableId: tid, personId: pid })}
        onAddPerson={onAddPerson} onInvite={onInvite} />
    )
  } else {
    body = (
      <div style={{ height: '100%', overflow: 'auto' }}>
        <StartScreen tables={tables} meName={WP_DATA.meName}
          onOpen={(id) => { setOpenId(id); setView('table') }} onNew={startNew} />
      </div>
    )
  }

  const editPerson = edit && T(edit.tableId) && T(edit.tableId).people.find((p) => p.id === edit.personId)

  return (
    <Frame>
      <div style={{ position: 'relative', height: '100%', '--wp-pad-top': padTop, '--wp-pad-bottom': padBottom }}>
        {body}
        <WPToast msg={toast} />
        {editPerson && (
          <EditSheet table={T(edit.tableId)} person={editPerson}
            onClose={() => setEdit(null)} onSave={onSavePerson} onMarkPaid={onMarkPaid} />
        )}
      </div>
    </Frame>
  )
}
