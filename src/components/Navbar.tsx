import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { getCurrentUser, logoutUser } from '../services/auth';
import { UserProfile } from '../types';
import {
  Menu,
  X,
  User,
  LogOut,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenEnquiry?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenEnquiry }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(getCurrentUser());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('srijantech_theme');
      if (stored) return stored === 'dark';
    }
    return true; // default dark tech aesthetic
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('auth_change', handleAuthChange);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('auth_change', handleAuthChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    try {
      localStorage.setItem('srijantech_theme', nextMode ? 'dark' : 'light');
      if (nextMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // ignore
    }
  };

  // Preferred Navigation where applicable:
  // Home, Services, Work / Projects, Demo, Process, About, Pricing, Contact
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Work / Projects' },
    { id: 'demo', label: 'Demo' },
    { id: 'process', label: 'Process' },
    { id: 'about', label: 'About' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    onNavigate('home');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40 py-2.5 sm:py-3'
          : 'bg-slate-950/40 backdrop-blur-sm py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Logo onClick={() => handleNavClick('home')} size="md" />

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-sky-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Medium Screen Nav (More compact) */}
        <nav className="hidden md:flex xl:hidden items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/70 border border-slate-800/80">
          {navLinks.slice(0, 6).map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/30' : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA / Auth Controls */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Light / Dark mode"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Quick UPI Payment Button */}
          <button
            onClick={() => handleNavClick('payment')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pay UPI</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  handleNavClick(user.role === 'customer' ? 'customer-dashboard' : 'admin-dashboard')
                }
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-semibold text-white hover:bg-slate-700 transition-all cursor-pointer"
              >
                {user.role === 'customer' ? (
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{user.role === 'customer' ? 'Dashboard' : 'Admin Panel'}</span>
              </button>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Customer Login */}
              <button
                id="navbar-login-btn"
                onClick={() => handleNavClick('customer-auth')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
              >
                Customer Login
              </button>
              {/* Customer Signup */}
              <button
                id="navbar-signup-btn"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('switch_to_signup'));
                  handleNavClick('customer-auth');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/60 transition-colors cursor-pointer"
              >
                Customer Signup
              </button>
              {/* Start Project CTA */}
              <button
                id="navbar-getstarted-btn"
                onClick={() => (onOpenEnquiry ? onOpenEnquiry() : handleNavClick('contact'))}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-md shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>Start Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Light / Dark Mode Toggle on Mobile */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>
          <button
            onClick={() => handleNavClick('payment')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400"
            title="Pay via UPI"
          >
            <CreditCard className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-4 py-2 rounded-xl text-sm font-medium ${
                  currentTab === link.id
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="my-2 border-t border-slate-800/80 pt-3 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('payment')}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 text-sm font-medium"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay via UPI (7269068483@ptyes)</span>
              </button>

              {user ? (
                <>
                  <button
                    onClick={() =>
                      handleNavClick(user.role === 'customer' ? 'customer-dashboard' : 'admin-dashboard')
                    }
                    className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 text-white text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>{user.role === 'customer' ? 'My Customer Dashboard' : 'Admin Panel'}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 px-4 rounded-xl text-rose-400 bg-rose-500/10 text-xs font-medium text-center"
                  >
                    Log Out ({user.full_name})
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleNavClick('customer-auth')}
                      className="py-2.5 px-4 rounded-xl border border-slate-800 bg-slate-900 text-slate-200 text-xs font-semibold text-center"
                    >
                      Customer Login
                    </button>
                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('switch_to_signup'));
                        handleNavClick('customer-auth');
                      }}
                      className="py-2.5 px-4 rounded-xl border border-cyan-800/60 bg-cyan-950/60 text-cyan-300 text-xs font-semibold text-center"
                    >
                      Customer Signup
                    </button>
                  </div>
                  <button
                    onClick={() => (onOpenEnquiry ? onOpenEnquiry() : handleNavClick('contact'))}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold text-center"
                  >
                    Start Project
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
