export interface Finance {
  id?: number;
  name: string;
  value: number;
  isExpense: boolean;
  initialDate: string;
  recurrent: boolean;
  recurrentFinalDate?: string;
  infiniteRecurrency?: boolean;
}
export interface Date {
  month: number;
  year: number;
}

export interface Row {
  id: number;
  [key: string]: unknown;
}
export interface User {
  id: string;
  name: string;
  email: string;
  profile_photo_url: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  image: string;
  worker?: boolean;
}
export interface Cash {
  id: string;
  name: string;
  quantity: number;
  price: string;
  created_at: string;
  updated_at: string;
}
export interface Finance {
  id?: number;
  name: string;
  value: number;
  isExpense: boolean;
  initialDate: string;
  recurrent: boolean;
  recurrentFinalDate?: string;
  infiniteRecurrency?: boolean;
}
export interface Date {
  month: number;
  year: number;
}
export interface Event {
  id: string;
  title: string;
  name: string;
  service: Service;
  start_date: string;
  end_date: string;
  updated_at: string;
  service_id?: number;
  user_id?: number;
  professional_id?: number;
  company_user_id?: number;
  client_name?: string;
  status?: string;
}
export interface Company {
  name: string;
  logo: string;
  banner: string;
  whatsapp: string;
  instagram: string;
  sunday_time: string;
  monday_time: string;
  tuesday_time: string;
  thursday_time: string;
  wednesday_time: string;
  friday_time: string;
  saturday_time: string;
  buttons_color: string;
  background_color: string;
  cards_color: string;
  slug: string;
  sunday_pause: string;
  monday_pause: string;
  tuesday_pause: string;
  thursday_pause: string;
  wednesday_pause: string;
  friday_pause: string;
  saturday_pause: string;
  description: string;
}
export interface Product {
  id?: number;
  name: string;
  base_price: number;
  quantity: number;
  description?: string;
  variants?: Variant[];
  hasVariants?: boolean;
  price?: number;
}
export interface Variant {
  id?: number;
  number?: string;
  name: string;
  additional_price: number;
  base_price: number;
  quantity: number;
  is_active: boolean;
  price?: number;
}
export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: number;
  created_at: string;
  updated_at: string;
}
export interface Order {
  id?: number;
  status: string;
  user_id: string;
  chat_id?: string;
  admin_id: null | string;
  subtotal: string;
  discount: string;
  total: string;
  finished_at: null | string;
  created_at: string;
  items: ItemOrder[];
}

export interface ItemOrder {
  id: number;
  order_id: number;
  product_name: string;
  product_id: string;
  product_quantity: number;
  product_price: number;
  product_type: string;
  quantity: number;
  discount: string;
  total: string;
  created_at: string;
  updated_at: string;
  status: string;
  user_name: string;
}
export interface Chat {
  id: string;
  admin_name?: string;
  admin_image?: string;
  user_name: string;
  user_image?: string;
  chatId?: string;
  newMessage?: NewMessage;
  status?: string;
  order?: string;
}
export interface Message {
  message: string;
  chatId: string;
  type: string;
  from: string;
  to: string;
  created_at: string;
}
export interface NewMessage {
  message: string;
  created_at: string;
}
export interface ChatItem {
  id: string;
  admin_name: string;
  user_name: string;
  newMessage?: NewMessage;
  isTyping?: boolean;
}
export interface NewMessage {
  message: string;
  created_at: string;
}

export interface Professional {
  name: string;
  id: string;
  image: string;
  role: string;
  commission: number;
  created_at: string;
  updated_at: string;
  email: string;
  phone: string;
}
export interface Schedule {
  service: Service;
  professional: Professional;
  hour: string;
}

export interface newOrder {
  id: number;
  items: Schedule[];
  created_at: string;
}
