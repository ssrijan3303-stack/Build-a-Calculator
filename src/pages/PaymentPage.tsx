import React, { useState } from 'react';
import { UpiQrCode } from '../components/UpiQrCode';
import { createPaymentTransaction, getInvoices } from '../services/db';
import { PaymentTransaction, Invoice } from '../types';
import { InvoiceModal } from '../components/InvoiceModal';
import { getCurrentUser } from '../services/auth';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Smartphone,
  ShieldCheck,
  FileText,
  Clock,
  ArrowRight,
  UploadCloud,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentPageProps {
  initialAmount?: number;
  initialNote?: string;
  initialPlanName?: string;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({
  initialAmount = 5000,
  initialNote = 'Project Advance',
  initialPlanName,
}) => {
  const currentUser = getCurrentUser();
  const [amount, setAmount] = useState<number>(initialAmount);
  const [customerName, setCustomerName] = useState(currentUser?.full_name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [note, setNote] = useState(initialPlanName ? `${initialPlanName} Advance` : initialNote);
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  const upiId = '7269068483@ptyes';
  const payeeName = 'SrijanTech (Srijan Singh)';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const presetAmounts = [1000, 2500, 5000, 10000, 15000, 25000];

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !utrNumber.trim()) {
      setErrorMsg('Please enter your Name, Email, Phone, and the 12-digit UPI UTR / Reference Number.');
      return;
    }

    if (amount <= 0) {
      setErrorMsg('Please enter a valid amount greater than zero.');
      return;
    }

    setLoading(true);
    try {
      const tx = await createPaymentTransaction({
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        customer_phone: customerPhone.trim(),
        amount: Number(amount),
        upi_id: upiId,
        payment_method: 'upi_qr',
        transaction_note: note.trim() || 'SrijanTech Web Engineering Advance',
        utr_number: utrNumber.trim(),
        screenshot_url: screenshotFile ? `uploaded/${screenshotFile}` : undefined,
      });

      setCompletedTx(tx);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to record transaction.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewGeneratedReceipt = async () => {
    const invoices = await getInvoices();
    if (completedTx && completedTx.invoice_id) {
      const match = invoices.find((inv) => inv.id === completedTx.invoice_id);
      if (match) {
        setViewInvoice(match);
        return;
      }
    }
    // Fallback: create mock viewable invoice
    if (completedTx) {
      const mockInvoice: Invoice = {
        id: completedTx.id,
        invoice_number: `INV-${completedTx.transaction_number}`,
        customer_id: completedTx.customer_id,
        customer_name: completedTx.customer_name,
        customer_email: completedTx.customer_email,
        customer_phone: completedTx.customer_phone,
        service_name: completedTx.transaction_note,
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date().toISOString().split('T')[0],
        items: [
          {
            description: completedTx.transaction_note,
            quantity: 1,
            unit_price: completedTx.amount,
            amount: completedTx.amount,
          },
        ],
        subtotal: completedTx.amount,
        tax_rate: 0,
        tax_amount: 0,
        discount_amount: 0,
        advance_paid: completedTx.amount,
        total_amount: completedTx.amount,
        remaining_balance: 0,
        status: completedTx.status === 'verified' ? 'paid' : 'issued',
        notes: `UPI UTR: ${completedTx.utr_number || 'Pending'}`,
        created_at: completedTx.created_at,
      };
      setViewInvoice(mockInvoice);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <CreditCard className="w-3.5 h-3.5" />
          Indian UPI Payment Gateway
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
          Secure UPI & QR Remittance
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          Zero convenience fee, 100% direct payment to SrijanTech's verified UPI endpoint with
          immediate receipt and tax invoice generation.
        </p>
      </div>

      {completedTx ? (
        /* Success State */
        <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white font-['Outfit']">
              Payment Submission Received!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Your transaction has been recorded. Srijan Singh will verify the UTR against our bank
              statement and confirm receipt.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Transaction Ref:</span>
              <span className="text-cyan-400 font-bold">{completedTx.transaction_number}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Amount Submitted:</span>
              <span className="text-white font-bold">₹{completedTx.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>UTR / Reference:</span>
              <span className="text-slate-200">{completedTx.utr_number}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Verification Status:</span>
              <span
                className={`font-semibold uppercase ${
                  completedTx.status === 'verified' ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {completedTx.status === 'verified' ? 'Verified / Confirmed' : 'Pending Bank Verification'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleViewGeneratedReceipt}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>View & Print Tax Invoice</span>
            </button>
            <button
              onClick={() => setCompletedTx(null)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Make Another Payment
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: QR Code & UPI Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">Step 1: Set Amount & Scan QR</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Scan using Google Pay, PhonePe, Paytm, BHIM, or any banking UPI app.
                </p>
              </div>

              {/* Amount Inputs */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Payment Amount (INR ₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-lg font-extrabold text-white font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        amount === preset
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      ₹{preset.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose Note */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Purpose / Project Reference
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Website Advance or Invoice #101"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* UPI QR Display */}
              <div className="pt-2 flex justify-center">
                <UpiQrCode
                  upiId={upiId}
                  payeeName={payeeName}
                  amount={amount}
                  transactionNote={note}
                />
              </div>

              {/* Copy UPI Address Card */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Official Merchant UPI ID:
                  </span>
                  <span className="font-mono font-bold text-sm text-cyan-300">{upiId}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                >
                  {copiedUpi ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy UPI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Step 2 Confirmation & Verification Form */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">
                  Step 2: Enter UPI UTR &amp; Claim Receipt
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  After completing the payment on your mobile app, enter the 12-digit UTR/Ref number
                  from your app receipt below.
                </p>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Phone / WhatsApp <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 7269068483"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    12-Digit UPI UTR / Bank Reference Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 423589123456"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Found in your Google Pay, PhonePe, or Paytm receipt details as "UPI Ref No." or "UTR".
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Upload Payment Screenshot (Optional)
                  </label>
                  <label className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500/50 bg-slate-950 cursor-pointer text-xs text-slate-400 transition-colors">
                    <UploadCloud className="w-4 h-4 text-cyan-400" />
                    <span className="truncate">
                      {screenshotFile || 'Click to select screenshot PNG/JPG'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setScreenshotFile(file.name);
                      }}
                    />
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Verifying with SrijanTech...</span>
                    ) : (
                      <>
                        <span>Verify UTR &amp; Generate Invoice</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Security guarantee */}
              <div className="pt-4 border-t border-slate-800 flex items-center gap-3 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Payments verified by Srijan Singh. All transactions backed by official Indian Tax
                  Invoices.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal Preview if opened */}
      {viewInvoice && (
        <InvoiceModal
          invoice={viewInvoice}
          onClose={() => setViewInvoice(null)}
        />
      )}
    </div>
  );
};
