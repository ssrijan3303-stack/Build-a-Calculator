import React, { useState } from 'react';
import { Customer, Project, Invoice, Payment } from '../types';
import { recordManualPayment } from '../services/db';
import { X, CreditCard, CheckCircle2 } from 'lucide-react';

interface AdminPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  projects: Project[];
  invoices: Invoice[];
  onPaymentRecorded: () => void;
  initialCustomerEmail?: string;
}

export const AdminPaymentModal: React.FC<AdminPaymentModalProps> = ({
  isOpen,
  onClose,
  customers,
  projects,
  invoices,
  onPaymentRecorded,
  initialCustomerEmail,
}) => {
  const [selectedEmail, setSelectedEmail] = useState(initialCustomerEmail || '');
  const [customerName, setCustomerName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [amount, setAmount] = useState<number>(5000);
  const [paymentMethod, setPaymentMethod] = useState<Payment['payment_method']>('upi');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Payment['status']>('verified');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // When initial customer changes
  React.useEffect(() => {
    if (initialCustomerEmail) {
      setSelectedEmail(initialCustomerEmail);
      const match = customers.find(
        (c) => c.email.toLowerCase().trim() === initialCustomerEmail.toLowerCase().trim()
      );
      if (match) setCustomerName(match.full_name);
    }
  }, [initialCustomerEmail, customers]);

  if (!isOpen) return null;

  const handleCustomerChange = (email: string) => {
    setSelectedEmail(email);
    const cust = customers.find((c) => c.email.toLowerCase().trim() === email.toLowerCase().trim());
    if (cust) {
      setCustomerName(cust.full_name);
    }
    setProjectId('');
    setInvoiceId('');
  };

  const filteredProjects = selectedEmail
    ? projects.filter(
        (p) => p.customer_email && p.customer_email.toLowerCase().trim() === selectedEmail.toLowerCase().trim()
      )
    : projects;

  const filteredInvoices = selectedEmail
    ? invoices.filter(
        (i) => i.customer_email && i.customer_email.toLowerCase().trim() === selectedEmail.toLowerCase().trim()
      )
    : invoices;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setError('Amount must be greater than zero');
      return;
    }
    if (!selectedEmail && !customerName) {
      setError('Customer name or email is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await recordManualPayment({
        customer_name: customerName || 'Client',
        customer_email: selectedEmail || 'customer@srijantech.in',
        project_id: projectId || undefined,
        invoice_id: invoiceId || undefined,
        amount: Number(amount),
        payment_method: paymentMethod,
        transaction_reference: reference.trim() || undefined,
        notes: notes.trim() || undefined,
        status,
      });

      onPaymentRecorded();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">Record Payment</h3>
              <p className="text-xs text-slate-400">Log an incoming payment (UPI, Bank, Cash, Cheque)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
              {error}
            </div>
          )}

          {/* Customer select */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Customer Account</label>
            <select
              value={selectedEmail}
              onChange={(e) => handleCustomerChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="">-- Choose Existing Customer or Enter Below --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.email}>
                  {c.full_name} ({c.email})
                </option>
              ))}
            </select>
          </div>

          {!selectedEmail && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Verma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Customer Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh@example.com"
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {/* Link Project or Invoice */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Link to Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- Optional: Project --</option>
                {filteredProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Link to Invoice</label>
              <select
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- Optional: Invoice --</option>
                {filteredInvoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoice_number} (Due: ₹{inv.remaining_balance.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount & Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Amount (INR ₹) *</label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Payment Method *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as Payment['payment_method'])}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                <option value="bank_transfer">Bank NEFT / RTGS / IMPS</option>
                <option value="cash">Cash in Person</option>
                <option value="cheque">Cheque</option>
                <option value="gateway_card">Card / Gateway</option>
                <option value="manual">Manual Journal Entry</option>
              </select>
            </div>
          </div>

          {/* Reference & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Reference / UTR / Cheque #</label>
              <input
                type="text"
                placeholder="e.g. 523190849201"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Verification Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Payment['status'])}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="verified">Verified (Immediate Balance Credit)</option>
                <option value="pending_verification">Pending Verification</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Internal Notes / Description</label>
            <input
              type="text"
              placeholder="e.g. Milestone 1 milestone advance received via HDFC"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-600/20 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Recording...' : 'Record Payment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
