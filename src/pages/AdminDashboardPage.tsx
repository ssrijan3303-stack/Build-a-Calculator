import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  WebsiteSettings,
  ProjectEnquiry,
  Invoice,
  PaymentTransaction,
  Service,
  Project,
  PricingPlan,
  Testimonial,
  Faq,
  BlogPost,
  SupportTicket,
  Customer,
  TimeEntry,
} from '../types';
import {
  getEnquiries,
  updateEnquiryStatus,
  getInvoices,
  saveInvoice,
  deleteInvoice,
  getPaymentTransactions,
  verifyPaymentTransaction,
  getServices,
  saveService,
  getProjects,
  saveProject,
  getPricingPlans,
  savePricingPlan,
  getTestimonials,
  saveTestimonial,
  getFaqs,
  saveFaq,
  getBlogPosts,
  saveBlogPost,
  getSupportTickets,
  updateSupportTicket,
  getWebsiteSettings,
  saveWebsiteSettings,
  getCustomers,
  saveCustomer,
  deleteCustomer,
  getTimeEntries,
  rejectPaymentTransaction,
  deletePayment,
  deleteProject,
} from '../services/db';
import { getAdminToken } from '../services/auth';
import { InvoiceModal } from '../components/InvoiceModal';
import { AdminTimeTrackingSection } from '../components/AdminTimeTrackingSection';
import { AdminPaymentModal } from '../components/AdminPaymentModal';
import { AdminProjectModal } from '../components/AdminProjectModal';
import { AdminInvoiceModal } from '../components/AdminInvoiceModal';
import { CustomerDetailModal } from '../components/CustomerDetailModal';
import { FounderPhoto } from '../components/FounderPhoto';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  CreditCard,
  Briefcase,
  FolderGit2,
  Tag,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Headphones,
  Settings,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  Search,
  Check,
  Camera,
  Upload,
  Users,
  Eye,
  X,
} from 'lucide-react';

interface AdminDashboardPageProps {
  adminUser: UserProfile;
  onLogout: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ adminUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState(false);

  // Data States
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [enquiries, setEnquiries] = useState<ProjectEnquiry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);

  // Modal / Selection States
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showCreateServiceModal, setShowCreateServiceModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Enhanced Modals State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalDefaults, setPaymentModalDefaults] = useState<{
    customerEmail?: string;
    customerName?: string;
    projectId?: string;
    invoiceId?: string;
    amount?: number;
  }>({});

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [showAdminInvoiceModal, setShowAdminInvoiceModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [defaultInvoiceCustomer, setDefaultInvoiceCustomer] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  } | undefined>(undefined);

  const [selectedCustomerForDetail, setSelectedCustomerForDetail] = useState<Customer | null>(null);

  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending_verification' | 'verified' | 'rejected'>('all');
  const [rejectionPaymentId, setRejectionPaymentId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Customer Form
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustCompany, setNewCustCompany] = useState('');
  const [newCustCity, setNewCustCity] = useState('Varanasi');
  const [newCustNotes, setNewCustNotes] = useState('');

  // Forms
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Invoice form state
  const [newInvCustomer, setNewInvCustomer] = useState('');
  const [newInvEmail, setNewInvEmail] = useState('');
  const [newInvPhone, setNewInvPhone] = useState('');
  const [newInvAddress, setNewInvAddress] = useState('Varanasi, UP');
  const [newInvService, setNewInvService] = useState('Custom Web Application');
  const [newInvAmount, setNewInvAmount] = useState(25000);
  const [newInvAdvance, setNewInvAdvance] = useState(10000);
  const [newInvDueDate, setNewInvDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );

  // New Service form state
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(20000);
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceFeatures, setNewServiceFeatures] = useState('Responsive UI\nTypeScript Backend\nUPI Integration');

  // New Project form state
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjCategory, setNewProjCategory] = useState('Full-Stack Web App');
  const [newProjCost, setNewProjCost] = useState(35000);
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjTech, setNewProjTech] = useState('React, TypeScript, Vite, Tailwind, Supabase');
  const [newProjFeat, setNewProjFeat] = useState('Real-Time Updates, UPI Instant Checkout, Admin Control');

  // Notification / Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Founder Photo Upload States
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoUploadSuccess, setPhotoUploadSuccess] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);

  const handleFounderPhotoUpload = async (file: File) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setPhotoUploadError('Please select a valid image file (JPEG, PNG, or WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoUploadError('Image file exceeds the 10MB limit.');
      return;
    }

    const adminToken = getAdminToken();
    if (!adminToken) {
      setPhotoUploadError('Administrator authorization required. Please sign in as admin.');
      return;
    }

    setPhotoUploading(true);
    setPhotoUploadError(null);
    setPhotoUploadSuccess(false);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const b64 = event.target?.result as string;
      if (!b64) {
        setPhotoUploading(false);
        return;
      }
      try {
        const res = await fetch('/api/upload-founder-photo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ imageBase64: b64 }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Upload failed with status ${res.status}`);
        }
        const data = await res.json();
        const newUrl = data.url;
        if (settings) {
          const updated = { ...settings, founder_photo_url: newUrl };
          setSettings(updated);
          await saveWebsiteSettings(updated);
        }
        window.dispatchEvent(new CustomEvent('founder_photo_updated', { detail: newUrl }));
        setPhotoUploadSuccess(true);
        showToast('Founder photo updated and saved permanently!');
        setTimeout(() => setPhotoUploadSuccess(false), 5000);
      } catch (err: any) {
        setPhotoUploadError(err.message || 'Upload failed');
      } finally {
        setPhotoUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [s, enq, inv, pay, srv, prj, prc, tst, fq, blg, tkt, custs, times] = await Promise.all([
        getWebsiteSettings(),
        getEnquiries(),
        getInvoices(),
        getPaymentTransactions(),
        getServices(),
        getProjects(),
        getPricingPlans(),
        getTestimonials(),
        getFaqs(),
        getBlogPosts(),
        getSupportTickets(),
        getCustomers(),
        getTimeEntries(),
      ]);

      setSettings(s);
      setEnquiries(enq);
      setInvoices(inv);
      setPayments(pay);
      setServices(srv);
      setProjects(prj);
      setPricing(prc);
      setTestimonials(tst);
      setFaqs(fq);
      setPosts(blg);
      setTickets(tkt);
      setCustomers(custs);
      setTimeEntries(times);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustEmail.trim()) return;

    await saveCustomer({
      full_name: newCustName.trim(),
      email: newCustEmail.trim().toLowerCase(),
      phone: newCustPhone.trim(),
      whatsapp: newCustPhone.trim(),
      company_name: newCustCompany.trim(),
      city: newCustCity.trim() || 'Varanasi',
      notes: newCustNotes.trim(),
    });

    setShowAddCustomerModal(false);
    setNewCustName('');
    setNewCustEmail('');
    setNewCustPhone('');
    setNewCustCompany('');
    setNewCustNotes('');
    showToast('Customer registered successfully');
    loadAllData();
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('Are you sure you want to remove this customer record?')) return;
    await deleteCustomer(id);
    showToast('Customer record removed');
    loadAllData();
  };

  // Status Handlers
  const handleEnquiryStatusChange = async (id: string, status: ProjectEnquiry['status']) => {
    await updateEnquiryStatus(id, status);
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    showToast('Enquiry status updated');
  };

  const handleVerifyPayment = async (txId: string) => {
    await verifyPaymentTransaction(txId);
    showToast('Payment verified and reconciled with bank!');
    loadAllData();
  };

  const handleRejectPayment = async (txId: string, reason?: string) => {
    await rejectPaymentTransaction(txId, reason);
    setRejectionPaymentId(null);
    setRejectionReason('');
    showToast('Payment marked as rejected');
    loadAllData();
  };

  const handleDeletePayment = async (txId: string) => {
    if (!confirm('Are you sure you want to delete this payment record? This will reverse any linked invoice/project balance.')) return;
    await deletePayment(txId);
    showToast('Payment record deleted and balances reversed');
    loadAllData();
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await deleteProject(id);
    showToast('Project deleted');
    loadAllData();
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvCustomer.trim() || !newInvEmail.trim()) return;

    const subtotal = Number(newInvAmount);
    const advance = Number(newInvAdvance);
    const balance = Math.max(0, subtotal - advance);

    const inv = await saveInvoice({
      customer_name: newInvCustomer.trim(),
      customer_email: newInvEmail.trim(),
      customer_phone: newInvPhone.trim(),
      customer_address: newInvAddress.trim(),
      service_name: newInvService.trim(),
      issue_date: new Date().toISOString().split('T')[0],
      due_date: newInvDueDate,
      items: [
        {
          description: newInvService.trim(),
          quantity: 1,
          unit_price: subtotal,
          amount: subtotal,
        },
      ],
      subtotal,
      tax_rate: 0,
      tax_amount: 0,
      discount_amount: 0,
      advance_paid: advance,
      total_amount: subtotal,
      remaining_balance: balance,
      status: balance === 0 ? 'paid' : advance > 0 ? 'partially_paid' : 'issued',
    });

    setInvoices([inv, ...invoices]);
    setShowCreateInvoiceModal(false);
    showToast(`Invoice ${inv.invoice_number} created!`);
  };

  const handleDeleteInvoice = async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      await deleteInvoice(id);
      setInvoices(invoices.filter((i) => i.id !== id));
      showToast('Invoice deleted');
    }
  };

  const handleReplyTicket = async (ticketId: string) => {
    if (!ticketReplyText.trim()) return;
    await updateSupportTicket(ticketId, 'resolved', ticketReplyText.trim());
    setReplyTicketId(null);
    setTicketReplyText('');
    showToast('Support ticket resolved with customer response!');
    loadAllData();
  };

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    await saveWebsiteSettings(settings);
    showToast('Website & business settings saved successfully!');
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle.trim()) return;

    const srv = await saveService({
      slug: newServiceTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newServiceTitle.trim(),
      short_description: newServiceDesc.trim(),
      detailed_description: newServiceDesc.trim(),
      icon: 'Globe',
      base_price: Number(newServicePrice),
      features: newServiceFeatures.split('\n').filter(Boolean),
      is_active: true,
      display_order: services.length + 1,
    });

    setServices([...services, srv]);
    setShowCreateServiceModal(false);
    setNewServiceTitle('');
    setNewServiceDesc('');
    showToast('Service added!');
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;

    const prj = await saveProject({
      slug: newProjTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newProjTitle.trim(),
      category: newProjCategory.trim(),
      description: newProjDesc.trim(),
      detailed_case_study: newProjDesc.trim(),
      technologies: newProjTech.split(',').map((s) => s.trim()).filter(Boolean),
      features: newProjFeat.split(',').map((s) => s.trim()).filter(Boolean),
      estimated_cost: Number(newProjCost),
      is_featured: true,
      display_order: projects.length + 1,
    });

    setProjects([...projects, prj]);
    setShowCreateProjectModal(false);
    setNewProjTitle('');
    setNewProjDesc('');
    showToast('Project prototype added!');
  };

  // 7 Executive KPIs
  const totalInquiriesCount = enquiries.length;
  const activeProjectsCount = projects.filter((p) => p.status !== 'completed').length;
  const completedProjectsCount = projects.filter((p) => p.status === 'completed').length;
  const totalRevenue = payments
    .filter((p) => p.status === 'verified' || p.status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const pendingPaymentsAmount = invoices.reduce(
    (acc, curr) => acc + (curr.remaining_balance || 0),
    0
  );
  const totalCustomersCount = customers.length;
  const totalHoursLogged = Math.round(
    timeEntries.reduce((acc, t) => acc + (t.duration_minutes || 0), 0) / 60
  );

  const pendingVerificationCount = payments.filter(
    (p) => p.status === 'pending_verification'
  ).length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;
  const openTicketsCount = tickets.filter((t) => t.status === 'open').length;

  const adminNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'enquiries', label: `Enquiries (${newEnquiriesCount})`, icon: Inbox },
    { id: 'customers', label: `Customers (${totalCustomersCount})`, icon: Users },
    { id: 'invoices', label: `Invoices (${invoices.length})`, icon: FileText },
    { id: 'payments', label: `UPI Bank Match (${pendingVerificationCount})`, icon: CreditCard },
    { id: 'projects', label: `Projects (${projects.length})`, icon: FolderGit2 },
    { id: 'time-tracking', label: 'Time Tracking & Progress', icon: Clock },
    { id: 'services', label: `Services (${services.length})`, icon: Briefcase },
    { id: 'tickets', label: `Support Tickets (${openTicketsCount})`, icon: Headphones },
    { id: 'settings', label: 'Site & Founder Settings', icon: Settings },
  ];

  return (
    <div className="pt-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
              SrijanTech Executive Admin Panel
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase">
              Varanasi Node
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <strong>{adminUser.full_name}</strong> (mystoreorder0004@gmail.com) • UPI:{' '}
            <strong className="text-cyan-300 font-mono">7269068483@ptyes</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllData}
            title="Refresh database"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 7 Executive Founder KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Verified Revenue</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Via Indian UPI QR</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Pending Payments</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono mt-1">
                ₹{pendingPaymentsAmount.toLocaleString('en-IN')}
              </div>
              <button
                onClick={() => setActiveTab('invoices')}
                className="text-[10px] text-cyan-400 hover:underline mt-1 inline-block"
              >
                View Unpaid Invoices →
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Inquiries</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono mt-1">
                {totalInquiriesCount}
              </div>
              <button
                onClick={() => setActiveTab('enquiries')}
                className="text-[10px] text-cyan-400 hover:underline mt-1 inline-block"
              >
                {newEnquiriesCount} New Leads →
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Registered Customers</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono mt-1">
                {totalCustomersCount}
              </div>
              <button
                onClick={() => setActiveTab('customers')}
                className="text-[10px] text-cyan-400 hover:underline mt-1 inline-block"
              >
                Manage Client Accounts →
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Active Projects</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono mt-1">
                {activeProjectsCount}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">In development/testing</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Completed Projects</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                {completedProjectsCount}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Delivered live</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Hours Logged</span>
                <span className="text-[10px] font-mono text-cyan-400">{timeEntries.length} Manual Work Records</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono mt-1">
                {totalHoursLogged} Hours
              </div>
              <button
                onClick={() => setActiveTab('time-tracking')}
                className="text-[10px] text-cyan-400 hover:underline mt-1 inline-block"
              >
                Open Time Tracking &amp; Work Logs →
              </button>
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
              Quick Admin Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowCreateInvoiceModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Issue Tax Invoice</span>
              </button>
              <button
                onClick={() => setShowCreateServiceModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Service</span>
              </button>
              <button
                onClick={() => setShowCreateProjectModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project Concept</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Change Founder Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ENQUIRIES / CRM PIPELINE */}
      {activeTab === 'enquiries' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Client Enquiries &amp; CRM Pipeline
            </h3>
            <span className="text-xs text-slate-400">{enquiries.length} total entries</span>
          </div>

          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-bold">{enq.enquiry_number}</span>
                    <h4 className="font-bold text-white text-sm">{enq.full_name}</h4>
                    <span className="text-slate-400">({enq.email} • {enq.phone})</span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      value={enq.status}
                      onChange={(e) =>
                        handleEnquiryStatusChange(enq.id, e.target.value as ProjectEnquiry['status'])
                      }
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-semibold focus:outline-none"
                    >
                      <option value="new">New Inquiry</option>
                      <option value="in_review">In Review</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </select>

                    <a
                      href={`https://wa.me/91${enq.whatsapp || enq.phone}?text=${encodeURIComponent(
                        `Hello ${enq.full_name}, this is Srijan Singh from SrijanTech (Varanasi). Regarding your enquiry ${enq.enquiry_number}:`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                      title="Direct WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-400 text-[11px]">
                  <div>
                    <strong>Service:</strong> {enq.service_name}
                  </div>
                  <div>
                    <strong>Budget:</strong> {enq.budget_range}
                  </div>
                  <div>
                    <strong>Channel:</strong> {enq.preferred_contact_method}
                  </div>
                </div>

                <p className="text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                  {enq.project_description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: CUSTOMER MANAGEMENT */}
      {activeTab === 'customers' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Customer Accounts &amp; Profiles</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage all registered clients, assign projects, track lifetime billing, and maintain client notes.
              </p>
            </div>
            <button
              onClick={() => setShowAddCustomerModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Customer</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, email, company, phone..."
              value={customerSearchQuery}
              onChange={(e) => setCustomerSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Customers Table */}
          {customers.length === 0 ? (
            <div className="p-12 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <Users className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">No customers registered yet</h4>
              <p className="text-xs text-slate-400">
                Click "+ Add Customer" or allow customers to sign up via the Client Portal.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px]">
                  <tr className="border-b border-slate-800">
                    <th className="py-3 px-3">Client Name</th>
                    <th className="py-3 px-3">Company &amp; City</th>
                    <th className="py-3 px-3">Contact Details</th>
                    <th className="py-3 px-3 text-center">Linked Projects</th>
                    <th className="py-3 px-3 text-right">Invoiced Amount</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {customers
                    .filter((c) => {
                      if (!customerSearchQuery.trim()) return true;
                      const q = customerSearchQuery.toLowerCase();
                      return (
                        c.full_name.toLowerCase().includes(q) ||
                        c.email.toLowerCase().includes(q) ||
                        (c.company_name && c.company_name.toLowerCase().includes(q)) ||
                        (c.phone && c.phone.includes(q))
                      );
                    })
                    .map((cust) => {
                      const cleanEmail = cust.email.toLowerCase().trim();
                      const clientProjects = projects.filter(
                        (p) => p.customer_email && p.customer_email.toLowerCase().trim() === cleanEmail
                      );
                      const clientInvoices = invoices.filter(
                        (i) => i.customer_email && i.customer_email.toLowerCase().trim() === cleanEmail
                      );
                      const clientTotalInvoiced = clientInvoices.reduce(
                        (sum, i) => sum + (i.total_amount || 0),
                        0
                      );

                      return (
                        <tr key={cust.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-3">
                            <button
                              onClick={() => setSelectedCustomerForDetail(cust)}
                              className="font-bold text-white hover:text-cyan-400 text-left transition-colors cursor-pointer"
                              title="Click to view 360° client dossier"
                            >
                              {cust.full_name}
                            </button>
                            <div className="text-[10px] text-slate-400 font-mono">{cust.email}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="text-slate-200">{cust.company_name || 'Individual'}</div>
                            <div className="text-[10px] text-slate-400">{cust.city || 'Varanasi'}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-300 font-mono">
                            <div>{cust.phone || 'N/A'}</div>
                            {cust.whatsapp && cust.whatsapp !== cust.phone && (
                              <div className="text-[10px] text-emerald-400">WA: {cust.whatsapp}</div>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono text-[10px]">
                              {clientProjects.length} Project{clientProjects.length !== 1 ? 's' : ''}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                            ₹{clientTotalInvoiced.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedCustomerForDetail(cust)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold cursor-pointer"
                                title="View 360° dossier & milestones"
                              >
                                <Eye className="w-3 h-3 text-cyan-400" />
                                <span>Profile</span>
                              </button>
                              <button
                                onClick={() => {
                                  setPaymentModalDefaults({
                                    customerEmail: cust.email,
                                    customerName: cust.full_name,
                                  });
                                  setShowPaymentModal(true);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] font-semibold cursor-pointer"
                                title="Record payment for this customer"
                              >
                                + Payment
                              </button>
                              <button
                                onClick={() => {
                                  setDefaultInvoiceCustomer({
                                    name: cust.full_name,
                                    email: cust.email,
                                    phone: cust.phone,
                                    address: cust.city ? `${cust.city}, UP` : 'Varanasi, UP',
                                  });
                                  setEditingInvoice(null);
                                  setShowAdminInvoiceModal(true);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold cursor-pointer"
                                title="Issue Tax Invoice to this client"
                              >
                                + Invoice
                              </button>
                              <button
                                onClick={() => handleDeleteCustomer(cust.id)}
                                className="p-1 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 cursor-pointer"
                                title="Delete Customer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INVOICES MANAGER */}
      {activeTab === 'invoices' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Tax Invoices &amp; Billing Ledger</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate formal GST-compliant invoices with line items, advance credits, and printable PDF previews.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingInvoice(null);
                setDefaultInvoiceCustomer(undefined);
                setShowAdminInvoiceModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Invoice</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px]">
                <tr className="border-b border-slate-800">
                  <th className="py-3 px-3">Invoice #</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Service</th>
                  <th className="py-3 px-3 text-right">Total (INR)</th>
                  <th className="py-3 px-3 text-right">Advance Paid</th>
                  <th className="py-3 px-3 text-right">Balance Due</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-cyan-400">
                      {inv.invoice_number}
                    </td>
                    <td className="py-3 px-3 text-white font-medium">
                      {inv.customer_name}
                      <span className="block text-[11px] text-slate-500 font-mono">{inv.customer_email}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{inv.service_name}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      ₹{inv.total_amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-400">
                      ₹{inv.advance_paid.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                      ₹{inv.remaining_balance.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inv.status === 'paid'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : inv.status === 'partially_paid'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                        title="Print / View PDF"
                      >
                        Print/PDF
                      </button>
                      <button
                        onClick={() => {
                          setEditingInvoice(inv);
                          setShowAdminInvoiceModal(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold cursor-pointer"
                        title="Edit Invoice Line Items"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(inv.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 cursor-pointer"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: UPI BANK RECONCILIATION & PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                <span>UPI Remittance &amp; Payment Ledger</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Reconcile customer UTR reference numbers against bank statements for{' '}
                <span className="text-cyan-300 font-mono">7269068483@ptyes</span> and record manual payments.
              </p>
            </div>
            <button
              onClick={() => {
                setPaymentModalDefaults({});
                setShowPaymentModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Manual Payment</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Verified Collections</span>
              <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                ₹{payments.filter(p => p.status === 'verified' || p.status === 'paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Awaiting Verification</span>
              <div className="text-xl font-black text-amber-400 font-mono mt-1">
                {payments.filter(p => p.status === 'pending_verification').length} Transaction{payments.filter(p => p.status === 'pending_verification').length !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Transactions</span>
              <div className="text-xl font-black text-white font-mono mt-1">
                {payments.length}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
            {[
              { id: 'all', label: 'All Transactions', count: payments.length },
              { id: 'pending_verification', label: 'Pending Verification', count: payments.filter(p => p.status === 'pending_verification').length },
              { id: 'verified', label: 'Verified & Reconciled', count: payments.filter(p => p.status === 'verified' || p.status === 'paid').length },
              { id: 'rejected', label: 'Rejected', count: payments.filter(p => p.status === 'rejected').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPaymentFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  paymentFilter === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {payments
              .filter((p) => {
                if (paymentFilter === 'all') return true;
                if (paymentFilter === 'verified') return p.status === 'verified' || p.status === 'paid';
                return p.status === paymentFilter;
              })
              .map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs transition-all hover:border-slate-700"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-cyan-400 font-bold">{p.transaction_number || p.order_id}</span>
                      <span className="text-white font-bold text-sm">{p.customer_name}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{p.customer_email}</span>
                      {p.customer_phone && <span className="text-slate-500 text-[11px]">({p.customer_phone})</span>}
                    </div>
                    <div className="text-slate-400 flex flex-wrap items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-mono text-[10px]">
                        {p.payment_method || 'UPI'}
                      </span>
                      <span>•</span>
                      <span className="text-slate-300">
                        Ref/UTR: <span className="font-mono text-cyan-300 font-semibold">{p.utr_number || p.transaction_reference || 'N/A'}</span>
                      </span>
                      <span>•</span>
                      <span>{new Date(p.created_at).toLocaleString('en-IN')}</span>
                      {p.notes && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400 italic">"{p.notes}"</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <span className="text-lg font-extrabold text-white font-mono">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </span>

                    <div className="flex items-center gap-2">
                      {p.status === 'pending_verification' ? (
                        <>
                          <button
                            onClick={() => handleVerifyPayment(p.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Verify</span>
                          </button>
                          <button
                            onClick={() => {
                              setRejectionPaymentId(p.id);
                              setRejectionReason('');
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-rose-400 font-semibold cursor-pointer border border-rose-500/20"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : p.status === 'rejected' ? (
                        <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 font-bold uppercase border border-rose-500/30 text-[10px]">
                          Rejected
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-bold uppercase border border-emerald-500/30 text-[10px]">
                          Verified &amp; Reconciled
                        </span>
                      )}

                      <button
                        onClick={() => handleDeletePayment(p.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 cursor-pointer"
                        title="Delete Payment Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            {payments.filter((p) => {
              if (paymentFilter === 'all') return true;
              if (paymentFilter === 'verified') return p.status === 'verified' || p.status === 'paid';
              return p.status === paymentFilter;
            }).length === 0 && (
              <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-400 text-xs">
                No payments found under the "{paymentFilter.replace('_', ' ')}" filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SERVICES */}
      {activeTab === 'services' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-['Outfit']">Services Catalog</h3>
            <button
              onClick={() => setShowCreateServiceModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between text-xs space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm font-['Outfit']">{srv.title}</h4>
                    <span className="font-mono text-cyan-400 font-bold">
                      ₹{srv.base_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-1">{srv.short_description}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {srv.features.map((f, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PROJECTS & MILESTONES */}
      {activeTab === 'projects' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-cyan-400" />
                <span>Client Projects &amp; Milestones Engine</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Assign projects to client accounts, manage scope budgets, and break execution down into sequenced verifiable milestones.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingProject(null);
                setShowProjectModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add New Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((prj) => {
              const completedMilestones = prj.milestones?.filter((m) => m.status === 'completed').length || 0;
              const totalMilestones = prj.milestones?.length || 0;

              return (
                <div
                  key={prj.id}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between text-xs space-y-4 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white text-base font-['Outfit']">{prj.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] uppercase font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                            {prj.category}
                          </span>
                          {prj.customer_email && (
                            <span className="text-[11px] text-slate-400 font-mono">
                              👤 {prj.customer_email}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-emerald-400 font-bold text-sm block">
                          ₹{prj.estimated_cost.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400">Budget</span>
                      </div>
                    </div>

                    <p className="text-slate-400 line-clamp-2 leading-relaxed">{prj.description}</p>

                    {/* Progress Bar & Milestones */}
                    <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-300 font-medium">Execution Progress</span>
                        <span className="font-mono font-bold text-cyan-300">{prj.progress_percentage || 0}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
                          style={{ width: `${prj.progress_percentage || 0}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
                        <span>Milestones: {completedMilestones}/{totalMilestones} done</span>
                        <span className="uppercase font-semibold text-slate-300">
                          {prj.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1">
                      {prj.technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-900">
                    <button
                      onClick={() => {
                        setEditingProject(prj);
                        setShowProjectModal(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold cursor-pointer text-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Project &amp; Milestones</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(prj.id)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: TIME TRACKING & PROGRESS */}
      {activeTab === 'time-tracking' && (
        <AdminTimeTrackingSection onShowToast={showToast} />
      )}

      {/* TAB 7: SUPPORT TICKETS */}
      {activeTab === 'tickets' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white font-['Outfit']">
            Customer Support &amp; Maintenance Tickets
          </h3>

          <div className="space-y-4">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-bold">{t.ticket_number}</span>
                    <h4 className="font-bold text-white text-sm">{t.subject}</h4>
                    <span className="text-slate-400">({t.customer_name} • {t.customer_email})</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      t.status === 'resolved'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-amber-500/15 text-amber-300'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <p className="text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
                  {t.message}
                </p>

                {t.admin_response ? (
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200">
                    <strong className="text-cyan-400 block text-[11px] mb-0.5">Your Response:</strong>
                    <span>{t.admin_response}</span>
                  </div>
                ) : (
                  <div className="pt-2">
                    {replyTicketId === t.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={ticketReplyText}
                          onChange={(e) => setTicketReplyText(e.target.value)}
                          placeholder="Type your reply to the customer..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setReplyTicketId(null)}
                            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReplyTicket(t.id)}
                            className="px-4 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                          >
                            Send &amp; Resolve
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setReplyTicketId(t.id);
                          setTicketReplyText('');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold"
                      >
                        Reply &amp; Resolve Ticket
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: WEBSITE SETTINGS & FOUNDER PROFILE */}
      {activeTab === 'settings' && settings && (
        <form onSubmit={handleSettingsSave} className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white font-['Outfit']">
            SrijanTech Business &amp; Founder Profile Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Company Name</label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Founder Name</label>
              <input
                type="text"
                value={settings.founder_name}
                onChange={(e) => setSettings({ ...settings, founder_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Founder Role</label>
              <input
                type="text"
                value={settings.founder_role}
                onChange={(e) => setSettings({ ...settings, founder_role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Location</label>
              <input
                type="text"
                value={settings.location}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Official Business Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Phone / WhatsApp</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Official Indian UPI ID</label>
              <input
                type="text"
                value={settings.upi_id}
                onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Dedicated Executive Founder Photo Management Card */}
            <div className="sm:col-span-2 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-cyan-400" />
                      Executive Founder Photograph (Srijan Singh)
                    </h4>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                      PERMANENT STORAGE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload the real photograph of Founder Srijan Singh. Saved permanently to server filesystem and database settings. Survives page refreshes, logout/login, and production deployments.
                  </p>
                </div>

                {/* Upload Photo Button */}
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20">
                    <Upload className="w-4 h-4" />
                    <span>{photoUploading ? 'Uploading...' : 'Change Founder Photo'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      disabled={photoUploading}
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          handleFounderPhotoUpload(f);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Live Preview & Status */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="relative w-36 h-48 rounded-xl overflow-hidden border-2 border-cyan-500/40 shadow-xl flex-shrink-0 bg-slate-900">
                  <FounderPhoto
                    photoUrl={settings.founder_photo_url || '/images/founder/srijan-singh-founder.jpg'}
                    size="sm"
                    showUploadControls={false}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-950/80 border border-cyan-500/30 text-[9px] font-mono text-cyan-300">
                    LIVE
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-400">Current Database Reference:</span>
                    <code className="px-2 py-0.5 rounded bg-slate-950 font-mono text-cyan-300 text-[11px] border border-slate-800">
                      {settings.founder_photo_url || '/images/founder/srijan-singh-founder.jpg'}
                    </code>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      Formats: JPEG, PNG, WebP
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      Max Size: 10 MB
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                      Admin-Only Authorization
                    </span>
                  </div>

                  {photoUploading && (
                    <div className="flex items-center gap-2 text-cyan-400 text-xs py-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving image permanently to server and updating settings...</span>
                    </div>
                  )}

                  {photoUploadSuccess && (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs py-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Founder photo saved permanently and synced with public website!</span>
                    </div>
                  )}

                  {photoUploadError && (
                    <div className="flex items-center gap-2 text-rose-400 text-xs py-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{photoUploadError}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <label className="block text-slate-400 text-[11px] mb-1">
                      Manual Asset Path Override (if pointing to custom path):
                    </label>
                    <input
                      type="text"
                      value={settings.founder_photo_url || ''}
                      onChange={(e) => setSettings({ ...settings, founder_photo_url: e.target.value })}
                      placeholder="/images/founder/srijan-singh-founder.jpg"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Founder Bio</label>
              <textarea
                rows={3}
                value={settings.founder_bio}
                onChange={(e) => setSettings({ ...settings, founder_bio: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Company Vision</label>
              <textarea
                rows={2}
                value={settings.vision}
                onChange={(e) => setSettings({ ...settings, vision: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Company Mission</label>
              <textarea
                rows={2}
                value={settings.mission}
                onChange={(e) => setSettings({ ...settings, mission: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              Save Configuration
            </button>
          </div>
        </form>
      )}

      {/* CREATE INVOICE MODAL */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-['Outfit']">Generate New Tax Invoice</h3>
            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  value={newInvCustomer}
                  onChange={(e) => setNewInvCustomer(e.target.value)}
                  placeholder="e.g. Ramesh Verma"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newInvEmail}
                    onChange={(e) => setNewInvEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newInvPhone}
                    onChange={(e) => setNewInvPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Service / Project Item</label>
                <input
                  type="text"
                  required
                  value={newInvService}
                  onChange={(e) => setNewInvService(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Total Amount (₹)</label>
                  <input
                    type="number"
                    min="1000"
                    required
                    value={newInvAmount}
                    onChange={(e) => setNewInvAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Advance Paid (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newInvAdvance}
                    onChange={(e) => setNewInvAdvance(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newInvDueDate}
                    onChange={(e) => setNewInvDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateInvoiceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Issue Tax Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SERVICE MODAL */}
      {showCreateServiceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-white font-['Outfit']">Add New Service</h3>
            <form onSubmit={handleCreateService} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={newServiceTitle}
                  onChange={(e) => setNewServiceTitle(e.target.value)}
                  placeholder="e.g. AI-Powered CRM"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Base Price (INR ₹)</label>
                <input
                  type="number"
                  required
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Summary of engineering deliverable"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Features (One per line)</label>
                <textarea
                  rows={3}
                  value={newServiceFeatures}
                  onChange={(e) => setNewServiceFeatures(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateServiceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {showCreateProjectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-white font-['Outfit']">Add Prototype Concept</h3>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  placeholder="e.g. Hospital OPD Queuing Portal"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={newProjCategory}
                    onChange={(e) => setNewProjCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Est. Cost (₹)</label>
                  <input
                    type="number"
                    value={newProjCost}
                    onChange={(e) => setNewProjCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Description / Scope</label>
                <textarea
                  rows={2}
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={newProjTech}
                  onChange={(e) => setNewProjTech(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Save Prototype
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Register New Customer Account</span>
              </h3>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra Sharma"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Client Email *</label>
                  <input
                    type="email"
                    required
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    placeholder="ramesh@sharmatraders.in"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile / WhatsApp</label>
                  <input
                    type="tel"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="9839012345"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={newCustCompany}
                    onChange={(e) => setNewCustCompany(e.target.value)}
                    placeholder="Sharma Enterprises"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City / Hub</label>
                  <input
                    type="text"
                    value={newCustCity}
                    onChange={(e) => setNewCustCity(e.target.value)}
                    placeholder="Varanasi"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Internal Notes &amp; Scope</label>
                <textarea
                  rows={2}
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  placeholder="e.g. Needs wholesale billing software with thermal barcode printing..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-md"
                >
                  Register Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal for Viewing/Printing */}
      {selectedInvoice && (
        <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}

      {/* Admin Payment Record/Edit Modal */}
      {showPaymentModal && (
        <AdminPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSaved={() => {
            setShowPaymentModal(false);
            loadAllData();
            showToast('Payment recorded successfully');
          }}
          defaultCustomerEmail={paymentModalDefaults.customerEmail}
          defaultCustomerName={paymentModalDefaults.customerName}
          defaultProjectId={paymentModalDefaults.projectId}
          defaultInvoiceId={paymentModalDefaults.invoiceId}
          defaultAmount={paymentModalDefaults.amount}
        />
      )}

      {/* Admin Project & Milestones Modal */}
      {showProjectModal && (
        <AdminProjectModal
          isOpen={showProjectModal}
          onClose={() => setShowProjectModal(false)}
          onProjectSaved={() => {
            setShowProjectModal(false);
            loadAllData();
            showToast('Project & milestones saved successfully');
          }}
          project={editingProject}
        />
      )}

      {/* Admin Full Tax Invoice Editor Modal */}
      {showAdminInvoiceModal && (
        <AdminInvoiceModal
          isOpen={showAdminInvoiceModal}
          onClose={() => setShowAdminInvoiceModal(false)}
          onInvoiceSaved={() => {
            setShowAdminInvoiceModal(false);
            loadAllData();
            showToast('Invoice saved successfully');
          }}
          editingInvoice={editingInvoice}
          defaultCustomer={defaultInvoiceCustomer}
        />
      )}

      {/* Customer 360 Degree Dossier Modal */}
      {selectedCustomerForDetail && (
        <CustomerDetailModal
          isOpen={Boolean(selectedCustomerForDetail)}
          onClose={() => setSelectedCustomerForDetail(null)}
          customer={selectedCustomerForDetail}
          onRecordPayment={(cust) => {
            setSelectedCustomerForDetail(null);
            setPaymentModalDefaults({
              customerEmail: cust.email,
              customerName: cust.full_name,
            });
            setShowPaymentModal(true);
          }}
          onIssueInvoice={(cust) => {
            setSelectedCustomerForDetail(null);
            setDefaultInvoiceCustomer({
              name: cust.full_name,
              email: cust.email,
              phone: cust.phone,
              address: cust.city ? `${cust.city}, UP` : 'Varanasi, UP',
            });
            setEditingInvoice(null);
            setShowAdminInvoiceModal(true);
          }}
        />
      )}

      {/* Payment Rejection Dialog */}
      {rejectionPaymentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-['Outfit']">Reject Payment Verification</h3>
              <button
                onClick={() => setRejectionPaymentId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Please provide a reason for rejecting this payment order. This note will be recorded in the audit log and notified to the client.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Rejection</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., UTR not matching bank statement, incorrect amount entered..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectionPaymentId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRejectPayment(rejectionPaymentId, rejectionReason)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
