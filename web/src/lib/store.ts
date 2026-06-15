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

export interface Backend {
  /** Load every table visible to this device. */
  loadAll(): Promise<Table[]>;
  /** Create or update a table. */
  upsert(table: Table): Promise<void>;
  /** Add this device to a table's members (used when opening an invite link). */
  join(tableId: string): Promise<Table | null>;
  /** Subscribe to remote changes; returns an unsubscribe fn. */
  subscribe(onChange: () => void): () => void;
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
  subscribe(onChange) {
    const handler = (e: StorageEvent) => {
      if (e.key === LS_TABLES) onChange();
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  },
};

/* -------------------------- supabase ------------------------------ */
const supabaseBackend: Backend = {
  async loadAll() {
    const { data, error } = await supabase!
      .from('tables')
      .select('data, members, updated_at')
      .contains('members', [deviceId()]);
    if (error) {
      console.warn('[store] loadAll failed, is the schema applied?', error.message);
      return [];
    }
    return sortTables((data ?? []).map((r) => r.data as Table));
  },
  async upsert(table) {
    const me = deviceId();
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
    const me = deviceId();
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
  subscribe(onChange) {
    const channel = supabase!
      .channel('tables-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tables' }, () => onChange())
      .subscribe();
    return () => {
      supabase!.removeChannel(channel);
    };
  },
};

export const backend: Backend = syncEnabled ? supabaseBackend : localBackend;
export { syncEnabled };
