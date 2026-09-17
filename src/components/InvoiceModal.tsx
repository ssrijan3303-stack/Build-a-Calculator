import React, { useRef } from 'react';
import { Invoice } from '../types';
import { Logo } from './Logo';
import { UpiQrCode } from './UpiQrCode';
import {
  Printer,
  X,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Share2,
} from 'lucide-react';

interface InvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onPayNow?: (invoice: Invoice) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, onClose, onPayNow }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    if (!invoiceRef.current) return;
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${invoice.invoice_number} - SrijanTech</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #fff; color: #0f172a; padding: 40px; }
    .container { max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: 800; color: #0f172a; }
    .logo span { color: #0284c7; }
    .meta { font-size: 13px; color: #475569; line-height: 1.6; }
    .invoice-title { font-size: 28px; font-weight: 800; color: #0f172a; text-align: right; }
    .invoice-info { text-align: right; font-size: 13px; color: #475569; margin-top: 8px; }
    .client-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
    th { background: #0f172a; color: #fff; padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; }
    td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .totals { display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 16px; }
    .calc-table { width: 300px; font-size: 13px; line-height: 2; }
    .calc-table .row { display: flex; justify-content: space-between; }
    .calc-table .grand-total { font-size: 16px; font-weight: 800; border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; padding: 6px 0; margin-top: 6px; }
    .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="logo">Srijan<span>Tech</span></div>
        <div class="meta" style="margin-top: 8px;">
          <strong>SrijanTech Digital Solutions</strong><br>
          Founder: Srijan Singh<br>
          Varanasi, Uttar Pradesh, India<br>
          Phone: +91 7269068483<br>
          UPI: 7269068483@ptyes
        </div>
      </div>
      <div>
        <div class="invoice-title">TAX INVOICE</div>
        <div class="invoice-info">
          <strong>Invoice No:</strong> ${invoice.invoice_number}<br>
          <strong>Issue Date:</strong> ${invoice.issue_date}<br>
          <strong>Due Date:</strong> ${invoice.due_date}<br>
          <strong>Status:</strong> ${invoice.status.toUpperCase()}
        </div>
      </div>
    </div>

    <div class="client-card">
      <div>
        <strong>BILLED TO:</strong><br>
        <span style="font-size: 14px; font-weight: bold; color: #0f172a;">${invoice.customer_name}</span><br>
        ${invoice.customer_email}<br>
        ${invoice.customer_phone || ''}<br>
        ${invoice.customer_address || 'Varanasi, UP'}
      </div>
      <div>
        <strong>PROJECT / SERVICE:</strong><br>
        <span style="font-size: 14px; font-weight: bold; color: #0f172a;">${invoice.service_name}</span><br>
        Place of Supply: Varanasi, Uttar Pradesh<br>
        Currency: INR (₹)
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th class="text-center">Qty</th>
          <th class="text-right">Unit Price (₹)</th>
          <th class="text-right">Total (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.items
          .map(
            (item, i) => `<tr>
            <td>${i + 1}</td>
            <td>${item.description}</td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-right">₹${item.unit_price.toLocaleString('en-IN')}</td>
            <td class="text-right">₹${item.amount.toLocaleString('en-IN')}</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>

    <div class="totals">
      <div style="max-width: 320px; font-size: 12px; color: #475569;">
        <strong>Payment Instructions:</strong><br>
        Remit via UPI to: <strong>7269068483@ptyes</strong><br>
        Include Invoice No: <strong>${invoice.invoice_number}</strong> in remarks.
      </div>
      <div class="calc-table">
        <div class="row"><span>Subtotal:</span><span>₹${invoice.subtotal.toLocaleString('en-IN')}</span></div>
        ${
          invoice.discount_amount > 0
            ? `<div class="row" style="color: #16a34a;"><span>Discount:</span><span>-₹${invoice.discount_amount.toLocaleString(
                'en-IN'
              )}</span></div>`
            : ''
        }
        <div class="row"><span>GST (${invoice.tax_rate}%):</span><span>₹${invoice.tax_amount.toLocaleString(
      'en-IN'
    )}</span></div>
        <div class="row grand-total"><span>Total Amount:</span><span>₹${invoice.total_amount.toLocaleString(
          'en-IN'
        )}</span></div>
        <div class="row" style="color: #047857;"><span>Advance Paid:</span><span>₹${invoice.advance_paid.toLocaleString(
          'en-IN'
        )}</span></div>
        <div class="row" style="font-weight: bold; color: #0369a1; font-size: 14px;"><span>Balance Due:</span><span>₹${invoice.remaining_balance.toLocaleString(
          'en-IN'
        )}</span></div>
      </div>
    </div>

    <div class="footer">
      <div>This is a computer-generated invoice issued by SrijanTech (Varanasi, UP).</div>
      <div>Authorized Signatory: Srijan Singh</div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.invoice_number}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Paid in Full
          </span>
        );
      case 'partially_paid':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" /> Advance Paid (Partial)
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3.5 h-3.5" /> Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30">
            Issued
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Action Header Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Invoice Preview</span>
            <span className="text-xs text-slate-400">({invoice.invoice_number})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadInvoice}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              title="Download standalone HTML invoice"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div ref={invoiceRef} className="p-6 sm:p-10 bg-white text-slate-900 print:p-6">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            <div>
              <Logo variant="invoice" size="lg" />
              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-900">SrijanTech Digital Solutions</p>
                <p>Founder: Srijan Singh</p>
                <p>Varanasi, Uttar Pradesh, India</p>
                <p>Phone: +91 7269068483</p>
                <p>Email: mystoreorder0004@gmail.com</p>
                <p>UPI ID: 7269068483@ptyes</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
                TAX INVOICE
              </h2>
              <div className="mt-2 text-xs text-slate-600 space-y-1">
                <p>
                  <strong className="text-slate-900">Invoice No:</strong> {invoice.invoice_number}
                </p>
                <p>
                  <strong className="text-slate-900">Issue Date:</strong> {invoice.issue_date}
                </p>
                <p>
                  <strong className="text-slate-900">Due Date:</strong> {invoice.due_date}
                </p>
              </div>
              <div className="mt-3">{getStatusBadge(invoice.status)}</div>
            </div>
          </div>

          {/* Billed To Information */}
          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Billed To Client:
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">{invoice.customer_name}</h4>
              <p className="text-slate-600 mt-0.5">{invoice.customer_email}</p>
              {invoice.customer_phone && <p className="text-slate-600">{invoice.customer_phone}</p>}
              {invoice.customer_address && <p className="text-slate-600">{invoice.customer_address}</p>}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Project / Service Reference:
              </span>
              <p className="text-sm font-semibold text-slate-900 mt-1">{invoice.service_name}</p>
              <p className="text-slate-600 mt-0.5">
                Place of Supply: Varanasi, Uttar Pradesh (India)
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto my-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-2">#</th>
                  <th className="py-3 px-2">Description</th>
                  <th className="py-3 px-2 text-center">Qty</th>
                  <th className="py-3 px-2 text-right">Unit Price (INR)</th>
                  <th className="py-3 px-2 text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3.5 px-2 text-slate-500">{idx + 1}</td>
                    <td className="py-3.5 px-2 font-medium text-slate-900">{item.description}</td>
                    <td className="py-3.5 px-2 text-center text-slate-600">{item.quantity}</td>
                    <td className="py-3.5 px-2 text-right text-slate-600">
                      ₹{item.unit_price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-2 text-right font-semibold text-slate-900">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals Calculation Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200">
            {/* Payment instructions & UPI note */}
            <div className="max-w-xs text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-900">Payment Instructions:</p>
              <p>
                Please remit payments via UPI to: <br />
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                  7269068483@ptyes
                </span>
              </p>
              <p className="text-[11px] text-slate-500">
                Include Invoice Number <strong className="text-slate-700">{invoice.invoice_number}</strong> in transaction remarks.
              </p>
            </div>

            {/* Calculations Table */}
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>₹{invoice.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {invoice.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span>-₹{invoice.discount_amount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>GST / Tax ({invoice.tax_rate}%):</span>
                <span>₹{invoice.tax_amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-300 font-bold text-slate-900 text-sm">
                <span>Total Amount:</span>
                <span>₹{invoice.total_amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Advance Paid:</span>
                <span>₹{invoice.advance_paid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-slate-900 font-extrabold text-slate-900 text-sm bg-slate-50 p-2 rounded">
                <span>Balance Due:</span>
                <span className="text-cyan-700">₹{invoice.remaining_balance.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer declaration */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500">
            <p>This is a computer-generated tax invoice issued by SrijanTech (Varanasi, UP).</p>
            <p className="mt-1 sm:mt-0">Authorized Signatory: Srijan Singh</p>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        {invoice.remaining_balance > 0 && onPayNow && (
          <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between print:hidden">
            <div className="text-xs text-slate-300">
              Outstanding Balance:{' '}
              <strong className="text-white font-mono">
                ₹{invoice.remaining_balance.toLocaleString('en-IN')}
              </strong>
            </div>
            <button
              onClick={() => {
                onClose();
                onPayNow(invoice);
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all"
            >
              Pay Balance via UPI Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
