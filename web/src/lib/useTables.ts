import { useCallback, useEffect, useRef, useState } from 'react';
import type { Person, Profile, Table } from './types';
import { backend, syncEnabled } from './store';
import { nowISO } from './util';

let uid = 0;
const newId = (p: string) => `${p}${Date.now().toString(36)}${(uid++).toString(36)}`;

// ── Per-device perspective ────────────────────────────────────────────────────
// Tracks which person is "me" on this device for each shared table.
// This must survive realtime refreshes without touching the shared Supabase row.
const LS_PERSP = 'wp-me-v2';
const perspMap: Record<string, string> = (() => {
  try { return JSON.parse(localStorage.getItem(LS_PERSP) ?? '{}'); } catch { return {}; }
})();

function savePersp(tableId: string, personId: string) {
  perspMap[tableId] = personId;
  try { localStorage.setItem(LS_PERSP, JSON.stringify(perspMap)); } catch { /* ignore */ }
}

function applyPersp(table: Table): Table {
  let meId = perspMap[table.id];
  if (!meId) {
    // Auto-migrate: recover the creator's person from the canonical field or the
    // legacy isMe:true flag.  This fires once per device per table and is idempotent.
    const origId = table.creatorPersonId ?? table.people.find(p => p.isMe)?.id;
    if (origId) { savePersp(table.id, origId); meId = origId; }
  }
  if (!meId) return table;
  const meIdx = table.people.findIndex(p => p.id === meId);
  if (meIdx < 0) return table;
  const people = table.people.map(p => ({ ...p, isMe: p.id === meId }));
  const me = people.find(p => p.isMe)!;
  const others = people.filter(p => !p.isMe);
  // Keep the original sender (was isMe: true in Supabase) at the top
  const origSenderId = table.people.find(p => p.isMe)?.id;
  if (origSenderId && origSenderId !== meId) {
    const si = others.findIndex(p => p.id === origSenderId);
    if (si > 0) others.unshift(...others.splice(si, 1));
  }
  return { ...table, people: [...others, me] };
}

// Pure local-only: mark personId as isMe (everyone else isMe:false).
// personId === null clears all isMe (seat not yet claimed).
function applyClaim(t: Table, personId: string | null): Table {
  return { ...t, people: t.people.map((p) => ({ ...p, isMe: personId != null && p.id === personId })) };
}

export function getClaimedSeat(tableId: string): string | null {
  return perspMap[tableId] ?? null;
}

export function newTable(profile?: Profile | null): Table {
  const oid = newId('p');
  return {
    id: newId('t'),
    name: 'New table',
    synced: syncEnabled,
    paidBy: null,
    paidAt: null,
    updatedAt: Date.now(),
    people: [
      { id: oid, name: '', photo: null, amount: null },
      { id: 'me', name: profile?.name ?? '', isMe: true, photo: null, profilePhoto: profile?.photo ?? null, amount: null },
    ],
  };
}

export function useTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const tablesRef = useRef<Table[]>([]);
  tablesRef.current = tables;
  // Session-level cache of each table's canonical creator person id.
  // Populated from raw backend data (before applyPersp flips isMe) so that
  // commit() can always restore the correct isMe before writing to Supabase.
  const canonicalCreatorRef = useRef<Record<string, string>>({});

  const cacheCanonicalCreator = (t: Table) => {
    if (canonicalCreatorRef.current[t.id]) return;
    const id = t.creatorPersonId ?? t.people.find(p => p.isMe)?.id;
    if (id) canonicalCreatorRef.current[t.id] = id;
  };

  const refresh = useCallback(async () => {
    const all = await backend.loadAll();
    all.forEach(cacheCanonicalCreator);
    setTables(all.map(applyPersp));
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refresh();
    return backend.subscribe(refresh);
  }, [refresh]);

  // Persist + optimistic local update.
  const commit = useCallback((table: Table) => {
    const stamped = { ...table, updatedAt: Date.now() };
    setTables((ts) => {
      const next = ts.filter((t) => t.id !== stamped.id);
      next.unshift(stamped);
      return next;
    });
    // isMe is per-device — restore the canonical (creator's) perspective before
    // writing to the shared backend so joiners never corrupt the creator's view.
    const creatorId = stamped.creatorPersonId ?? canonicalCreatorRef.current[stamped.id];
    const forBackend: Table = creatorId ? {
      ...stamped,
      people: stamped.people.map(p => ({ ...p, isMe: p.id === creatorId ? true : undefined })),
    } : stamped;
    void backend.upsert(forBackend);
    return stamped;
  }, []);

  const patch = useCallback((tableId: string, fn: (t: Table) => Table) => {
    const cur = tablesRef.current.find((t) => t.id === tableId);
    if (!cur) return;
    commit(fn(cur));
  }, [commit]);

  const createTable = useCallback((profile?: Profile | null) => {
    const t = newTable(profile);
    const myPerson = t.people.find(p => p.isMe);
    if (myPerson) {
      savePersp(t.id, myPerson.id);
      canonicalCreatorRef.current[t.id] = myPerson.id;
    }
    return commit({ ...t, creatorPersonId: myPerson?.id });
  }, [commit]);

  const setPaid = useCallback((tableId: string, personId: string) => {
    patch(tableId, (t) => ({ ...t, paidBy: personId, paidAt: nowISO() }));
  }, [patch]);

  const savePerson = useCallback((tableId: string, personId: string, upd: Partial<Person>) => {
    patch(tableId, (t) => ({
      ...t,
      people: t.people.map((p) => (p.id === personId ? { ...p, ...upd } : p)),
    }));
  }, [patch]);

  const addPerson = useCallback((tableId: string) => {
    patch(tableId, (t) => {
      if (t.people.length >= 4) return t;
      const me = t.people.find((p) => p.isMe)!;
      const others = t.people.filter((p) => !p.isMe);
      return { ...t, people: [...others, { id: newId('p'), name: '', photo: null, amount: null }, me] };
    });
  }, [patch]);

  // Join a table shared via invite link, then surface it.
  // Flip isMe so the receiver sees the sender at top and themselves at bottom.
  const joinByInvite = useCallback(async (tableId: string): Promise<Table | null> => {
    const t = await backend.join(tableId);
    if (!t) return null;
    // Cache the canonical creator from the raw backend record (before any perspective flip).
    cacheCanonicalCreator(t);
    const senderMe = t.people.find(p => p.isMe);
    const others = t.people.filter(p => !p.isMe);

    // Only one open seat → unambiguous, claim it automatically.
    if (others.length <= 1) {
      const receiver = others[0];
      const flipped: Table = {
        ...t,
        people: [
          ...(senderMe ? [{ ...senderMe, isMe: false }] : []),
          ...(receiver ? [{ ...receiver, isMe: true }] : []),
        ],
      };
      // Persist perspective so every future refresh() keeps the correct order
      if (receiver) savePersp(tableId, receiver.id);
      setTables((ts) => (ts.some((x) => x.id === t.id) ? ts : [flipped, ...ts]));
      return flipped;
    }

    // 3+ seats → ambiguous. Apply any previously stored claim; otherwise keep
    // the original isMe (sender) so ClaimSeat can filter candidates correctly.
    const claimedId = getClaimedSeat(t.id);
    const applied = claimedId ? applyClaim(t, claimedId) : t;
    setTables((ts) => (ts.some((x) => x.id === t.id) ? ts.map((x) => x.id === t.id ? applied : x) : [applied, ...ts]));
    return applied;
  }, []);

  const claimSeat = useCallback((tableId: string, personId: string) => {
    savePersp(tableId, personId);
    setTables((ts) => ts.map((t) => (t.id === tableId ? applyPersp(t) : t)));
  }, []);

  const deleteTable = useCallback((tableId: string) => {
    setTables((ts) => ts.filter((t) => t.id !== tableId));
    void backend.delete(tableId);
  }, []);

  const removePerson = useCallback((tableId: string, personId: string) => {
    patch(tableId, (t) => ({ ...t, people: t.people.filter((p) => p.id !== personId) }));
  }, [patch]);

  return { tables, loading, syncEnabled, refresh, createTable, setPaid, savePerson, addPerson, joinByInvite, claimSeat, deleteTable, removePerson };
}
