import type { Table } from './types';
import { supabase, syncEnabled } from './supabase';

/* ------------------------------------------------------------------ *
 * Store: a tiny data layer with two interchangeable backends.
 *  - localStorage  → works instantly, offline, single device (default)
 *  - Supabase      → real cross-device sync + invite links + realtime
 * The app code is identical either way; only the backend differs.
 * ------------------------------------------------------------------ */

const LS_TABLES = 'who-paid:tables:v1';
const LS_DEVICE = 'who-paid:device-id';

export function deviceId(): string {
  let id = localStorage.getItem(LS_DEVICE);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(LS_DEVICE, id);
  }
  return id;
}

let _authUserId: string | null = null;

/** Set the authenticated user's id. Pass null on sign-out. */
export function setAuthUserId(id: string | null): void {
  _authUserId = id;
}

/** The member identifier for this session: real user id when signed in, device id otherwise. */
export function getMemberId(): string {
  return _authUserId ?? deviceId();
}

export interface Backend {
  /** Load every table visible to this device. */
  loadAll(): Promise<Table[]>;
  /** Create or update a table. */
  upsert(table: Table): Promise<void>;
  /** Add this device to a table's members (used when opening an invite link). */
  join(tableId: string): Promise<Table | null>;
  /** Remove this device from a table; deletes the row if no members remain. */
  delete(tableId: string): Promise<void>;
  /** Subscribe to remote changes; returns an unsubscribe fn. */
  subscribe(onChange: () => void): () => void;
  /** Add userId to the members list of every table this device owns (called once on sign-in). */
  migrate(userId: string): Promise<void>;
}

const sortTables = (ts: Table[]) =>
  [...ts].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));

/* ---------------------------- local ------------------------------- */
const localBackend: Backend = {
  async loadAll() {
    try {
      const raw = localStorage.getItem(LS_TABLES);
      return raw ? sortTables(JSON.parse(raw) as Table[]) : [];
    } catch {
      return [];
    }
  },
  async upsert(table) {
    const all = await this.loadAll();
    const next = all.filter((t) => t.id !== table.id);
    next.unshift(table);
    localStorage.setItem(LS_TABLES, JSON.stringify(next));
  },
  async join(tableId) {
    const all = await this.loadAll();
    return all.find((t) => t.id === tableId) ?? null;
  },
  async delete(tableId) {
    const all = await this.loadAll();
    localStorage.setItem(LS_TABLES, JSON.stringify(all.filter((t) => t.id !== tableId)));
  },
  subscribe(onChange) {
    const handler = (e: StorageEvent) => {
      if (e.key === LS_TABLES) onChange();
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  },
  async migrate() {
    // No-op: local backend has no remote members list to update.
  },
};

/* -------------------------- supabase ------------------------------ */
const supabaseBackend: Backend = {
  async loadAll() {
    const { data, error } = await supabase!
      .from('tables')
      .select('data, members, updated_at')
      .contains('members', [getMemberId()]);
    if (error) {
      console.warn('[store] loadAll failed, is the schema applied?', error.message);
      return [];
    }
    return sortTables((data ?? []).map((r) => r.data as Table));
  },
  async upsert(table) {
    const me = getMemberId();
    // Read current members so we never drop a collaborator on write.
    const { data: existing } = await supabase!
      .from('tables')
      .select('members')
      .eq('id', table.id)
      .maybeSingle();
    const members: string[] = existing?.members ?? [];
    if (!members.includes(me)) members.push(me);
    const { error } = await supabase!.from('tables').upsert({
      id: table.id,
      data: table,
      members,
      updated_at: new Date(table.updatedAt ?? Date.now()).toISOString(),
    });
    if (error) console.warn('[store] upsert failed', error.message);
  },
  async join(tableId) {
    const me = getMemberId();
    const { data } = await supabase!
      .from('tables')
      .select('data, members')
      .eq('id', tableId)
      .maybeSingle();
    if (!data) return null;
    const members: string[] = data.members ?? [];
    if (!members.includes(me)) {
      members.push(me);
      await supabase!.from('tables').update({ members }).eq('id', tableId);
    }
    return data.data as Table;
  },
  async delete(tableId) {
    const me = getMemberId();
    const { data } = await supabase!
      .from('tables')
      .select('members')
      .eq('id', tableId)
      .maybeSingle();
    if (!data) return;
    const remaining = (data.members as string[]).filter((m) => m !== me);
    if (remaining.length === 0) {
      await supabase!.from('tables').delete().eq('id', tableId);
    } else {
      await supabase!.from('tables').update({ members: remaining }).eq('id', tableId);
    }
  },
  subscribe(onChange) {
    const channel = supabase!
      .channel('tables-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tables' }, () => onChange())
      .subscribe();
    return () => {
      void supabase!.removeChannel(channel);
    };
  },
  async migrate(userId: string) {
    const did = deviceId();
    if (did === userId) return;
    // Find every table this device owns and add the real user id to members.
    const { data } = await supabase!
      .from('tables')
      .select('id, members')
      .contains('members', [did]);
    if (!data) return;
    for (const row of data) {
      const members: string[] = row.members ?? [];
      if (!members.includes(userId)) {
        members.push(userId);
        await supabase!.from('tables').update({ members }).eq('id', row.id);
      }
    }
  },
};

export const backend: Backend = syncEnabled ? supabaseBackend : localBackend;
export { syncEnabled };
