export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  image: string,
  commission: number;
  phone: string;
  company_id?: string;
  role?: 'admin' | 'manager' | 'biker';
  worker?: boolean;
}
