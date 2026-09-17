import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceItem, Customer, Project, InvoiceStatus } from '../types';
import { saveInvoice } from '../services/db';
import { X, FileText, Plus, Trash2, CheckCircle2, Calculator } from 'lucide-react';

interface AdminInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice | null;
  customers: Customer[];
  projects: Project[];
  onInvoiceSaved: (saved: Invoice) => void;
  initialCustomerEmail?: string;
}

export const AdminInvoiceModal: React.FC<AdminInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  customers,
  projects,
  onInvoiceSaved,
  initialCustomerEmail,
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('Varanasi, UP');
  const [projectId, setProjectId] = useState('');
  const [serviceName, setServiceName] = useState('Custom Web Application');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [taxRate, setTaxRate] = useState<number>(18);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [advancePaid, setAdvancePaid] = useState<number>(0);
  const [status, setStatus] = useState<InvoiceStatus>('issued');
  const [notes, setNotes] = useState('UPI Payment: 7269068483@ptyes (SrijanTech Varanasi)');

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: 'Full-Stack Web Development', quantity: 1, unit_price: 25000, amount: 25000 },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (invoice) {
      setInvoiceNumber(invoice.invoice_number);
      setCustomerEmail(invoice.customer_email || '');
      setCustomerName(invoice.customer_name || '');
      setCustomerPhone(invoice.customer_phone || '');
      setCustomerAddress(invoice.customer_address || 'Varanasi, UP');
      setProjectId(invoice.project_id || '');
      setServiceName(invoice.service_name || 'Web Engineering Services');
      setIssueDate(invoice.issue_date);
      setDueDate(invoice.due_date);
      setTaxRate(invoice.tax_rate ?? 18);
      setDiscountAmount(invoice.discount_amount || 0);
      setAdvancePaid(invoice.advance_paid || 0);
      setStatus(invoice.status || 'issued');
      setNotes(invoice.notes || 'UPI Payment: 7269068483@ptyes (SrijanTech Varanasi)');
      setItems(
        invoice.items && invoice.items.length > 0
          ? invoice.items.map((i) => ({ ...i, amount: (i.quantity || 1) * (i.unit_price || 0) }))
          : [{ description: invoice.service_name || 'Development Services', quantity: 1, unit_price: invoice.subtotal || 25000, amount: invoice.subtotal || 25000 }]
      );
    } else {
      const year = new Date().getFullYear();
      const randomSeq = Math.floor(100 + Math.random() * 900);
      setInvoiceNumber(`ST-${year}-${randomSeq}`);
      setCustomerEmail(initialCustomerEmail || '');
      const match = customers.find((c) => c.email.toLowerCase() === (initialCustomerEmail || '').toLowerCase());
      if (match) {
        setCustomerName(match.full_name);
        setCustomerPhone(match.phone || '');
        setCustomerAddress(match.address || `${match.city || 'Varanasi'}, UP`);
      } else {
        setCustomerName('');
        setCustomerPhone('');
        setCustomerAddress('Varanasi, UP');
      }
      setProjectId('');
      setServiceName('Custom Web Application');
      setIssueDate(new Date().toISOString().split('T')[0]);
      setDueDate(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
      setTaxRate(18);
      setDiscountAmount(0);
      setAdvancePaid(0);
      setStatus('issued');
      setNotes('UPI Payment: 7269068483@ptyes (SrijanTech Varanasi)');
      setItems([
        { description: 'Web Application Development - Milestone 1', quantity: 1, unit_price: 25000, amount: 25000 },
      ]);
    }
  }, [invoice, isOpen, initialCustomerEmail, customers]);

  if (!isOpen) return null;

  const handleCustomerSelect = (email: string) => {
    setCustomerEmail(email);
    const match = customers.find((c) => c.email.toLowerCase().trim() === email.toLowerCase().trim());
    if (match) {
      setCustomerName(match.full_name);
      setCustomerPhone(match.phone || '');
      setCustomerAddress(match.address || `${match.city || 'Varanasi'}, UP`);
    }
    // Auto-select project if customer has one
    const custProjects = projects.filter(
      (p) => p.customer_email && p.customer_email.toLowerCase().trim() === email.toLowerCase().trim()
    );
    if (custProjects.length === 1) {
      setProjectId(custProjects[0].id);
      setServiceName(custProjects[0].title);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { description: 'Additional Deliverable / Feature', quantity: 1, unit_price: 5000, amount: 5000 }]);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    const q = Number(updated[index].quantity) || 0;
    const p = Number(updated[index].unit_price) || 0;
    updated[index].amount = q * p;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = items.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const taxAmount = Math.round((subtotal * (Number(taxRate) || 0)) / 100);
  const totalAmount = Math.max(0, subtotal + taxAmount - (Number(discountAmount) || 0));
  const remainingBalance = Math.max(0, totalAmount - (Number(advancePaid) || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) {
      setError('Customer name and email are required');
      return;
    }
    if (subtotal <= 0) {
      setError('Invoice subtotal must be greater than zero');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const matchCust = customers.find(
        (c) => c.email.toLowerCase().trim() === customerEmail.toLowerCase().trim()
      );

      const saved = await saveInvoice({
        id: invoice?.id,
        invoice_number: invoiceNumber.trim() || undefined,
        customer_id: matchCust?.id,
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim().toLowerCase(),
        customer_phone: customerPhone.trim(),
        customer_address: customerAddress.trim(),
        project_id: projectId || undefined,
        service_name: serviceName.trim(),
        issue_date: issueDate,
        due_date: dueDate,
        subtotal,
        tax_rate: Number(taxRate),
        tax_amount: taxAmount,
        discount_amount: Number(discountAmount),
        advance_paid: Number(advancePaid),
        total_amount: totalAmount,
        remaining_balance: remainingBalance,
        status,
        notes: notes.trim(),
        items,
      });

      onInvoiceSaved(saved);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                {invoice ? `Edit Tax Invoice (${invoice.invoice_number})` : 'Create Tax Invoice'}
              </h3>
              <p className="text-xs text-slate-400">Official Indian GST-compliant invoice with automated balance sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto grow">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
              {error}
            </div>
          )}

          {/* Invoice Number & Customer Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Invoice Number *</label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Select Customer</label>
              <select
                value={customerEmail}
                onChange={(e) => handleCustomerSelect(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- Choose Registered Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.email}>
                    {c.full_name} ({c.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Client Full Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Client Email *</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Client Phone</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Service & Link Project */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Service / Project Name *</label>
              <input
                type="text"
                required
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Link to Active Project</label>
              <select
                value={projectId}
                onChange={(e) => {
                  setProjectId(e.target.value);
                  const p = projects.find((proj) => proj.id === e.target.value);
                  if (p) setServiceName(p.title);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- Optional: Select Project --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.customer_email || 'General'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 uppercase font-bold"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="issued">Issued</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span>Line Items</span>
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6">
                    <input
                      type="text"
                      placeholder="Item description..."
                      value={it.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={it.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-center focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      min="0"
                      placeholder="Rate ₹"
                      value={it.unit_price}
                      onChange={(e) => handleItemChange(idx, 'unit_price', Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-right focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      disabled={items.length <= 1}
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2 max-w-xs ml-auto text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span>GST Tax Rate (%):</span>
                <input
                  type="number"
                  min="0"
                  max="28"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-16 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-white font-mono text-right"
                />
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Tax Amount:</span>
                <span className="font-mono text-white">₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span>Discount (₹):</span>
                <input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-20 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-white font-mono text-right"
                />
              </div>

              <div className="flex justify-between text-sm font-bold border-t border-slate-800 pt-2 text-white">
                <span>Total Amount:</span>
                <span className="font-mono text-cyan-400">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span>Advance / Received (₹):</span>
                <input
                  type="number"
                  min="0"
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(Number(e.target.value))}
                  className="w-20 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-right font-bold"
                />
              </div>

              <div className="flex justify-between text-xs font-bold border-t border-slate-800 pt-1 text-amber-400">
                <span>Balance Due:</span>
                <span className="font-mono">₹{remainingBalance.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Payment Instructions &amp; Notes</label>
            <input
              type="text"
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
              <span>{loading ? 'Saving...' : invoice ? 'Update Invoice' : 'Issue Invoice'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
