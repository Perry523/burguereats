// 🍅 Tomatiza - Sistema de Tipos TypeScript
// Tipos centralizados para toda a aplicação

import type { Component } from 'vue'

// ===== TIPOS BÁSICOS =====
export interface BaseEntity {
  id: number | string
  created_at?: string
  updated_at?: string
}

// ===== USUÁRIOS & AUTENTICAÇÃO =====
export interface User extends BaseEntity {
  name: string
  email: string
  avatar?: string
  role: UserRole
  active: boolean
  last_login?: string
  company_id?: number
}

export type UserRole = 'admin' | 'editor' | 'viewer' | 'attendant' | 'professional'

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface AuthResponse {
  user: User
  token: string
  expires_in: number
}

// ===== EMPRESA & CONFIGURAÇÕES =====
export interface Company extends BaseEntity {
  name: string
  email: string
  phone?: string
  website?: string
  logo?: string
  address?: Address
  settings: CompanySettings
}

export interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  country: string
}

export interface CompanySettings {
  isSchedulingEnabled: boolean
  isProductsEnabled: boolean
  timezone: string
  language: string
  currency: string
  theme: 'light' | 'dark' | 'auto'
  primaryColor: string
}

// ===== REDES SOCIAIS =====
export interface SocialAccount extends BaseEntity {
  platform: SocialPlatform
  account_id: string
  username: string
  display_name: string
  avatar?: string
  access_token: string
  refresh_token?: string
  expires_at?: string
  is_active: boolean
  company_id: number
}

export type SocialPlatform = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'

export interface SocialPost extends BaseEntity {
  title: string
  content: string
  media?: SocialMedia[]
  platform: SocialPlatform
  account_id: string
  status: PostStatus
  scheduled_at?: string
  published_at?: string
  post_id?: string
  metrics?: PostMetrics
  company_id: number
}

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled'

export interface SocialMedia {
  id: string
  type: MediaType
  url: string
  thumbnail?: string
  alt_text?: string
  size?: number
  dimensions?: {
    width: number
    height: number
  }
}

export type MediaType = 'image' | 'video' | 'carousel' | 'story' | 'reel'

export interface PostMetrics {
  likes: number
  comments: number
  shares: number
  views: number
  reach: number
  engagement_rate: number
  clicks?: number
}

// ===== CALENDÁRIO & AGENDAMENTO =====
export interface CalendarEvent extends BaseEntity {
  title: string
  description?: string
  start_date: string
  end_date: string
  all_day: boolean
  type: EventType
  status: EventStatus
  attendees?: EventAttendee[]
  location?: string
  company_id: number
}

export type EventType = 'appointment' | 'meeting' | 'reminder' | 'social_post' | 'other'
export type EventStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed'

export interface EventAttendee {
  id: number
  name: string
  email: string
  phone?: string
  status: 'confirmed' | 'pending' | 'declined'
}

// ===== CLIENTES =====
export interface Customer extends BaseEntity {
  name: string
  email?: string
  phone?: string
  document?: string
  birth_date?: string
  address?: Address
  notes?: string
  tags?: string[]
  status: CustomerStatus
  company_id: number
}

export type CustomerStatus = 'active' | 'inactive' | 'prospect' | 'blocked'

// ===== PRODUTOS & ESTOQUE =====
export interface Product extends BaseEntity {
  name: string
  description?: string
  sku: string
  price: number
  cost?: number
  category_id?: number
  brand?: string
  images?: string[]
  status: ProductStatus
  stock_quantity: number
  min_stock?: number
  max_stock?: number
  company_id: number
}

export type ProductStatus = 'active' | 'inactive' | 'out_of_stock' | 'discontinued'

export interface ProductCategory extends BaseEntity {
  name: string
  description?: string
  parent_id?: number
  company_id: number
}

export interface StockMovement extends BaseEntity {
  product_id: number
  type: StockMovementType
  quantity: number
  reason: string
  reference?: string
  cost?: number
  user_id: number
  company_id: number
}

export type StockMovementType = 'in' | 'out' | 'adjustment' | 'transfer'

// ===== FINANÇAS =====
export interface Transaction extends BaseEntity {
  description: string
  amount: number
  type: TransactionType
  category_id?: number
  account_id?: number
  date: string
  due_date?: string
  status: TransactionStatus
  tags?: string[]
  attachments?: string[]
  company_id: number
}

export type TransactionType = 'income' | 'expense' | 'transfer'
export type TransactionStatus = 'pending' | 'paid' | 'overdue' | 'cancelled'

export interface FinancialCategory extends BaseEntity {
  name: string
  type: TransactionType
  color?: string
  company_id: number
}

// ===== ANALYTICS & RELATÓRIOS =====
export interface AnalyticsData {
  period: DateRange
  social_metrics: SocialMetrics
  financial_metrics: FinancialMetrics
  customer_metrics: CustomerMetrics
  product_metrics?: ProductMetrics
}

export interface DateRange {
  start_date: string
  end_date: string
}

export interface SocialMetrics {
  total_posts: number
  total_engagement: number
  total_reach: number
  total_followers: number
  engagement_rate: number
  top_posts: SocialPost[]
  platform_breakdown: Record<SocialPlatform, PostMetrics>
}

export interface FinancialMetrics {
  total_income: number
  total_expenses: number
  net_profit: number
  pending_receivables: number
  pending_payables: number
  cash_flow: CashFlowItem[]
}

export interface CashFlowItem {
  date: string
  income: number
  expenses: number
  balance: number
}

export interface CustomerMetrics {
  total_customers: number
  new_customers: number
  active_customers: number
  customer_retention_rate: number
}

export interface ProductMetrics {
  total_products: number
  low_stock_products: number
  top_selling_products: Product[]
  total_stock_value: number
}

// ===== NOTIFICAÇÕES =====
export interface Notification extends BaseEntity {
  title: string
  message: string
  type: NotificationType
  read: boolean
  action_url?: string
  user_id: number
  company_id: number
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'social' | 'financial'

// ===== CONFIGURAÇÕES DO SISTEMA =====
export interface SystemSettings {
  app_name: string
  app_version: string
  maintenance_mode: boolean
  features: FeatureFlags
}

export interface FeatureFlags {
  social_media: boolean
  scheduling: boolean
  products: boolean
  analytics: boolean
  notifications: boolean
  multi_company: boolean
}

// ===== FORMULÁRIOS & UI =====
export interface FormField {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: SelectOption[]
  validation?: ValidationRule[]
}

export type FieldType = 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern'
  value?: string | number
  message: string
}

// ===== COMPONENTES =====
export interface MenuItem {
  to?: string
  label: string
  icon?: Component
  items?: MenuItem[]
  ref?: string
  badge?: string | number
  disabled?: boolean
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  formatter?: (value: any) => string
}

export interface PaginationData {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

// ===== API RESPONSES =====
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
  meta?: PaginationData
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status: number
}

// ===== UTILITÁRIOS =====
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// ===== EXPORTS PARA COMPATIBILIDADE =====
export type Routes = MenuItem
export type ScheduledPost = SocialPost
export type ContentIdea = {
  id: number
  title: string
  description: string
  category: string
  icon: Component
}
export type PostData = Partial<SocialPost>
export type CalendarDay = {
  date: string
  day: number
  isCurrentMonth?: boolean
  isToday?: boolean
  dayName?: string
}
