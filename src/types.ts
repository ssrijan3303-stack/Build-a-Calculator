export type UserRole = 'super_admin' | 'admin' | 'staff' | 'customer';

export type ProjectStatus =
  | 'inquiry'
  | 'enquiry'
  | 'discussion'
  | 'planning'
  | 'design'
  | 'development'
  | 'testing'
  | 'waiting_for_client'
  | 'completed'
  | 'maintenance'
  | 'quotation'
  | 'advance_pending'
  | 'in_progress'
  | 'review'
  | 'cancelled';

export type MilestoneItem = {
  id: string;
  project_id?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
};

export interface TimeEntry {
  id: string;
  project_id: string;
  project_name: string;
  customer_email?: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  duration_minutes: number;
  description: string;
  entry_type: 'manual'; // Clearly treated as manual entry as requested
  logged_by: string;
  created_at: string;
}

export type PaymentStatus =
  | 'created'
  | 'pending'
  | 'pending_verification'
  | 'processing'
  | 'paid'
  | 'verified'
  | 'failed'
  | 'rejected'
  | 'cancelled'
  | 'refunded';

export type InvoiceStatus = 'draft' | 'issued' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';

export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  whatsapp?: string;
  company_name?: string;
  address?: string;
  city: string;
  state: string;
  country: string;
  avatar_url?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  profile_id?: string;
  full_name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  company_name?: string;
  address?: string;
  city?: string;
  state?: string;
  notes?: string;
  status?: 'active' | 'inactive' | 'lead' | 'suspended';
  total_spent: number;
  created_at: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  detailed_description?: string;
  icon: string;
  image_url?: string;
  base_price: number;
  features: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  slug: string;
  service_id?: string;
  price_type: 'fixed' | 'starting' | 'custom_quote';
  price: number;
  advance_percentage: number;
  badge?: string;
  short_description: string;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  customer_id?: string;
  profile_id?: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  detailed_case_study?: string;
  thumbnail_url: string;
  gallery_urls?: string[];
  technologies: string[];
  features: string[];
  demo_url?: string;
  github_url?: string;
  is_demo: boolean;
  is_featured?: boolean;
  display_order?: number;
  status: ProjectStatus;
  estimated_cost: number;
  paid_amount: number;
  start_date?: string;
  target_delivery_date?: string;
  expected_completion?: string;
  progress_percentage?: number;
  milestones?: MilestoneItem[];
  work_summary?: string;
  customer_email?: string;
  customer_name?: string;
  notes?: string;
  project_type?: string;
  last_updated?: string;
  updated_at?: string;
  created_at: string;
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status_change?: ProjectStatus;
  created_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
  created_at: string;
}

export interface Enquiry {
  id: string;
  enquiry_number: string;
  full_name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  service_id?: string;
  service_name?: string;
  budget_range?: string;
  project_description: string;
  preferred_contact_method: 'whatsapp' | 'email' | 'phone';
  preferred_time?: string;
  attachment_url?: string;
  status: 'new' | 'reviewed' | 'contacted' | 'converted' | 'archived';
  admin_notes?: string;
  created_at: string;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id?: string;
  profile_id?: string;
  project_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address?: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  advance_paid: number;
  total_amount: number;
  remaining_balance: number;
  status: InvoiceStatus;
  service_name: string;
  notes?: string;
  items: InvoiceItem[];
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  invoice_id?: string;
  customer_id?: string;
  profile_id?: string;
  project_id?: string;
  project_name?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  amount: number;
  currency: string;
  payment_type: 'advance' | 'full' | 'milestone' | 'invoice';
  payment_method: 'upi' | 'bank_transfer' | 'cash' | 'cheque' | 'gateway_card' | 'netbanking' | 'manual';
  upi_id: string;
  transaction_reference?: string;
  gateway_payment_id?: string;
  screenshot_url?: string;
  rejection_reason?: string;
  status: PaymentStatus;
  notes?: string;
  paid_at?: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role: string;
  company_name: string;
  project_title?: string;
  rating: number;
  feedback: string;
  avatar_url?: string;
  is_demo: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author_name: string;
  category: string;
  tags: string[];
  read_time_minutes: number;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export interface Faq {
  id: string;
  category: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface SupportMessage {
  id: string;
  ticket_number: string;
  profile_id?: string;
  customer_email: string;
  customer_name: string;
  subject: string;
  message: string;
  status: TicketStatus;
  admin_reply?: string;
  replied_at?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  profile_id?: string;
  customer_email?: string;
  title: string;
  message: string;
  link_url?: string;
  type:
    | 'info'
    | 'success'
    | 'warning'
    | 'payment'
    | 'project_status'
    | 'milestone'
    | 'invoice'
    | 'payment_status'
    | 'payment_due';
  is_read: boolean;
  created_at: string;
}

export interface WebsiteSettings {
  company_name: string;
  tagline: string;
  founder_name: string;
  founder_role: string;
  founder_bio: string;
  founder_photo_url: string;
  founder_photo_updated_at?: string;
  storage_engine?: string;
  vision: string;
  mission: string;
  phone: string;
  whatsapp: string;
  email: string;
  upi_id: string;
  upi_qr_url: string;
  location: string;
  city: string;
  state: string;
  country: string;
  social_links: {
    platform: string;
    url: string;
    is_active: boolean;
  }[];
  seo_title: string;
  seo_description: string;
  meta_keywords: string;
  payment_gateway_provider: string;
  payment_gateway_key: string;
  payment_gateway_configured: boolean;
  whatsapp_configured: boolean;
  email_configured: boolean;
}

export interface AuditLog {
  id: string;
  user_email: string;
  action: string;
  entity: string;
  entity_id: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// Aliases for comprehensive cross-module compatibility
export type ProjectEnquiry = Enquiry;
export type PaymentTransaction = Payment & {
  transaction_number?: string;
  transaction_note?: string;
  utr_number?: string;
  screenshot_url?: string;
};
export type SupportTicket = SupportMessage & {
  customer_phone?: string;
  priority?: 'low' | 'medium' | 'high';
  admin_response?: string;
};
