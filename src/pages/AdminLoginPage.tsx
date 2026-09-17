import React, { useState } from 'react';
import { loginUser, demoLogin } from '../services/auth';
import { UserProfile } from '../types';
import { Logo } from '../components/Logo';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Sparkles,
} from 'lucide-react';

interface AdminLoginPageProps {
  onSuccess: (user: UserProfile) => void;
  onNavigate: (tab: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onNavigate }) => {
  const [email, setEmail] = useState('mystoreorder0004@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const user = await loginUser(email.trim(), password);
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        throw new Error('Access denied. This account does not possess administrative privileges.');
      }
      onSuccess(user);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    try {
      const user = await demoLogin('admin');
      onSuccess(user);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-md mx-auto px-4 sm:px-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <Logo size="md" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SrijanTech Control Room</span>
        </div>
        <h1 className="text-2xl font-bold text-white font-['Outfit']">Admin Panel Authentication</h1>
        <p className="text-xs text-slate-400">
          Executive access for Srijan Singh (Varanasi, UP) to manage CRM, invoices, UPI reconciliation, and site settings.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
        {/* Quick Admin Demo Access Button */}
        <button
          type="button"
          onClick={handleDemoAdmin}
          className="w-full py-2.5 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>One-Click Founder / Admin Login (Srijan Singh)</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="h-px bg-slate-800 flex-1" />
          <span>or enter credentials</span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mystoreorder0004@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying Privileges...</span>
            ) : (
              <>
                <span>Enter Admin Panel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400">
          <button
            type="button"
            onClick={() => onNavigate('customer-auth')}
            className="text-cyan-400 hover:underline"
          >
            Looking for Customer Portal instead?
          </button>
        </div>
      </div>
    </div>
  );
};
