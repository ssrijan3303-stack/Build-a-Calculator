import React from 'react';
import { Logo } from './Logo';
import { WebsiteSettings } from '../types';
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  Shield,
  FileText,
  RefreshCw,
  Lock,
  MessageSquare,
} from 'lucide-react';

interface FooterProps {
  settings: WebsiteSettings;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  const activeSocials = settings.social_links.filter((s) => s.is_active && s.url.trim() !== '');

  const handleNav = (tab: string) => {
    onNavigate(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              SrijanTech is a digital solutions and modern web engineering company founded by{' '}
              <strong className="text-slate-200">Srijan Singh</strong> in Varanasi. We turn ideas
              into reliable, high-performance web applications and e-commerce platforms.
            </p>

            {/* Direct Contact Info */}
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Varanasi, Uttar Pradesh, India</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <a href="tel:+917269068483" className="hover:text-cyan-400 transition-colors">
                  +91 7269068483
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <a
                  href="mailto:mystoreorder0004@gmail.com"
                  className="hover:text-cyan-400 transition-colors"
                >
                  mystoreorder0004@gmail.com
                </a>
              </div>
            </div>

            {/* Social Links (only if configured in Admin) */}
            {activeSocials.length > 0 && (
              <div className="pt-2">
                <div className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-2">
                  Connect
                </div>
                <div className="flex items-center gap-2">
                  {activeSocials.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                    >
                      {s.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-['Outfit']">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Website Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Web Applications
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  E-Commerce Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Website Maintenance
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('pricing')}
                  className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Pricing Packages</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-['Outfit']">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-cyan-400 transition-colors">
                  About Srijan Singh
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('projects')} className="hover:text-cyan-400 transition-colors">
                  Featured Concepts
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('blog')} className="hover:text-cyan-400 transition-colors">
                  Engineering Blog
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq')} className="hover:text-cyan-400 transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('testimonials')} className="hover:text-cyan-400 transition-colors">
                  Client Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Actions & Portals */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-['Outfit']">
              Portals & Legal
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => handleNav('payment')}
                  className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 transition-colors"
                >
                  <span>Instant UPI Payment</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('customer-auth')} className="hover:text-cyan-400 transition-colors">
                  Customer Portal Login
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('privacy-policy')} className="hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('terms')} className="hover:text-cyan-400 transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('refund-policy')} className="hover:text-cyan-400 transition-colors">
                  Refund & Cancellation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('admin-login')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-400 transition-colors pt-2"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Access</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} SrijanTech. All rights reserved. Founded by Srijan Singh.
          </div>
          <div className="flex items-center gap-4">
            <span>Varanasi, UP, India</span>
            <span>•</span>
            <span className="text-slate-400 font-mono">UPI: 7269068483@ptyes</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
