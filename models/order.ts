export interface Order {
  id: number;
  status: string;
  user_id: string;
  admin_id: string | null;
  subtotal: string;
  discount: string;
  total: string;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
}
