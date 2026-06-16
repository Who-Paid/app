export interface Payment {
  id: string;
  amount: number;
}

export interface Person {
  id: string;
  name: string;
  isMe?: boolean;
  photo: string | null;
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
}
