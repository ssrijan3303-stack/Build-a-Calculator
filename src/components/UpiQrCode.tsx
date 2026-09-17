import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, Smartphone, ShieldCheck, QrCode as QrIcon } from 'lucide-react';

interface UpiQrCodeProps {
  amount: number;
  orderId?: string;
  serviceName?: string;
  customQrUrl?: string;
  className?: string;
}

export const UpiQrCode: React.FC<UpiQrCodeProps> = ({
  amount,
  orderId = 'ORD-2025',
  serviceName = 'SrijanTech Service',
  customQrUrl,
  className = '',
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const upiId = '7269068483@ptyes';
  const payeeName = 'SrijanTech';
  const note = `${serviceName} - ${orderId}`.slice(0, 30);

  // Standard NPCI UPI URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${encodeURIComponent(amount.toFixed(2))}&cu=INR&tn=${encodeURIComponent(note)}`;

  useEffect(() => {
    if (customQrUrl) {
      setQrDataUrl(customQrUrl);
      return;
    }

    QRCode.toDataURL(upiUri, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0B0F19',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR:', err));
  }, [upiUri, customQrUrl]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className={`rounded-2xl bg-slate-900/90 border border-slate-800/80 p-6 flex flex-col items-center text-center shadow-xl backdrop-blur-sm ${className}`}
    >
      {/* Header Badge */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
        Official SrijanTech UPI Payment
      </div>

      {/* Amount Display */}
      <div className="mb-4">
        <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Payment Amount</div>
        <div className="text-3xl font-extrabold text-white font-['Outfit'] mt-0.5">
          ₹{amount.toLocaleString('en-IN')}
          <span className="text-xs font-normal text-slate-400 ml-1.5">INR</span>
        </div>
        <div className="text-xs text-slate-400 mt-1 truncate max-w-xs">{serviceName}</div>
      </div>

      {/* QR Code Container */}
      <div className="relative group p-3.5 bg-white rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.15)] border-4 border-slate-800/50">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="SrijanTech UPI QR Code"
            className="w-56 h-56 object-contain rounded-xl"
          />
        ) : (
          <div className="w-56 h-56 flex items-center justify-center text-slate-500">
            <QrIcon className="w-12 h-12 animate-pulse text-cyan-500" />
          </div>
        )}
        <div className="absolute inset-0 rounded-xl bg-cyan-500/5 pointer-events-none" />
      </div>

      <p className="text-xs text-slate-400 mt-3 font-medium flex items-center gap-1.5">
        <QrIcon className="w-3.5 h-3.5 text-sky-400" />
        Scan with Google Pay, PhonePe, Paytm, BHIM, or any UPI App
      </p>

      {/* UPI ID Pill with Copy */}
      <div className="mt-4 w-full max-w-xs bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
        <div className="text-left pl-1.5 overflow-hidden">
          <div className="text-[10px] uppercase text-slate-400 font-medium">UPI VPA Address</div>
          <div className="text-sm font-mono font-semibold text-cyan-300 truncate">{upiId}</div>
        </div>
        <button
          onClick={handleCopyUpi}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 active:bg-cyan-500/30 text-cyan-300 text-xs font-medium rounded-lg border border-cyan-500/30 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Mobile Direct UPI Intent Button */}
      <div className="mt-4 w-full max-w-xs">
        <a
          href={upiUri}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all"
        >
          <Smartphone className="w-4 h-4" />
          Pay via UPI App Directly
        </a>
      </div>

      {/* Payee Info Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 w-full text-[11px] text-slate-400 flex items-center justify-between">
        <span>Payee: <strong className="text-slate-300 font-medium">SrijanTech</strong></span>
        <span>Order: <strong className="text-slate-300 font-mono">{orderId}</strong></span>
      </div>
    </div>
  );
};
