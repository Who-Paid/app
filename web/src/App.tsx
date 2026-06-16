import { useCallback, useEffect, useRef, useState } from 'react';
import type { Profile, Table } from './lib/types';
import { useTables } from './lib/useTables';
import { isAtLimit, isPro, proStatus, incrementWinCount, shouldShowReview } from './lib/pro';
import { StartScreen } from './screens/StartScreen';
import { TableScreen } from './screens/TableScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { EditSheet } from './screens/EditSheet';
import { PaywallSheet } from './screens/PaywallSheet';
import { ReviewPrompt } from './screens/ReviewPrompt';
import { Toast } from './components/Toast';

type View = 'start' | 'table' | 'profile';

export default function App() {
  const { tables, loading, syncEnabled, refresh, createTable, setPaid, savePerson, addPerson, joinByInvite, deleteTable, removePerson } = useTables();
  const [view, setView] = useState<View>('start');
  const [openId, setOpenId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>(() => {
    try { const s = localStorage.getItem('wp-profile'); if (s) return JSON.parse(s); } catch { /* ignore */ }
    return { name: 'You', photo: null };
  });
  const [edit, setEdit] = useState<{ tableId: string; personId: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallTrigger, setPaywallTrigger] = useState<string | undefined>(undefined);
  const [showReview, setShowReview] = useState(false);
  const toastTimer = useRef<number | undefined>(undefined);
  const reviewTimer = useRef<number | undefined>(undefined);

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
        flash("That table link isn't available");
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

  const doCreateTable = useCallback(() => {
    const t = createTable(profile);
    setOpenId(t.id);
    setView('table');
    flash('New table — add who you ate with 🍽️');
  }, [createTable, flash, profile]);

  const startNew = () => {
    if (isAtLimit(tables.length)) {
      setShowPaywall(true);
      return;
    }
    doCreateTable();
  };

  const handleTrialStarted = () => {
    setShowPaywall(false);
    doCreateTable();
    flash('7-day Pro trial started — unlimited tables unlocked 🎉');
  };

  const handlePaid = (tableId: string, personId: string) => {
    setPaid(tableId, personId);
    const wins = incrementWinCount();
    if (shouldShowReview(wins)) {
      clearTimeout(reviewTimer.current);
      // Delay so confetti plays first
      reviewTimer.current = window.setTimeout(() => setShowReview(true), 1400);
    }
  };

  const onInvite = async (table: Table) => {
    const url = `${window.location.origin}${window.location.pathname}#/t/${table.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Who Paid?', text: `Join "${table.name}" on Who Paid?`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      flash(syncEnabled ? "Invite link copied 🔗 — they'll see this table live" : 'Invite link copied 🔗');
    } catch {
      flash('Invite link: ' + url);
    }
  };

  // Keep "Me" photo in sync across all tables whenever it changes.
  const syncProfileToTables = useCallback((photo: string | null) => {
    tables.forEach((t) => {
      const me = t.people.find((p) => p.isMe);
      if (me && me.profilePhoto !== photo) savePerson(t.id, me.id, { profilePhoto: photo });
    });
  }, [tables, savePerson]);

  // On first load, push any saved profile photo to tables that pre-date the profile.
  const didInitSync = useRef(false);
  useEffect(() => {
    if (loading || didInitSync.current) return;
    didInitSync.current = true;
    syncProfileToTables(profile.photo);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const onSaveProfile = (next: Profile) => {
    setProfile(next);
    try { localStorage.setItem('wp-profile', JSON.stringify(next)); } catch { /* ignore */ }
    syncProfileToTables(next.photo);
    setView('start');
    flash('Profile saved ✓');
  };

  const status = proStatus();

  return (
    <div className="wp-shell">
      <div style={{ position: 'relative', height: '100%' }}>
        {view === 'table' && current ? (
          <TableScreen
            table={current}
            onBack={() => setView('start')}
            onPaid={handlePaid}
            onEditPerson={(tid, pid) => setEdit({ tableId: tid, personId: pid })}
            onAddPerson={(tid) => {
            const tbl = tables.find((t) => t.id === tid);
            if (tbl && tbl.people.length >= 3 && !isPro()) {
              setPaywallTrigger('A 4-person table is a Pro feature. Split four ways, no sweat.');
              setShowPaywall(true);
              return;
            }
            addPerson(tid);
            flash(tbl && tbl.people.length >= 3 ? 'Fourth seat added — splitting four ways' : 'Third seat added — table splits in thirds');
          }}
            onInvite={onInvite}
          />
        ) : (
          <div style={{ height: '100%', overflow: 'auto' }}>
            <StartScreen
              tables={tables}
              onOpen={(id) => { setOpenId(id); setView('table'); void refresh(); }}
              onNew={startNew}
              onDelete={deleteTable}
              status={status}
              profile={profile}
              onProfile={() => setView('profile')}
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
            onRemove={(tid, pid) => { removePerson(tid, pid); setEdit(null); }}
          />
        )}

        {showPaywall && (
          <PaywallSheet
            tableCount={tables.length}
            onClose={() => { setShowPaywall(false); setPaywallTrigger(undefined); }}
            onTrialStarted={handleTrialStarted}
            trigger={paywallTrigger}
          />
        )}

        {showReview && (
          <ReviewPrompt onClose={() => setShowReview(false)} />
        )}

        {view === 'profile' && (
          <ProfileScreen
            profile={profile}
            onBack={() => setView('start')}
            onSave={onSaveProfile}
          />
        )}
      </div>
    </div>
  );
}
