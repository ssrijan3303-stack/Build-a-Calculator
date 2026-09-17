import React from 'react';
import { WebsiteSettings } from '../types';
import { AboutSection } from '../components/AboutSection';
import {
  MapPin,
  Mail,
  Phone,
  Target,
  Compass,
  CheckCircle2,
  Cpu,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface AboutPageProps {
  settings: WebsiteSettings;
  onNavigate: (tab: string) => void;
  onOpenEnquiry: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate, onOpenEnquiry }) => {
  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Top Breadcrumb / Title */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <MapPin className="w-3.5 h-3.5" />
          Varanasi, Uttar Pradesh, India
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
          About SrijanTech & Founder
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          {settings.tagline}
        </p>
      </div>

      {/* Primary Founder & About SrijanTech Two-Column Section */}
      <AboutSection
        settings={settings}
        onOpenEnquiry={onOpenEnquiry}
        onNavigate={onNavigate}
      />

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white font-['Outfit']">Our Vision</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{settings.vision}</p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white font-['Outfit']">Our Mission</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{settings.mission}</p>
        </div>
      </div>

      {/* Varanasi Heritage & Modern Tech Synergy */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
            Rooted in Varanasi
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mt-1">
            Global Technical Standards from the Cultural Capital
          </h3>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Varanasi is celebrated for ancient heritage, timeless wisdom, and bustling commerce.
            At SrijanTech, we honor this heritage by introducing modern, cutting-edge digital
            craftsmanship—building enterprise-grade web applications with the same devotion and
            enduring quality that defines our city.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <h5 className="font-bold text-white mb-1">Local Business Empowerment</h5>
            <p className="text-slate-400">
              Enabling Varanasi retailers, schools, and artisans to compete with digital leaders nationwide.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <h5 className="font-bold text-white mb-1">Modern Indian UPI</h5>
            <p className="text-slate-400">
              Zero-friction QR and instant payments engineered directly for Indian consumers and merchants.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <h5 className="font-bold text-white mb-1">Architectural Integrity</h5>
            <p className="text-slate-400">
              Strict adherence to clean code, semantic TypeScript, and reliable relational databases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
