import type { Schedule } from "./schedule";

export interface newOrder {
  id: number;
  items: Schedule[];
  created_at: string;
}
