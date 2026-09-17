import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Service,
  Project,
  PricingPlan,
  Enquiry,
  Invoice,
  Payment,
  Testimonial,
  BlogPost,
  Faq,
  SupportMessage,
  NotificationItem,
  WebsiteSettings,
  AuditLog,
  Customer,
  TimeEntry,
} from '../types';
import {
  defaultServices,
  defaultProjects,
  defaultPricingPlans,
  defaultTestimonials,
  defaultFaqs,
  defaultBlogPosts,
  initialSettings,
} from '../data/defaultData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Local fallback state store to ensure the application works 100% reliably out of the box
const STORAGE_KEY = 'srijantech_db_v2';

interface DBState {
  services: Service[];
  projects: Project[];
  pricing: PricingPlan[];
  enquiries: Enquiry[];
  invoices: Invoice[];
  payments: Payment[];
  testimonials: Testimonial[];
  faqs: Faq[];
  blog: BlogPost[];
  settings: WebsiteSettings;
  support: SupportMessage[];
  notifications: NotificationItem[];
  customers: Customer[];
  auditLogs: AuditLog[];
  timeEntries: TimeEntry[];
}

const adityaProject: Project = {
  id: 'prj-client-101',
  title: 'Mall Billing Software & Web Suite',
  slug: 'mall-billing-pos-suite',
  category: 'Full-Stack Web App',
  project_type: 'Full-Stack Web App',
  customer_email: 'aditya@vermalogistics.in',
  customer_id: 'cust-1',
  description:
    'Enterprise retail point-of-sale billing suite with thermal printer ESC/POS driver and instant Indian UPI QR reconciliation.',
  detailed_case_study:
    'Custom-developed for Verma Logistics & Retail in Godowlia, Varanasi. Integrates multi-terminal cash registers with unified inventory syncing.',
  thumbnail_url: '/assets/projects/ecommerce.webp',
  technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Node.js', 'UPI API'],
  features: [
    'Sub-Second Barcode Scanning & Billing',
    'Dynamic UPI QR Code Generator with Soundbox Alert',
    'Thermal 3-Inch ESC/POS Bill Printing',
    'GST Return CSV Auto-Export',
  ],
  demo_url: '#demo-ecommerce',
  is_demo: false,
  status: 'development',
  progress_percentage: 65,
  start_date: '2025-01-04',
  expected_completion: '2025-02-20',
  last_updated: '2025-01-10T14:00:00Z',
  estimated_cost: 53100,
  paid_amount: 25000,
  milestones: [
    {
      id: 'm1',
      title: '1. Architecture & Barcode Schema',
      status: 'completed',
      due_date: '2025-01-08',
      completed_at: '2025-01-08',
    },
    {
      id: 'm2',
      title: '2. POS Cashier Interface & UPI QR',
      status: 'completed',
      due_date: '2025-01-15',
      completed_at: '2025-01-14',
    },
    {
      id: 'm3',
      title: '3. Inventory Reconciler & GST Reports',
      status: 'in_progress',
      due_date: '2025-02-05',
    },
    {
      id: 'm4',
      title: '4. Hardware Staging & Final Handover',
      status: 'pending',
      due_date: '2025-02-20',
    },
  ],
  created_at: '2025-01-04T00:00:00Z',
};

function loadLocalState(): DBState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.timeEntries) parsed.timeEntries = [];
      if (!parsed.customers) parsed.customers = [];
      // Ensure all projects always have valid, updated thumbnail_url and demo links
      if (parsed.projects && parsed.projects.length > 0) {
        parsed.projects = defaultProjects.map((dp) => {
          const match = parsed.projects.find((p: Project) => p.id === dp.id || p.slug === dp.slug);
          return match
            ? { ...match, thumbnail_url: dp.thumbnail_url, demo_url: dp.demo_url, title: dp.title }
            : dp;
        });
      } else {
        parsed.projects = [...defaultProjects];
      }

      // Ensure adityaProject is present for client demonstration
      const hasAditya = parsed.projects.some(
        (p: Project) => p.customer_email === 'aditya@vermalogistics.in'
      );
      if (!hasAditya) {
        parsed.projects.push(adityaProject);
      }

      return parsed;
    }
  } catch {
    // ignore
  }
  return {
    services: defaultServices,
    projects: [...defaultProjects, adityaProject],
    pricing: defaultPricingPlans,
    enquiries: [
      {
        id: 'enq-1001',
        enquiry_number: 'ENQ-2025-1001',
        full_name: 'Dr. Anand Prakash',
        email: 'dr.anand@kashiclinic.in',
        phone: '9839012345',
        whatsapp: '9839012345',
        service_name: 'Web Application Development',
        budget_range: '₹30,000 - ₹50,000',
        project_description: 'Require a clinic patient appointment booking portal with SMS notifications.',
        preferred_contact_method: 'whatsapp',
        status: 'new',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ],
    invoices: [
      {
        id: 'inv-101',
        invoice_number: 'ST-INV-2025-001',
        customer_name: 'Aditya Verma',
        customer_email: 'aditya@vermalogistics.in',
        customer_phone: '9839112233',
        customer_address: 'Godowlia, Varanasi, UP - 221001',
        issue_date: '2025-01-05',
        due_date: '2025-01-19',
        subtotal: 45000,
        tax_rate: 18,
        tax_amount: 8100,
        discount_amount: 0,
        advance_paid: 25000,
        total_amount: 53100,
        remaining_balance: 28100,
        status: 'partially_paid',
        service_name: 'Mall Billing Software & Web Suite',
        notes: 'Advance received via UPI. Final delivery upon balance clearance.',
        items: [
          { description: 'Billing POS Module with Thermal Receipt Driver', quantity: 1, unit_price: 30000, amount: 30000 },
          { description: 'UPI Dynamic QR & Cashier Reconciler', quantity: 1, unit_price: 15000, amount: 15000 },
        ],
        created_at: '2025-01-05T10:00:00Z',
      },
    ],
    payments: [
      {
        id: 'pay-001',
        order_id: 'ORD-2025-901',
        invoice_id: 'inv-101',
        customer_name: 'Aditya Verma',
        customer_email: 'aditya@vermalogistics.in',
        customer_phone: '9839112233',
        amount: 25000,
        currency: 'INR',
        payment_type: 'advance',
        payment_method: 'upi',
        upi_id: '7269068483@ptyes',
        transaction_reference: 'UPI/20250105/982347102',
        status: 'paid',
        notes: 'Advance 50% project confirmation',
        paid_at: '2025-01-05T11:15:00Z',
        created_at: '2025-01-05T11:00:00Z',
      },
    ],
    testimonials: defaultTestimonials,
    faqs: defaultFaqs,
    blog: defaultBlogPosts,
    settings: initialSettings,
    support: [
      {
        id: 'sup-1',
        ticket_number: 'TICK-401',
        customer_name: 'Pooja Srivastava',
        customer_email: 'pooja@gyanacademy.in',
        subject: 'Student grade export question',
        message: 'Could we get the grade card in landscape PDF format?',
        status: 'resolved',
        admin_reply: 'Updated the PDF print stylesheet to landscape orientation.',
        replied_at: '2025-01-08T15:00:00Z',
        created_at: '2025-01-08T12:00:00Z',
      },
    ],
    notifications: [
      {
        id: 'notif-1',
        profile_id: 'demo-user',
        title: 'Project Milestone Achieved',
        message: 'E-Commerce Storefront concept demo has been completed.',
        type: 'success',
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ],
    customers: [
      {
        id: 'cust-1',
        full_name: 'Aditya Verma',
        email: 'aditya@vermalogistics.in',
        phone: '9839112233',
        whatsapp: '9839112233',
        company_name: 'Verma Logistics & Retail',
        total_spent: 25000,
        created_at: '2025-01-01T00:00:00Z',
      },
    ],
    auditLogs: [
      {
        id: 'log-1',
        user_email: 'srijan@srijantech.in',
        action: 'INITIALIZE',
        entity: 'SYSTEM',
        entity_id: 'system-init',
        metadata: { info: 'SrijanTech core platform initialized' },
        created_at: new Date().toISOString(),
      },
    ],
    timeEntries: [
      {
        id: 'time-101',
        project_id: 'prj-1',
        project_name: 'E-Commerce Website',
        customer_email: 'aditya@vermalogistics.in',
        date: '2025-01-04',
        start_time: '10:00',
        end_time: '14:30',
        duration_minutes: 270,
        description: 'Initial shopping cart architecture and UPI QR code generator integration.',
        entry_type: 'manual',
        logged_by: 'Srijan Singh (Admin)',
        created_at: '2025-01-04T15:00:00Z',
      },
      {
        id: 'time-102',
        project_id: 'prj-1',
        project_name: 'E-Commerce Website',
        customer_email: 'aditya@vermalogistics.in',
        date: '2025-01-05',
        start_time: '11:00',
        end_time: '16:00',
        duration_minutes: 300,
        description: 'Responsive catalog filters, image optimization, and Indian GST invoice PDF generation.',
        entry_type: 'manual',
        logged_by: 'Srijan Singh (Admin)',
        created_at: '2025-01-05T16:30:00Z',
      },
    ],
  };
}

let localState = loadLocalState();

function saveLocalState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localState));
  } catch {
    // ignore
  }
}

// ----------------- SERVICES -----------------
export async function getServices(): Promise<Service[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as Service[];
    } catch {
      // fallback
    }
  }
  return [...localState.services];
}

export async function saveService(service: Partial<Service> & { id?: string }): Promise<Service> {
  const isNew = !service.id;
  const newService: Service = {
    id: service.id || `srv-${Date.now()}`,
    slug: service.slug || (service.title ? service.title.toLowerCase().replace(/\s+/g, '-') : 'service'),
    title: service.title || 'Untitled Service',
    short_description: service.short_description || '',
    detailed_description: service.detailed_description || '',
    icon: service.icon || 'Code',
    base_price: Number(service.base_price) || 0,
    features: service.features || [],
    is_active: service.is_active ?? true,
    display_order: service.display_order ?? localState.services.length + 1,
    created_at: service.created_at || new Date().toISOString(),
  };

  if (isNew) {
    localState.services.push(newService);
  } else {
    const idx = localState.services.findIndex((s) => s.id === service.id);
    if (idx >= 0) localState.services[idx] = newService;
    else localState.services.push(newService);
  }
  saveLocalState();
  await logAuditAction('srijan@srijantech.in', isNew ? 'CREATE' : 'UPDATE', 'SERVICE', newService.id);
  return newService;
}

export async function deleteService(id: string): Promise<boolean> {
  localState.services = localState.services.filter((s) => s.id !== id);
  saveLocalState();
  await logAuditAction('srijan@srijantech.in', 'DELETE', 'SERVICE', id);
  return true;
}

// ----------------- PROJECTS -----------------
export async function getProjects(): Promise<Project[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Project[];
    } catch {
      // fallback
    }
  }
  return [...localState.projects];
}

export async function saveProject(project: Partial<Project> & { id?: string }): Promise<Project> {
  const isNew = !project.id;
  const existing = !isNew ? localState.projects.find((p) => p.id === project.id) : undefined;

  const newProj: Project = {
    id: project.id || `prj-${Date.now()}`,
    customer_id: project.customer_id ?? existing?.customer_id,
    customer_name: project.customer_name ?? existing?.customer_name,
    customer_email: (project.customer_email ?? existing?.customer_email ?? '').toLowerCase().trim() || undefined,
    profile_id: project.profile_id ?? existing?.profile_id,
    title: project.title || existing?.title || 'New Project',
    slug: project.slug || (project.title ? project.title.toLowerCase().replace(/\s+/g, '-') : existing?.slug || `proj-${Date.now()}`),
    category: project.category || existing?.category || 'Web Application',
    description: project.description ?? existing?.description ?? '',
    detailed_case_study: project.detailed_case_study ?? existing?.detailed_case_study ?? '',
    thumbnail_url: project.thumbnail_url ?? existing?.thumbnail_url ?? '',
    gallery_urls: project.gallery_urls ?? existing?.gallery_urls ?? [],
    technologies: project.technologies || existing?.technologies || ['React', 'TypeScript'],
    features: project.features || existing?.features || [],
    demo_url: project.demo_url ?? existing?.demo_url ?? '#',
    github_url: project.github_url ?? existing?.github_url,
    is_demo: project.is_demo ?? existing?.is_demo ?? false,
    is_featured: project.is_featured ?? existing?.is_featured ?? true,
    display_order: project.display_order ?? existing?.display_order,
    status: project.status || existing?.status || 'in_progress',
    estimated_cost: Number(project.estimated_cost !== undefined ? project.estimated_cost : existing?.estimated_cost) || 0,
    paid_amount: Number(project.paid_amount !== undefined ? project.paid_amount : existing?.paid_amount) || 0,
    start_date: project.start_date ?? existing?.start_date,
    target_delivery_date: project.target_delivery_date ?? existing?.target_delivery_date,
    expected_completion: project.expected_completion ?? existing?.expected_completion,
    progress_percentage: Number(project.progress_percentage !== undefined ? project.progress_percentage : existing?.progress_percentage) || 0,
    milestones: project.milestones ?? existing?.milestones ?? [],
    notes: project.notes ?? existing?.notes ?? '',
    work_summary: project.work_summary ?? existing?.work_summary ?? '',
    project_type: project.project_type ?? existing?.project_type,
    last_updated: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_at: project.created_at || existing?.created_at || new Date().toISOString(),
  };

  if (isNew) {
    localState.projects.unshift(newProj);
    if (newProj.customer_email) {
      createNotification({
        title: 'New Project Initialized',
        message: `Your project "${newProj.title}" has been registered in the system (Budget: ₹${newProj.estimated_cost.toLocaleString('en-IN')}).`,
        customer_email: newProj.customer_email,
        type: 'project_status',
      });
    }
  } else {
    const idx = localState.projects.findIndex((p) => p.id === project.id);
    if (idx >= 0) localState.projects[idx] = newProj;
    else localState.projects.unshift(newProj);

    if (newProj.customer_email && (existing?.status !== newProj.status || existing?.progress_percentage !== newProj.progress_percentage)) {
      createNotification({
        title: 'Project Status Updated',
        message: `"${newProj.title}" is now in "${String(newProj.status).replace(/_/g, ' ')}" phase with ${newProj.progress_percentage}% completed.`,
        customer_email: newProj.customer_email,
        type: 'project_status',
      });
    }
  }

  saveLocalState();
  await logAuditAction('srijan@srijantech.in', isNew ? 'CREATE' : 'UPDATE', 'PROJECT', newProj.id, {
    title: newProj.title,
    status: newProj.status,
    progress: newProj.progress_percentage,
    customer: newProj.customer_email,
  });
  return newProj;
}

export async function deleteProject(id: string): Promise<boolean> {
  localState.projects = localState.projects.filter((p) => p.id !== id);
  saveLocalState();
  await logAuditAction('srijan@srijantech.in', 'DELETE', 'PROJECT', id);
  return true;
}

// ----------------- PRICING -----------------
export async function getPricingPlans(): Promise<PricingPlan[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('pricing_plans').select('*').order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as PricingPlan[];
    } catch {
      // fallback
    }
  }
  return [...localState.pricing];
}

export async function savePricingPlan(plan: Partial<PricingPlan> & { id?: string }): Promise<PricingPlan> {
  const isNew = !plan.id;
  const newPlan: PricingPlan = {
    id: plan.id || `price-${Date.now()}`,
    name: plan.name || 'Custom Plan',
    slug: plan.slug || (plan.name ? plan.name.toLowerCase().replace(/\s+/g, '-') : `plan-${Date.now()}`),
    price_type: plan.price_type || 'starting',
    price: Number(plan.price) || 0,
    advance_percentage: Number(plan.advance_percentage) || 50,
    badge: plan.badge || '',
    short_description: plan.short_description || '',
    features: plan.features || [],
    is_popular: plan.is_popular ?? false,
    is_active: plan.is_active ?? true,
    display_order: plan.display_order ?? localState.pricing.length + 1,
    created_at: plan.created_at || new Date().toISOString(),
  };

  if (isNew) {
    localState.pricing.push(newPlan);
  } else {
    const idx = localState.pricing.findIndex((p) => p.id === plan.id);
    if (idx >= 0) localState.pricing[idx] = newPlan;
    else localState.pricing.push(newPlan);
  }
  saveLocalState();
  await logAuditAction('srijan@srijantech.in', isNew ? 'CREATE' : 'UPDATE', 'PRICING', newPlan.id);
  return newPlan;
}

export async function deletePricingPlan(id: string): Promise<boolean> {
  localState.pricing = localState.pricing.filter((p) => p.id !== id);
  saveLocalState();
  await logAuditAction('srijan@srijantech.in', 'DELETE', 'PRICING', id);
  return true;
}

// ----------------- ENQUIRIES -----------------
export async function getEnquiries(): Promise<Enquiry[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Enquiry[];
    } catch {
      // fallback
    }
  }
  return [...localState.enquiries];
}

export async function createEnquiry(enquiry: Omit<Enquiry, 'id' | 'enquiry_number' | 'created_at' | 'status'>): Promise<Enquiry> {
  const enquiry_number = `ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newEnq: Enquiry = {
    ...enquiry,
    id: `enq-${Date.now()}`,
    enquiry_number,
    status: 'new',
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('enquiries').insert([newEnq]);
    } catch {
      // fallback
    }
  }

  localState.enquiries.unshift(newEnq);
  saveLocalState();
  await logAuditAction('public', 'CREATE', 'ENQUIRY', newEnq.id, { number: enquiry_number });
  return newEnq;
}

export async function updateEnquiryStatus(id: string, status: Enquiry['status'], admin_notes?: string): Promise<boolean> {
  const item = localState.enquiries.find((e) => e.id === id);
  if (item) {
    item.status = status;
    if (admin_notes !== undefined) item.admin_notes = admin_notes;
    saveLocalState();
    await logAuditAction('admin', 'UPDATE_STATUS', 'ENQUIRY', id, { status });
    return true;
  }
  return false;
}

// ----------------- INVOICES -----------------
export async function getInvoices(): Promise<Invoice[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Invoice[];
    } catch {
      // fallback
    }
  }
  return [...localState.invoices];
}

export async function saveInvoice(invoice: Partial<Invoice> & { id?: string }): Promise<Invoice> {
  const isNew = !invoice.id;
  const invoice_number = invoice.invoice_number || `ST-INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  
  const subtotal = Number(invoice.subtotal) || 0;
  const tax_rate = Number(invoice.tax_rate) || 18;
  const tax_amount = (subtotal * tax_rate) / 100;
  const total_amount = subtotal + tax_amount - (Number(invoice.discount_amount) || 0);
  const advance_paid = Number(invoice.advance_paid) || 0;
  const remaining_balance = Math.max(0, total_amount - advance_paid);

  const newInv: Invoice = {
    id: invoice.id || `inv-${Date.now()}`,
    invoice_number,
    customer_name: invoice.customer_name || 'Customer',
    customer_email: invoice.customer_email || '',
    customer_phone: invoice.customer_phone || '',
    customer_address: invoice.customer_address || 'Varanasi, UP',
    issue_date: invoice.issue_date || new Date().toISOString().split('T')[0],
    due_date: invoice.due_date || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    subtotal,
    tax_rate,
    tax_amount,
    discount_amount: Number(invoice.discount_amount) || 0,
    advance_paid,
    total_amount,
    remaining_balance,
    status: invoice.status || (remaining_balance <= 0 ? 'paid' : advance_paid > 0 ? 'partially_paid' : 'issued'),
    service_name: invoice.service_name || 'Web Engineering Services',
    notes: invoice.notes || 'UPI: 7269068483@ptyes | SrijanTech Varanasi',
    items: invoice.items || [{ description: invoice.service_name || 'Development Services', quantity: 1, unit_price: subtotal, amount: subtotal }],
    created_at: invoice.created_at || new Date().toISOString(),
  };

  if (isNew) {
    localState.invoices.unshift(newInv);
    if (newInv.customer_email) {
      createNotification({
        title: 'Tax Invoice Issued',
        message: `Tax Invoice ${newInv.invoice_number} for ${newInv.service_name} (₹${newInv.total_amount.toLocaleString('en-IN')}) has been generated.`,
        customer_email: newInv.customer_email,
        type: 'invoice',
      });
    }
  } else {
    const idx = localState.invoices.findIndex((i) => i.id === invoice.id);
    if (idx >= 0) localState.invoices[idx] = newInv;
    else localState.invoices.unshift(newInv);
  }
  saveLocalState();
  await logAuditAction('admin', isNew ? 'CREATE' : 'UPDATE', 'INVOICE', newInv.id, { number: invoice_number });
  return newInv;
}

export async function deleteInvoice(id: string): Promise<boolean> {
  localState.invoices = localState.invoices.filter((i) => i.id !== id);
  saveLocalState();
  await logAuditAction('admin', 'DELETE', 'INVOICE', id);
  return true;
}

// ----------------- PAYMENTS -----------------
export async function getPayments(): Promise<Payment[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Payment[];
    } catch {
      // fallback
    }
  }
  return [...localState.payments];
}

export async function createPayment(payment: Partial<Payment>): Promise<Payment> {
  const order_id = payment.order_id || `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newPay: Payment = {
    id: `pay-${Date.now()}`,
    order_id,
    invoice_id: payment.invoice_id,
    customer_name: payment.customer_name || 'Client',
    customer_email: payment.customer_email || '',
    customer_phone: payment.customer_phone || '',
    amount: Number(payment.amount) || 0,
    currency: 'INR',
    payment_type: payment.payment_type || 'advance',
    payment_method: payment.payment_method || 'upi',
    upi_id: '7269068483@ptyes',
    transaction_reference: payment.transaction_reference || '',
    status: payment.status || 'pending',
    notes: payment.notes || '',
    paid_at: payment.status === 'paid' ? new Date().toISOString() : undefined,
    created_at: new Date().toISOString(),
  };

  localState.payments.unshift(newPay);

  // If tied to an invoice and paid, update the invoice remaining balance
  if (newPay.status === 'paid' && newPay.invoice_id) {
    const inv = localState.invoices.find((i) => i.id === newPay.invoice_id);
    if (inv) {
      inv.advance_paid += newPay.amount;
      inv.remaining_balance = Math.max(0, inv.total_amount - inv.advance_paid);
      inv.status = inv.remaining_balance === 0 ? 'paid' : 'partially_paid';
    }
  }

  saveLocalState();
  await logAuditAction('system', 'CREATE', 'PAYMENT', newPay.id, { order: order_id, amount: newPay.amount });
  return newPay;
}

export async function updatePaymentStatus(id: string, status: Payment['status'], ref?: string): Promise<boolean> {
  const p = localState.payments.find((x) => x.id === id);
  if (p) {
    p.status = status;
    if (ref) p.transaction_reference = ref;
    if (status === 'paid' && !p.paid_at) p.paid_at = new Date().toISOString();
    saveLocalState();
    await logAuditAction('admin', 'UPDATE_STATUS', 'PAYMENT', id, { status });
    return true;
  }
  return false;
}

// Payment Transaction aliases & helpers
export async function getPaymentTransactions(): Promise<any[]> {
  const payments = await getPayments();
  return payments.map((p) => ({
    ...p,
    transaction_number: p.order_id,
    transaction_note: p.notes || 'UPI Payment',
    utr_number: p.transaction_reference,
  }));
}

export async function createPaymentTransaction(data: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  amount: number;
  upi_id?: string;
  payment_method?: string;
  utr_number?: string;
  screenshot_url?: string;
  transaction_note?: string;
  status?: string;
  invoice_id?: string;
}): Promise<any> {
  const newP = await createPayment({
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    customer_phone: data.customer_phone,
    amount: data.amount,
    upi_id: data.upi_id || '7269068483@ptyes',
    payment_method: (data.payment_method as any) || 'upi',
    transaction_reference: data.utr_number,
    notes: data.transaction_note,
    status: (data.status as any) || 'pending_verification',
    invoice_id: data.invoice_id,
  });
  return {
    ...newP,
    transaction_number: newP.order_id,
    transaction_note: newP.notes,
    utr_number: newP.transaction_reference,
    screenshot_url: data.screenshot_url,
  };
}

export async function verifyPaymentTransaction(id: string): Promise<boolean> {
  const p = localState.payments.find((x) => x.id === id);
  if (p) {
    p.status = 'verified';
    p.paid_at = new Date().toISOString();

    // Auto-reconcile with explicit invoice or open customer invoice
    let matchedInvoice = p.invoice_id ? localState.invoices.find((i) => i.id === p.invoice_id) : null;
    if (!matchedInvoice && p.customer_email) {
      matchedInvoice = localState.invoices.find(
        (i) => i.customer_email?.toLowerCase().trim() === p.customer_email.toLowerCase().trim() && (i.remaining_balance || 0) > 0
      );
    }

    if (matchedInvoice) {
      p.invoice_id = matchedInvoice.id;
      // Recalculate invoice advance_paid from all verified payments for this invoice
      const invoicePayments = localState.payments.filter(
        (item) => item.invoice_id === matchedInvoice!.id && (item.status === 'verified' || item.status === 'paid')
      );
      matchedInvoice.advance_paid = invoicePayments.reduce((sum, item) => sum + item.amount, 0);
      matchedInvoice.remaining_balance = Math.max(0, matchedInvoice.total_amount - matchedInvoice.advance_paid);
      matchedInvoice.status = matchedInvoice.remaining_balance === 0 ? 'paid' : 'partially_paid';
    }

    // Link and reconcile with project
    let matchedProject = p.project_id ? localState.projects.find((proj) => proj.id === p.project_id) : null;
    if (!matchedProject && matchedInvoice?.project_id) {
      matchedProject = localState.projects.find((proj) => proj.id === matchedInvoice!.project_id);
    }
    if (!matchedProject && p.customer_email) {
      matchedProject = localState.projects.find(
        (proj) => proj.customer_email?.toLowerCase().trim() === p.customer_email.toLowerCase().trim()
      );
    }

    if (matchedProject) {
      p.project_id = matchedProject.id;
      p.project_name = matchedProject.title;
      const projPayments = localState.payments.filter(
        (item) => item.project_id === matchedProject!.id && (item.status === 'verified' || item.status === 'paid')
      );
      matchedProject.paid_amount = projPayments.reduce((sum, item) => sum + item.amount, 0);
    }

    // Update customer total_spent
    if (p.customer_email) {
      const cust = (localState.customers || []).find(
        (c) => c.email.toLowerCase().trim() === p.customer_email!.toLowerCase().trim()
      );
      if (cust) {
        const custPayments = localState.payments.filter(
          (item) => item.customer_email?.toLowerCase().trim() === cust.email.toLowerCase().trim() &&
            (item.status === 'verified' || item.status === 'paid')
        );
        cust.total_spent = custPayments.reduce((sum, item) => sum + item.amount, 0);
      }
    }

    saveLocalState();
    if (p.customer_email) {
      createNotification({
        title: 'UPI Payment Reconciled & Verified',
        message: `Your payment of ₹${p.amount.toLocaleString('en-IN')}${p.transaction_reference ? ` (Ref/UTR: ${p.transaction_reference})` : ''} has been confirmed and officially credited to your account.`,
        customer_email: p.customer_email,
        type: 'payment_status',
      });
    }
    await logAuditAction('admin', 'VERIFY_PAYMENT', 'PAYMENT', id, { amount: p.amount, utr: p.transaction_reference });
    return true;
  }
  return false;
}

export async function rejectPaymentTransaction(id: string, reason?: string): Promise<boolean> {
  const p = localState.payments.find((x) => x.id === id);
  if (p) {
    p.status = 'rejected';
    p.rejection_reason = reason || 'Payment could not be verified with bank records.';
    saveLocalState();
    if (p.customer_email) {
      createNotification({
        title: 'Payment Verification Unsuccessful',
        message: `Payment order ${p.order_id} of ₹${p.amount.toLocaleString('en-IN')} could not be verified: ${p.rejection_reason}`,
        customer_email: p.customer_email,
        type: 'warning',
      });
    }
    await logAuditAction('admin', 'REJECT_PAYMENT', 'PAYMENT', id, { reason });
    return true;
  }
  return false;
}

export async function recordManualPayment(data: {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  project_id?: string;
  invoice_id?: string;
  amount: number;
  payment_method: Payment['payment_method'];
  transaction_reference?: string;
  notes?: string;
  status?: Payment['status'];
}): Promise<Payment> {
  const order_id = `MAN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const status = data.status || 'verified';
  
  let projectName: string | undefined;
  if (data.project_id) {
    const proj = localState.projects.find((p) => p.id === data.project_id);
    if (proj) projectName = proj.title;
  }

  const newPay: Payment = {
    id: `pay-${Date.now()}`,
    order_id,
    invoice_id: data.invoice_id,
    project_id: data.project_id,
    project_name: projectName,
    customer_name: data.customer_name,
    customer_email: data.customer_email.toLowerCase().trim(),
    customer_phone: data.customer_phone || '',
    amount: Number(data.amount) || 0,
    currency: 'INR',
    payment_type: data.invoice_id ? 'invoice' : 'milestone',
    payment_method: data.payment_method || 'manual',
    upi_id: '7269068483@ptyes',
    transaction_reference: data.transaction_reference || `MANUAL-${Date.now().toString().slice(-6)}`,
    status,
    notes: data.notes || 'Manually recorded by administrator',
    paid_at: status === 'verified' || status === 'paid' ? new Date().toISOString() : undefined,
    created_at: new Date().toISOString(),
  };

  localState.payments.unshift(newPay);

  // If verified, reconcile invoice and project
  if (status === 'verified' || status === 'paid') {
    if (newPay.invoice_id) {
      const inv = localState.invoices.find((i) => i.id === newPay.invoice_id);
      if (inv) {
        inv.advance_paid += newPay.amount;
        inv.remaining_balance = Math.max(0, inv.total_amount - inv.advance_paid);
        inv.status = inv.remaining_balance === 0 ? 'paid' : 'partially_paid';
      }
    }
    if (newPay.project_id) {
      const proj = localState.projects.find((p) => p.id === newPay.project_id);
      if (proj) {
        proj.paid_amount = (proj.paid_amount || 0) + newPay.amount;
      }
    }
    if (newPay.customer_email) {
      createNotification({
        title: 'Payment Credited',
        message: `A payment of ₹${newPay.amount.toLocaleString('en-IN')} via ${newPay.payment_method} has been officially recorded and credited.`,
        customer_email: newPay.customer_email,
        type: 'payment_status',
      });
    }
  }

  saveLocalState();
  await logAuditAction('admin', 'RECORD_MANUAL_PAYMENT', 'PAYMENT', newPay.id, {
    amount: newPay.amount,
    method: newPay.payment_method,
    ref: newPay.transaction_reference,
  });
  return newPay;
}

export async function deletePayment(id: string): Promise<boolean> {
  const p = localState.payments.find((x) => x.id === id);
  if (!p) return false;

  localState.payments = localState.payments.filter((x) => x.id !== id);

  // If was verified, recalculate invoice balance
  if (p.invoice_id && (p.status === 'verified' || p.status === 'paid')) {
    const inv = localState.invoices.find((i) => i.id === p.invoice_id);
    if (inv) {
      const remainingVerified = localState.payments
        .filter((item) => item.invoice_id === inv.id && (item.status === 'verified' || item.status === 'paid'))
        .reduce((sum, item) => sum + item.amount, 0);
      inv.advance_paid = remainingVerified;
      inv.remaining_balance = Math.max(0, inv.total_amount - inv.advance_paid);
      inv.status = inv.remaining_balance === 0 ? 'paid' : inv.advance_paid > 0 ? 'partially_paid' : 'issued';
    }
  }

  // Recalculate project paid amount
  if (p.project_id && (p.status === 'verified' || p.status === 'paid')) {
    const proj = localState.projects.find((pr) => pr.id === p.project_id);
    if (proj) {
      proj.paid_amount = localState.payments
        .filter((item) => item.project_id === proj.id && (item.status === 'verified' || item.status === 'paid'))
        .reduce((sum, item) => sum + item.amount, 0);
    }
  }

  saveLocalState();
  await logAuditAction('admin', 'DELETE_PAYMENT', 'PAYMENT', id);
  return true;
}

export interface CustomerFinancialSummary {
  total_project_amount: number;
  amount_paid: number;
  amount_pending: number;
  next_due_date: string | null;
  validated_payments_count: number;
}

export async function calculateCustomerFinancials(customerEmail: string): Promise<CustomerFinancialSummary> {
  const cleanEmail = customerEmail.toLowerCase().trim();
  
  const custProjects = (localState.projects || []).filter(
    (p) => p.customer_email && p.customer_email.toLowerCase().trim() === cleanEmail
  );
  const custInvoices = (localState.invoices || []).filter(
    (i) => i.customer_email && i.customer_email.toLowerCase().trim() === cleanEmail
  );
  const custPayments = (localState.payments || []).filter(
    (p) => p.customer_email && p.customer_email.toLowerCase().trim() === cleanEmail
  );

  // Sum of validated payments only
  const validatedPayments = custPayments.filter(
    (p) => p.status === 'verified' || p.status === 'paid'
  );
  const amount_paid = validatedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Total project amount = sum of projects' estimated_cost, or sum of invoices if higher
  const projectsTotal = custProjects.reduce((sum, p) => sum + (p.estimated_cost || 0), 0);
  const invoicesTotal = custInvoices.reduce((sum, i) => sum + (i.total_amount || 0), 0);
  const total_project_amount = Math.max(projectsTotal, invoicesTotal);

  // Pending calculation: strictly Total - Validated Payments (guaranteed never negative)
  const amount_pending = Math.max(0, total_project_amount - amount_paid);

  // Next due date: earliest due date from unpaid/partially paid invoices
  const pendingInvoices = custInvoices
    .filter((inv) => (inv.remaining_balance || 0) > 0 && inv.due_date && inv.status !== 'cancelled')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  
  const next_due_date = pendingInvoices.length > 0 ? pendingInvoices[0].due_date : null;

  return {
    total_project_amount,
    amount_paid,
    amount_pending,
    next_due_date,
    validated_payments_count: validatedPayments.length,
  };
}

// ----------------- TESTIMONIALS -----------------
export async function getTestimonials(): Promise<Testimonial[]> {
  return [...localState.testimonials];
}

export async function saveTestimonial(testimonial: Partial<Testimonial> & { id?: string }): Promise<Testimonial> {
  const isNew = !testimonial.id;
  const newT: Testimonial = {
    id: testimonial.id || `t-${Date.now()}`,
    client_name: testimonial.client_name || 'Client',
    client_role: testimonial.client_role || 'Business Owner',
    company_name: testimonial.company_name || 'Company',
    project_title: testimonial.project_title || 'Web Project',
    rating: testimonial.rating || 5,
    feedback: testimonial.feedback || '',
    avatar_url: testimonial.avatar_url || '',
    is_demo: testimonial.is_demo ?? false,
    is_active: testimonial.is_active ?? true,
    display_order: testimonial.display_order ?? localState.testimonials.length + 1,
    created_at: testimonial.created_at || new Date().toISOString(),
  };

  if (isNew) localState.testimonials.push(newT);
  else {
    const idx = localState.testimonials.findIndex((x) => x.id === testimonial.id);
    if (idx >= 0) localState.testimonials[idx] = newT;
    else localState.testimonials.push(newT);
  }
  saveLocalState();
  return newT;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  localState.testimonials = localState.testimonials.filter((t) => t.id !== id);
  saveLocalState();
  return true;
}

// ----------------- FAQS -----------------
export async function getFaqs(): Promise<Faq[]> {
  return [...localState.faqs];
}

export async function saveFaq(faq: Partial<Faq> & { id?: string }): Promise<Faq> {
  const isNew = !faq.id;
  const newF: Faq = {
    id: faq.id || `faq-${Date.now()}`,
    category: faq.category || 'General',
    question: faq.question || '',
    answer: faq.answer || '',
    display_order: faq.display_order ?? localState.faqs.length + 1,
    is_active: faq.is_active ?? true,
    created_at: faq.created_at || new Date().toISOString(),
  };
  if (isNew) localState.faqs.push(newF);
  else {
    const idx = localState.faqs.findIndex((x) => x.id === faq.id);
    if (idx >= 0) localState.faqs[idx] = newF;
    else localState.faqs.push(newF);
  }
  saveLocalState();
  return newF;
}

export async function deleteFaq(id: string): Promise<boolean> {
  localState.faqs = localState.faqs.filter((f) => f.id !== id);
  saveLocalState();
  return true;
}

// ----------------- BLOG -----------------
export async function getBlogPosts(): Promise<BlogPost[]> {
  return [...localState.blog];
}

export async function saveBlogPost(post: Partial<BlogPost> & { id?: string }): Promise<BlogPost> {
  const isNew = !post.id;
  const newP: BlogPost = {
    id: post.id || `post-${Date.now()}`,
    title: post.title || 'New Article',
    slug: post.slug || (post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `post-${Date.now()}`),
    excerpt: post.excerpt || '',
    content: post.content || '',
    cover_image: post.cover_image || '',
    author_name: post.author_name || 'Srijan Singh',
    category: post.category || 'Engineering',
    tags: post.tags || ['Technology'],
    read_time_minutes: post.read_time_minutes || 4,
    is_published: post.is_published ?? true,
    published_at: post.published_at || new Date().toISOString(),
    created_at: post.created_at || new Date().toISOString(),
  };
  if (isNew) localState.blog.unshift(newP);
  else {
    const idx = localState.blog.findIndex((b) => b.id === post.id);
    if (idx >= 0) localState.blog[idx] = newP;
    else localState.blog.unshift(newP);
  }
  saveLocalState();
  return newP;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  localState.blog = localState.blog.filter((b) => b.id !== id);
  saveLocalState();
  return true;
}

// ----------------- SETTINGS -----------------
export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  // 1. If Supabase is connected, query the persistent website_settings table
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('*')
        .in('key', ['website_settings', 'general', 'founder_photo']);
      if (!error && data && data.length > 0) {
        const genRow = data.find((r: any) => r.key === 'website_settings' || r.key === 'general');
        const photoRow = data.find((r: any) => r.key === 'founder_photo');
        if (genRow?.value) {
          localState.settings = { ...localState.settings, ...genRow.value };
        }
        if (photoRow?.value?.url) {
          localState.settings.founder_photo_url = photoRow.value.url;
          localState.settings.founder_photo_updated_at = photoRow.value.updated_at;
        }
        saveLocalState();
        return { ...localState.settings };
      }
    } catch (e) {
      console.warn('Supabase website_settings query notice:', e);
    }
  }

  // 2. Query server API endpoint
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const serverSettings = await res.json();
      if (serverSettings && serverSettings.founder_name) {
        localState.settings = { ...localState.settings, ...serverSettings };
        saveLocalState();
      }
    }
  } catch {
    // network fallback to localState
  }
  return { ...localState.settings };
}

export async function updateWebsiteSettings(newSettings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
  localState.settings = { ...localState.settings, ...newSettings };
  saveLocalState();

  // 1. If Supabase is connected, upsert into website_settings table immediately
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('website_settings').upsert([
        {
          key: 'website_settings',
          value: localState.settings,
          updated_at: new Date().toISOString(),
        },
        {
          key: 'general',
          value: localState.settings,
          updated_at: new Date().toISOString(),
        },
      ]);
      if (newSettings.founder_photo_url) {
        await supabase.from('website_settings').upsert({
          key: 'founder_photo',
          value: {
            url: newSettings.founder_photo_url,
            updated_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn('Supabase updateWebsiteSettings sync warning:', e);
    }
  }

  // 2. Sync with backend API
  try {
    const adminToken = typeof window !== 'undefined' ? localStorage.getItem('srijantech_admin_token_v2') : null;
    if (adminToken) {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(localState.settings),
      });
    }
  } catch {
    // offline fallback
  }

  await logAuditAction('admin', 'UPDATE_SETTINGS', 'WEBSITE_SETTINGS', 'global');
  return { ...localState.settings };
}

// ----------------- SUPPORT & TICKETS -----------------
export async function getSupportMessages(): Promise<SupportMessage[]> {
  return [...localState.support];
}

export async function createSupportMessage(msg: Omit<SupportMessage, 'id' | 'ticket_number' | 'created_at' | 'status'>): Promise<SupportMessage> {
  const ticket_number = `TICK-${Math.floor(100 + Math.random() * 900)}`;
  const newTicket: SupportMessage = {
    ...msg,
    id: `sup-${Date.now()}`,
    ticket_number,
    status: 'open',
    created_at: new Date().toISOString(),
  };
  localState.support.unshift(newTicket);
  saveLocalState();
  return newTicket;
}

export async function replySupportMessage(id: string, reply: string, status: SupportMessage['status'] = 'resolved'): Promise<boolean> {
  const t = localState.support.find((x) => x.id === id);
  if (t) {
    t.admin_reply = reply;
    t.replied_at = new Date().toISOString();
    t.status = status;
    saveLocalState();
    return true;
  }
  return false;
}

// ----------------- NOTIFICATIONS -----------------
export async function getNotifications(
  profileId?: string,
  customerEmail?: string
): Promise<NotificationItem[]> {
  let list = [...(localState.notifications || [])];
  if (customerEmail) {
    const cleanEmail = customerEmail.toLowerCase().trim();
    list = list.filter(
      (n) =>
        (n.customer_email && n.customer_email.toLowerCase().trim() === cleanEmail) ||
        (n.profile_id && profileId && n.profile_id === profileId)
    );
  } else if (profileId) {
    list = list.filter((n) => n.profile_id === profileId);
  }
  return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createNotification(data: {
  title: string;
  message: string;
  customer_email?: string;
  profile_id?: string;
  type?: NotificationItem['type'];
  link_url?: string;
}): Promise<NotificationItem> {
  const notif: NotificationItem = {
    id: `notif-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    profile_id: data.profile_id,
    customer_email: data.customer_email,
    title: data.title,
    message: data.message,
    link_url: data.link_url,
    type: data.type || 'info',
    is_read: false,
    created_at: new Date().toISOString(),
  };
  if (!localState.notifications) localState.notifications = [];
  localState.notifications.unshift(notif);
  saveLocalState();
  return notif;
}

export async function markNotificationRead(id: string): Promise<boolean> {
  const n = localState.notifications.find((x) => x.id === id);
  if (n) {
    n.is_read = true;
    saveLocalState();
    return true;
  }
  return false;
}

// ----------------- CUSTOMER MANAGEMENT -----------------
export async function getCustomers(): Promise<Customer[]> {
  return [...(localState.customers || [])];
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  const clean = email.trim().toLowerCase();
  const cust = (localState.customers || []).find((c) => c.email.toLowerCase().trim() === clean);
  return cust || null;
}

export async function saveCustomer(
  customer: Partial<Customer> & { full_name: string; email: string }
): Promise<Customer> {
  if (!localState.customers) localState.customers = [];
  const cleanEmail = customer.email.trim().toLowerCase();
  const idx = localState.customers.findIndex((c) => c.email.toLowerCase().trim() === cleanEmail);

  if (idx >= 0) {
    const updated: Customer = {
      ...localState.customers[idx],
      ...customer,
      email: cleanEmail,
    };
    localState.customers[idx] = updated;
    saveLocalState();
    await logAuditAction('admin', 'UPDATE', 'CUSTOMER', updated.id, { email: cleanEmail });
    return updated;
  } else {
    const newCust: Customer = {
      id: customer.id || `cust-${Date.now()}`,
      full_name: customer.full_name.trim(),
      email: cleanEmail,
      phone: customer.phone || '',
      whatsapp: customer.whatsapp || customer.phone || '',
      company_name: customer.company_name || '',
      address: customer.address || '',
      city: customer.city || 'Varanasi',
      state: customer.state || 'Uttar Pradesh',
      notes: customer.notes || '',
      status: customer.status || 'active',
      total_spent: customer.total_spent || 0,
      created_at: new Date().toISOString(),
    };
    localState.customers.unshift(newCust);
    saveLocalState();
    await logAuditAction('admin', 'CREATE', 'CUSTOMER', newCust.id, { email: cleanEmail });
    return newCust;
  }
}

export async function deleteCustomer(id: string): Promise<boolean> {
  if (!localState.customers) return false;
  localState.customers = localState.customers.filter((c) => c.id !== id);
  saveLocalState();
  await logAuditAction('admin', 'DELETE', 'CUSTOMER', id);
  return true;
}

// ----------------- AUDIT LOGS -----------------
export async function getAuditLogs(): Promise<AuditLog[]> {
  return [...localState.auditLogs];
}

export async function logAuditAction(
  user_email: string,
  action: string,
  entity: string,
  entity_id: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    user_email,
    action,
    entity,
    entity_id,
    metadata,
    created_at: new Date().toISOString(),
  };
  localState.auditLogs.unshift(log);
  if (localState.auditLogs.length > 200) localState.auditLogs.pop();
  saveLocalState();
}

// Aliases
export const saveWebsiteSettings = updateWebsiteSettings;

export async function getSupportTickets(): Promise<any[]> {
  const list = await getSupportMessages();
  return list.map((t) => ({
    ...t,
    admin_response: t.admin_reply,
  }));
}

export async function createSupportTicket(data: {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  subject: string;
  message: string;
  priority?: string;
}): Promise<any> {
  const msg = await createSupportMessage({
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    subject: data.subject,
    message: data.message,
  });
  return {
    ...msg,
    customer_phone: data.customer_phone,
    priority: data.priority || 'medium',
    admin_response: msg.admin_reply,
  };
}

export async function updateSupportTicket(id: string, status: string, response?: string): Promise<boolean> {
  return replySupportMessage(id, response || '', status as any);
}

// ----------------- TIME TRACKING -----------------
export async function getTimeEntries(projectId?: string, customerEmail?: string): Promise<TimeEntry[]> {
  let list = [...(localState.timeEntries || [])];
  if (projectId) {
    list = list.filter((t) => t.project_id === projectId);
  }
  if (customerEmail) {
    list = list.filter((t) => !t.customer_email || t.customer_email.toLowerCase() === customerEmail.toLowerCase());
  }
  return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createTimeEntry(entry: Omit<TimeEntry, 'id' | 'created_at'>): Promise<TimeEntry> {
  const newEntry: TimeEntry = {
    ...entry,
    id: `time-${Date.now()}`,
    entry_type: 'manual', // Strictly manually entered as requested
    created_at: new Date().toISOString(),
  };

  if (!localState.timeEntries) localState.timeEntries = [];
  localState.timeEntries.unshift(newEntry);
  saveLocalState();
  await logAuditAction('srijan@srijantech.in', 'CREATE', 'TIME_ENTRY', newEntry.id, {
    project: newEntry.project_name,
    duration: newEntry.duration_minutes,
  });
  return newEntry;
}

export async function deleteTimeEntry(id: string): Promise<boolean> {
  if (!localState.timeEntries) return false;
  localState.timeEntries = localState.timeEntries.filter((t) => t.id !== id);
  saveLocalState();
  await logAuditAction('srijan@srijantech.in', 'DELETE', 'TIME_ENTRY', id);
  return true;
}

export async function updateProjectProgress(
  projectId: string,
  updates: Partial<Project>
): Promise<Project | null> {
  const idx = localState.projects.findIndex((p) => p.id === projectId);
  if (idx < 0) return null;

  const current = localState.projects[idx];
  const updated: Project = {
    ...current,
    ...updates,
    last_updated: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  localState.projects[idx] = updated;
  saveLocalState();
  if (updated.customer_email) {
    createNotification({
      title: 'Project Status Updated',
      message: `${updated.title} is now in "${String(updated.status).replace(/_/g, ' ')}" phase (${updated.progress_percentage || 0}% completed).`,
      customer_email: updated.customer_email,
      type: 'project_status',
    });
  }
  await logAuditAction('srijan@srijantech.in', 'UPDATE_PROJECT_PROGRESS', 'PROJECT', projectId, {
    status: updated.status,
    progress: updated.progress_percentage,
  });
  return updated;
}

