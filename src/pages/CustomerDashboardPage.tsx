import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Invoice,
  PaymentTransaction,
  Project,
  ProjectEnquiry,
  SupportTicket,
  NotificationItem,
  TimeEntry,
} from '../types';
import {
  getInvoices,
  getPaymentTransactions,
  getProjects,
  getTimeEntries,
  getEnquiries,
  getSupportTickets,
  createSupportTicket,
  getNotifications,
  markNotificationRead,
  saveCustomer,
  getCustomerByEmail,
} from '../services/db';
import { InvoiceModal } from '../components/InvoiceModal';
import { CustomerProjectsSection } from '../components/CustomerProjectsSection';
import {
  User,
  FileText,
  CreditCard,
  Layers,
  HelpCircle,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  MessageSquare,
  Sparkles,
  FolderGit2,
  Bell,
  Activity,
  Calendar,
  LogOut,
  Save,
  Check,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

interface CustomerDashboardPageProps {
  user: UserProfile;
  onNavigateToPayment: (amount?: number, note?: string) => void;
  onLogout?: () => void;
  onNavigate?: (tab: string) => void;
}

type TabType =
  | 'overview'
  | 'projects'
  | 'progress'
  | 'time'
  | 'invoices'
  | 'payments'
  | 'notifications'
  | 'profile';

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({
  user,
  onNavigateToPayment,
  onLogout,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [enquiries, setEnquiries] = useState<ProjectEnquiry[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Profile Form state
  const [profileName, setProfileName] = useState(user.full_name || '');
  const [profilePhone, setProfilePhone] = useState(user.phone || '');
  const [profileWhatsapp, setProfileWhatsapp] = useState(user.whatsapp || user.phone || '');
  const [profileCompany, setProfileCompany] = useState(user.company_name || '');
  const [profileAddress, setProfileAddress] = useState(user.address || '');
  const [profileCity, setProfileCity] = useState(user.city || 'Varanasi');
  const [profileState, setProfileState] = useState(user.state || 'Uttar Pradesh');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  // Support Ticket Form state
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  useEffect(() => {
    loadCustomerData();
  }, [user]);

  const loadCustomerData = async () => {
    const cleanEmail = user.email.toLowerCase().trim();

    const [allInvoices, allPayments, allProjects, allTime, allEnquiries, allTickets, allNotifs] =
      await Promise.all([
        getInvoices(),
        getPaymentTransactions(),
        getProjects(),
        getTimeEntries(),
        getEnquiries(),
        getSupportTickets(),
        getNotifications(user.id, cleanEmail),
      ]);

    // STRICT CUSTOMER DATA ISOLATION:
    // Only filter records matching the authenticated user's email or ID
    const userInvoices = allInvoices.filter(
      (inv) => inv.customer_email && inv.customer_email.toLowerCase().trim() === cleanEmail
    );
    const userPayments = allPayments.filter(
      (p) => p.customer_email && p.customer_email.toLowerCase().trim() === cleanEmail
    );
    const userProjects = allProjects.filter(
      (p) => p.customer_email && p.customer_email.toLowerCase().trim() === cleanEmail
    );
    const userTime = allTime.filter(
      (t) => t.customer_email && t.customer_email.toLowerCase().trim() === cleanEmail
    );
    const userEnquiries = allEnquiries.filter(
      (e) => e.email && e.email.toLowerCase().trim() === cleanEmail
    );
    const userTickets = allTickets.filter(
      (t) => t.customer_email && t.customer_email.toLowerCase().trim() === cleanEmail
    );

    setInvoices(userInvoices);
    setPayments(userPayments);
    setProjects(userProjects);
    setTimeEntries(userTime);
    setEnquiries(userEnquiries);
    setTickets(userTickets);
    setNotifications(allNotifs);

    // Populate profile from customer record if available
    const existingCust = await getCustomerByEmail(cleanEmail);
    if (existingCust) {
      if (existingCust.full_name) setProfileName(existingCust.full_name);
      if (existingCust.phone) setProfilePhone(existingCust.phone);
      if (existingCust.whatsapp) setProfileWhatsapp(existingCust.whatsapp);
      if (existingCust.company_name) setProfileCompany(existingCust.company_name);
      if (existingCust.address) setProfileAddress(existingCust.address);
      if (existingCust.city) setProfileCity(existingCust.city);
      if (existingCust.state) setProfileState(existingCust.state);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage('');

    try {
      await saveCustomer({
        full_name: profileName.trim(),
        email: user.email.toLowerCase().trim(),
        phone: profilePhone.trim(),
        whatsapp: profileWhatsapp.trim(),
        company_name: profileCompany.trim(),
        address: profileAddress.trim(),
        city: profileCity.trim(),
        state: profileState.trim(),
      });
      setProfileMessage('Profile information saved successfully!');
      setTimeout(() => setProfileMessage(''), 3500);
    } catch {
      setProfileMessage('Failed to update profile. Please retry.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) return;

    await createSupportTicket({
      customer_name: profileName || user.full_name,
      customer_email: user.email,
      customer_phone: profilePhone || user.phone || '7269068483',
      subject: newTicketSubject.trim(),
      message: newTicketMessage.trim(),
      priority: 'medium',
    });

    setNewTicketSubject('');
    setNewTicketMessage('');
    setShowNewTicketModal(false);
    loadCustomerData();
  };

  const handleMarkNotificationRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const [paymentFilter, setPaymentFilter] = useState<'all' | 'verified' | 'pending'>('all');

  // KPI Calculations
  const activeProjectsCount = projects.filter((p) => p.status !== 'completed').length;
  const completedProjectsCount = projects.filter((p) => p.status === 'completed').length;

  const totalProjectBudget = projects.reduce((acc, curr) => acc + (curr.estimated_cost || 0), 0);
  const totalInvoicedAmount = invoices.reduce((acc, curr) => acc + (curr.total_amount || 0), 0);
  const totalProjectAmount = Math.max(totalProjectBudget, totalInvoicedAmount);

  const totalVerifiedPaid = payments
    .filter((p) => p.status === 'verified' || p.status === 'paid')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  // Exact Formula: Amount Pending = Total Project Amount - Validated Payments (strictly >= 0)
  const amountPending = Math.max(0, totalProjectAmount - totalVerifiedPaid);

  // Next payment due date (earliest due date for invoices with remaining balance > 0)
  const pendingInvoices = invoices
    .filter((inv) => (inv.remaining_balance || 0) > 0 && inv.due_date && inv.status !== 'cancelled')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  const nextPaymentDue =
    pendingInvoices.length > 0 ? pendingInvoices[0].due_date : null;

  const unreadNotificationsCount = notifications.filter((n) => !n.is_read).length;

  const navTabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: Layers },
    { id: 'projects', label: 'My Projects', icon: FolderGit2, count: projects.length },
    { id: 'progress', label: 'Project Progress', icon: Activity },
    { id: 'time', label: 'Time Summary', icon: Clock },
    { id: 'invoices', label: 'Tax Invoices', icon: FileText, count: invoices.length },
    { id: 'payments', label: 'UPI Payments', icon: CreditCard, count: payments.length },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      count: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Welcome Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-500 flex items-center justify-center text-slate-950 font-extrabold text-2xl font-['Outfit'] shadow-lg shadow-sky-500/20">
            {profileName ? profileName[0].toUpperCase() : 'C'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                Welcome, {profileName || user.full_name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Client
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {user.email} • {profileCompany || profileCity || 'Varanasi, UP'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateToPayment(5000, 'Milestone Advance Payment')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Make UPI Payment</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700/60 text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive
                      ? 'bg-slate-950 text-cyan-300'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ===================== TAB 1: OVERVIEW ===================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 6 Required Customer Summary KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                Active Projects
              </span>
              <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-2">
                {activeProjectsCount}
              </div>
              <span className="text-[10px] text-slate-500 mt-1">In design/engineering</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                Completed
              </span>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-2">
                {completedProjectsCount}
              </div>
              <span className="text-[10px] text-slate-500 mt-1">Delivered &amp; live</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                Total Invoiced
              </span>
              <div className="text-2xl font-extrabold text-white font-mono mt-2 truncate">
                ₹{totalInvoicedAmount.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-500 mt-1">Across formal invoices</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                Amount Paid
              </span>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-2 truncate">
                ₹{totalVerifiedPaid.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-500 mt-1">Verified via Indian UPI</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                Amount Pending
              </span>
              <div className="text-2xl font-extrabold text-amber-400 font-mono mt-2 truncate">
                ₹{amountPending.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-500 mt-1">Remaining balance</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                Next Due Date
              </span>
              <div className="text-sm font-extrabold text-sky-400 font-mono mt-2 truncate">
                {nextPaymentDue
                  ? new Date(nextPaymentDue).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'None Due'}
              </div>
              <span className="text-[10px] text-slate-500 mt-1">Scheduled milestone</span>
            </div>
          </div>

          {/* Pending Payment Reminder if Balance is Due */}
          {amountPending > 0 && (
            <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Pending Milestone Balance: ₹{amountPending.toLocaleString('en-IN')}
                  </h4>
                  <p className="text-xs text-amber-200/80 mt-0.5">
                    {nextPaymentDue
                      ? `Earliest invoice payment due on ${new Date(nextPaymentDue).toLocaleDateString('en-IN')}.`
                      : 'Please clear your milestone balance to proceed with stage deployment.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToPayment(amountPending, 'Clear Invoice Balance')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all whitespace-nowrap cursor-pointer"
              >
                Pay Outstanding Balance →
              </button>
            </div>
          )}

          {/* Active Projects Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-cyan-400" />
                <span>My Active Projects</span>
              </h3>
              <button
                onClick={() => setActiveTab('projects')}
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                View Full Roadmap →
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-400">
                  No active projects assigned yet to <strong>{user.email}</strong>. Once your project
                  brief is confirmed by SrijanTech, your active progress bar and roadmap will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => {
                  const progress =
                    proj.progress_percentage !== undefined
                      ? proj.progress_percentage
                      : proj.status === 'completed'
                      ? 100
                      : 65;
                  return (
                    <div
                      key={proj.id}
                      className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-base font-bold text-white">{proj.title}</h4>
                          <span className="text-[11px] text-slate-400">
                            {proj.project_type || proj.category || 'Software Solution'}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                          {proj.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-400">Milestone Progress</span>
                          <span className="text-cyan-400 font-bold">{progress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
                        <span>Expected: {proj.expected_completion || 'Scheduled Delivery'}</span>
                        <button
                          onClick={() => setActiveTab('progress')}
                          className="text-cyan-400 hover:underline font-semibold"
                        >
                          View Milestones →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Support & Contact Line */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm">Need Help with Your Project?</h4>
              <p className="text-slate-400">
                Direct ticketing line with Srijan Singh in Varanasi. Quick response within 2 hours.
              </p>
            </div>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
            >
              Open Support Ticket
            </button>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: MY PROJECTS ===================== */}
      {activeTab === 'projects' && (
        <CustomerProjectsSection customerEmail={user.email} defaultView="all" />
      )}

      {/* ===================== TAB 3: PROJECT PROGRESS ===================== */}
      {activeTab === 'progress' && (
        <CustomerProjectsSection customerEmail={user.email} defaultView="progress" />
      )}

      {/* ===================== TAB 4: TIME SUMMARY ===================== */}
      {activeTab === 'time' && (
        <CustomerProjectsSection customerEmail={user.email} defaultView="time" />
      )}

      {/* ===================== TAB 5: INVOICES ===================== */}
      {activeTab === 'invoices' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">Issued Tax Invoices</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Official Indian GST invoices issued by SrijanTech with itemized breakdowns and
                instant PDF export.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              {invoices.length} Invoice{invoices.length !== 1 ? 's' : ''}
            </span>
          </div>

          {invoices.length === 0 ? (
            <div className="p-12 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">No data available yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No invoices have been issued for <strong>{user.email}</strong>. When a milestone or
                project advance is initiated, your tax invoice will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px]">
                  <tr className="border-b border-slate-800">
                    <th className="py-3 px-3">Invoice #</th>
                    <th className="py-3 px-3">Service / Milestone</th>
                    <th className="py-3 px-3">Issue Date</th>
                    <th className="py-3 px-3">Due Date</th>
                    <th className="py-3 px-3 text-right">Total (Inc. GST)</th>
                    <th className="py-3 px-3 text-right">Balance Due</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-3 font-mono font-bold text-cyan-400">
                        {inv.invoice_number}
                      </td>
                      <td className="py-3 px-3 text-white font-medium">{inv.service_name}</td>
                      <td className="py-3 px-3 text-slate-400 font-mono">{inv.issue_date}</td>
                      <td className="py-3 px-3 text-slate-400 font-mono">
                        {inv.due_date || 'Milestone Delivery'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-white">
                        ₹{inv.total_amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                        ₹{inv.remaining_balance.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            inv.status === 'paid'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                        >
                          View / Print PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 6: PAYMENTS ===================== */}
      {activeTab === 'payments' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                <span>Payment &amp; Financial Ledger</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time tracking of project valuations, verified UPI transfers, and outstanding balances.
              </p>
            </div>
            <button
              onClick={() => onNavigateToPayment(5000, 'Milestone Advance Payment')}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <CreditCard className="w-4 h-4" />
              <span>+ New UPI Payment</span>
            </button>
          </div>

          {/* 4 Required Payment Financial Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Project Amount */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Total Project Amount
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-2 truncate">
                ₹{totalProjectAmount.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Contracted project value</span>
            </div>

            {/* Amount Paid */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-900/30">
              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                Amount Paid
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono mt-2 truncate">
                ₹{totalVerifiedPaid.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-emerald-500/80 mt-1 block">Validated incoming payments</span>
            </div>

            {/* Amount Pending (Strictly Total - Validated Payments) */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-amber-900/30">
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                Amount Pending
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono mt-2 truncate">
                ₹{amountPending.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-amber-500/80 mt-1 block">Total − Validated Payments</span>
            </div>

            {/* Next Due Date */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-sky-900/30">
              <span className="text-[10px] text-sky-400 uppercase font-bold tracking-wider">
                Next Due Date
              </span>
              <div className="text-base sm:text-lg font-extrabold text-sky-300 font-mono mt-2 truncate">
                {nextPaymentDue
                  ? new Date(nextPaymentDue).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'No Pending Due'}
              </div>
              <span className="text-[10px] text-sky-500/80 mt-1 block">
                {nextPaymentDue ? 'Earliest invoice milestone' : 'All accounts settled'}
              </span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setPaymentFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                paymentFilter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Payments ({payments.length})
            </button>
            <button
              onClick={() => setPaymentFilter('verified')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                paymentFilter === 'verified'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Verified ({payments.filter((p) => p.status === 'verified' || p.status === 'paid').length})
            </button>
            <button
              onClick={() => setPaymentFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                paymentFilter === 'pending'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending ({payments.filter((p) => p.status !== 'verified' && p.status !== 'paid').length})
            </button>
          </div>

          {/* Payment List */}
          {payments.length === 0 ? (
            <div className="p-12 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <CreditCard className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">No data available yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No transactions logged under <strong>{user.email}</strong>. Use the button above to initiate your milestone payment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments
                .filter((p) => {
                  if (paymentFilter === 'verified') return p.status === 'verified' || p.status === 'paid';
                  if (paymentFilter === 'pending') return p.status !== 'verified' && p.status !== 'paid';
                  return true;
                })
                .map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1.5 grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-cyan-400 font-bold">
                          {p.transaction_number || p.order_id}
                        </span>
                        <span className="text-white font-semibold">{p.transaction_note || p.notes || 'Project Payment'}</span>
                        <span className="px-2 py-0.5 rounded uppercase font-mono text-[9px] bg-slate-800 text-slate-300">
                          Method: {p.payment_method || 'UPI'}
                        </span>
                      </div>
                      <div className="text-slate-400 flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="font-mono">Reference/UTR: <strong className="text-slate-200">{p.utr_number || p.transaction_reference || 'Awaiting UTR'}</strong></span>
                        <span>•</span>
                        <span>UPI: {p.upi_id || '7269068483@ptyes'}</span>
                        <span>•</span>
                        <span>Date: {new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        {p.paid_at && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400">Verified On: {new Date(p.paid_at).toLocaleDateString('en-IN')}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-base font-extrabold text-white font-mono block">
                          ₹{p.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">INR</span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          p.status === 'verified' || p.status === 'paid'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : p.status === 'rejected'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {p.status === 'verified' || p.status === 'paid'
                          ? 'Verified'
                          : p.status === 'rejected'
                          ? 'Rejected'
                          : 'Pending Verification'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 7: NOTIFICATIONS ===================== */}
      {activeTab === 'notifications' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Bell className="w-5 h-5 text-cyan-400" />
                <span>Account &amp; Project Notifications</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real status notifications triggered by invoice issues, payments, and project milestone updates.
              </p>
            </div>
            {unreadNotificationsCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-bold border border-cyan-500/30">
                {unreadNotificationsCount} Unread
              </span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-12 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <Bell className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">No data available yet</h4>
              <p className="text-xs text-slate-400">
                You have no pending notifications. When your project enters a new stage or an invoice
                is generated, you will be notified here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkNotificationRead(notif.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    notif.is_read
                      ? 'bg-slate-950 border-slate-800 text-slate-400'
                      : 'bg-slate-900/90 border-cyan-500/40 text-slate-200 shadow-md shadow-cyan-500/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        notif.is_read ? 'bg-slate-600' : 'bg-cyan-400 animate-pulse'
                      }`}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        {new Date(notif.created_at).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {!notif.is_read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkNotificationRead(notif.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold shrink-0"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 8: PROFILE SETTINGS ===================== */}
      {activeTab === 'profile' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              <span>Customer Profile &amp; Contact Details</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Keep your contact details up to date for GST invoices, WhatsApp project updates, and
              delivery handovers.
            </p>
          </div>

          {profileMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{profileMessage}</span>
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4 max-w-2xl text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Email Address (Primary Account)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Primary Mobile Number
                </label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="e.g. 9839012345"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  WhatsApp Number (For Alerts)
                </label>
                <input
                  type="tel"
                  value={profileWhatsapp}
                  onChange={(e) => setProfileWhatsapp(e.target.value)}
                  placeholder="e.g. 9839012345"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Company / Organization Name
              </label>
              <input
                type="text"
                value={profileCompany}
                onChange={(e) => setProfileCompany(e.target.value)}
                placeholder="e.g. Verma Logistics & Retail"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Registered Billing Address
              </label>
              <input
                type="text"
                value={profileAddress}
                onChange={(e) => setProfileAddress(e.target.value)}
                placeholder="e.g. Godowlia, Varanasi, UP - 221001"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">City</label>
                <input
                  type="text"
                  value={profileCity}
                  onChange={(e) => setProfileCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">State</label>
                <input
                  type="text"
                  value={profileState}
                  onChange={(e) => setProfileState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileSaving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Support Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Open a Maintenance &amp; Support Ticket
            </h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  placeholder="e.g. Domain SSL renewal or Bug on checkout"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  Issue Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={newTicketMessage}
                  onChange={(e) => setNewTicketMessage(e.target.value)}
                  placeholder="Provide full details of what is happening or what needs to be changed..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md cursor-pointer"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onPayNow={(inv) =>
            onNavigateToPayment(inv.remaining_balance, `Invoice ${inv.invoice_number} Balance`)
          }
        />
      )}
    </div>
  );
};
