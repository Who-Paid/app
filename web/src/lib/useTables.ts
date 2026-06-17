import { useCallback, useEffect, useRef, useState } from 'react';
import type { Person, Profile, Table } from './types';
import { backend, syncEnabled } from './store';
import { nowISO } from './util';

let uid = 0;
const newId = (p: string) => `${p}${Date.now().toString(36)}${(uid++).toString(36)}`;

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
      { id: 'me', name: 'Me', isMe: true, photo: null, profilePhoto: profile?.photo ?? null, amount: null },
    ],
  };
}

export function useTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const tablesRef = useRef<Table[]>([]);
  tablesRef.current = tables;

  const refresh = useCallback(async () => {
    const all = await backend.loadAll();
    setTables(all);
    setLoading(false);
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
    void backend.upsert(stamped);
    return stamped;
  }, []);

  const patch = useCallback((tableId: string, fn: (t: Table) => Table) => {
    const cur = tablesRef.current.find((t) => t.id === tableId);
    if (!cur) return;
    commit(fn(cur));
  }, [commit]);

  const createTable = useCallback((profile?: Profile | null) => {
    const t = newTable(profile);
    return commit(t);
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
  const joinByInvite = useCallback(async (tableId: string): Promise<Table | null> => {
    const t = await backend.join(tableId);
    if (t) {
      setTables((ts) => (ts.some((x) => x.id === t.id) ? ts : [t, ...ts]));
    }
    return t;
  }, []);

  const deleteTable = useCallback((tableId: string) => {
    setTables((ts) => ts.filter((t) => t.id !== tableId));
    void backend.delete(tableId);
  }, []);

  const removePerson = useCallback((tableId: string, personId: string) => {
    patch(tableId, (t) => ({ ...t, people: t.people.filter((p) => p.id !== personId) }));
  }, [patch]);

  return { tables, loading, syncEnabled, refresh, createTable, setPaid, savePerson, addPerson, joinByInvite, deleteTable, removePerson };
}
