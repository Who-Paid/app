export interface Profile {
  name: string;
  photo: string | null;
}

export interface Payment {
  id: string;
  amount: number;
  addedAt?: string; // ISO string
}

export interface Person {
  id: string;
  name: string;
  isMe?: boolean;
  photo: string | null;        // explicitly set per-table contact photo (EditSheet)
  profilePhoto?: string | null; // synced from the user's profile (Profile screen)
  amount: number | null;
  payments?: Payment[];
}

export interface Table {
  id: string;
  name: string;
  synced: boolean;
  paidBy: string | null;
  paidAt: string | null;
  people: Person[];
  /** ms timestamp of last edit — used to resolve realtime conflicts */
  updatedAt?: number;
  /** Person id of the table creator — immutable, used to restore canonical isMe before Supabase writes */
  creatorPersonId?: string;
}
