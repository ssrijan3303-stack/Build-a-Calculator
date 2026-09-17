import React, { useState } from 'react';
import { Customer, Project, Invoice, Payment } from '../types';
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  FolderGit2,
  FileText,
  CreditCard,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  projects: Project[];
  invoices: Invoice[];
  payments: Payment[];
  onUpdateStatus: (customerId: string, status: 'active' | 'inactive') => void;
  onOpenProjectModal: (customerEmail: string) => void;
  onOpenInvoiceModal: (customerEmail: string) => void;
  onOpenPaymentModal: (customerEmail: string) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  isOpen,
  onClose,
  customer,
  projects,
  invoices,
  payments,
  onUpdateStatus,
  onOpenProjectModal,
  onOpenInvoiceModal,
  onOpenPaymentModal,
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'invoices' | 'payments'>('projects');

  if (!isOpen || !customer) return null;

  const email = customer.email.toLowerCase().trim();

  const customerProjects = projects.filter(
    (p) => p.customer_email && p.customer_email.toLowerCase().trim() === email
  );
  const customerInvoices = invoices.filter(
    (i) => i.customer_email && i.customer_email.toLowerCase().trim() === email
  );
  const customerPayments = payments.filter(
    (p) => p.customer_email && p.customer_email.toLowerCase().trim() === email
  );

  // Financial calculations
  const totalProjectBudget = customerProjects.reduce((sum, p) => sum + (p.estimated_cost || 0), 0);
  const totalInvoiced = customerInvoices.reduce((sum, i) => sum + (i.total_amount || 0), 0);
  const effectiveTotal = Math.max(totalProjectBudget, totalInvoiced);

  const validatedPayments = customerPayments.filter(
    (p) => p.status === 'verified' || p.status === 'paid'
  );
  const amountPaid = validatedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const amountPending = Math.max(0, effectiveTotal - amountPaid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-lg font-['Outfit'] border border-cyan-500/20">
              {customer.full_name?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white font-['Outfit']">{customer.full_name}</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    customer.status === 'active'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {customer.status || 'active'}
                </span>
              </div>
              <p className="text-xs text-slate-400">{customer.company_name || 'Client Account'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateStatus(customer.id, customer.status === 'active' ? 'inactive' : 'active')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                customer.status === 'active'
                  ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                  : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              {customer.status === 'active' ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Deactivate</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Activate</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto grow text-xs">
          {/* Contact Details Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1 mb-0.5">
                <Mail className="w-3 h-3 text-cyan-400" />
                <span>Email</span>
              </div>
              <div className="font-mono text-white truncate">{customer.email}</div>
            </div>

            <div>
              <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1 mb-0.5">
                <Phone className="w-3 h-3 text-cyan-400" />
                <span>Phone</span>
              </div>
              <div className="font-mono text-white">{customer.phone || 'Not provided'}</div>
            </div>

            <div>
              <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1 mb-0.5">
                <Building2 className="w-3 h-3 text-cyan-400" />
                <span>Company</span>
              </div>
              <div className="text-white truncate">{customer.company_name || 'Individual'}</div>
            </div>

            <div>
              <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1 mb-0.5">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>Location</span>
              </div>
              <div className="text-white">{customer.city ? `${customer.city}, ${customer.state || 'UP'}` : 'Varanasi, UP'}</div>
            </div>
          </div>

          {/* Financial Summary KPIs */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[11px] mb-1">Total Project Value</div>
              <div className="text-xl font-bold font-mono text-white">
                ₹{effectiveTotal.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">{customerProjects.length} projects registered</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-900/30">
              <div className="text-slate-400 text-[11px] mb-1">Amount Paid</div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                ₹{amountPaid.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-emerald-500/80 mt-1">{validatedPayments.length} verified transactions</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-900/30">
              <div className="text-slate-400 text-[11px] mb-1">Amount Pending</div>
              <div className="text-xl font-bold font-mono text-amber-400">
                ₹{amountPending.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-amber-500/80 mt-1">Pending verification / balance</div>
            </div>
          </div>

          {/* Sub-Tabs & Actions */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                  activeTab === 'projects'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Projects ({customerProjects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('invoices')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                  activeTab === 'invoices'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Invoices ({customerInvoices.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('payments')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                  activeTab === 'payments'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Payments ({customerPayments.length})</span>
              </button>
            </div>

            {/* Quick Action Button */}
            {activeTab === 'projects' && (
              <button
                onClick={() => onOpenProjectModal(customer.email)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assign Project</span>
              </button>
            )}

            {activeTab === 'invoices' && (
              <button
                onClick={() => onOpenInvoiceModal(customer.email)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Issue Invoice</span>
              </button>
            )}

            {activeTab === 'payments' && (
              <button
                onClick={() => onOpenPaymentModal(customer.email)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Record Payment</span>
              </button>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === 'projects' && (
            <div className="space-y-3">
              {customerProjects.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
                  No projects linked to this customer yet.
                </div>
              ) : (
                customerProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-bold text-white text-sm mb-1">{p.title}</div>
                      <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                        <span>Category: {p.category}</span>
                        <span>•</span>
                        <span>Budget: ₹{(p.estimated_cost || 0).toLocaleString('en-IN')}</span>
                        <span>•</span>
                        <span className="text-emerald-400">Paid: ₹{(p.paid_amount || 0).toLocaleString('en-IN')}</span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-48 bg-slate-800 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-cyan-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, p.progress_percentage || 0)}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-cyan-300">
                        {p.status.replace(/_/g, ' ')}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">
                        {p.progress_percentage || 0}% Done
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-3">
              {customerInvoices.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
                  No invoices issued for this customer yet.
                </div>
              ) : (
                customerInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400">{inv.invoice_number}</span>
                        <span className="text-white font-medium">{inv.service_name}</span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Due: {inv.due_date} • Items: {inv.items?.length || 1}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-white">
                        ₹{inv.total_amount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono">
                        Due: ₹{inv.remaining_balance.toLocaleString('en-IN')}
                      </div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase mt-1 ${
                          inv.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : inv.status === 'partially_paid'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-3">
              {customerPayments.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
                  No payments recorded for this customer yet.
                </div>
              ) : (
                customerPayments.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{pay.order_id}</span>
                        <span className="text-slate-400 uppercase text-[10px] bg-slate-800 px-2 py-0.5 rounded">
                          {pay.payment_method}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-1 font-mono">
                        Ref / UTR: {pay.transaction_reference || 'N/A'} • {new Date(pay.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-400 text-sm">
                        ₹{pay.amount.toLocaleString('en-IN')}
                      </div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase mt-1 ${
                          pay.status === 'verified' || pay.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : pay.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {pay.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
