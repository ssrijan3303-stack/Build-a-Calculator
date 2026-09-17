import React from 'react';
import { WebsiteSettings } from '../types';
import { FounderPhoto } from './FounderPhoto';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Target,
  Compass,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Code2,
} from 'lucide-react';

interface AboutSectionProps {
  settings: WebsiteSettings;
  onOpenEnquiry?: () => void;
  onNavigate?: (tab: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  settings,
  onOpenEnquiry,
  onNavigate,
}) => {
  return (
    <section id="about" className="relative py-16 sm:py-24 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Two-Column Layout */}
        <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl shadow-cyan-950/30 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative overflow-hidden backdrop-blur-sm">
          {/* Subtle gradient sheen */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent rounded-tr-3xl pointer-events-none" />

          {/* LEFT COLUMN: Large, Clear, Professional Founder Portrait (Public Read-Only) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <FounderPhoto
              photoUrl={settings.founder_photo_url || '/images/founder/srijan-singh-founder.jpg'}
              size="xl"
              showUploadControls={false}
            />
            <p className="mt-3 text-center text-xs text-slate-400">
              Direct engineering leadership on every engagement
            </p>
          </div>

          {/* RIGHT COLUMN: Structured Founder & Agency Information */}
          <div className="lg:col-span-7 space-y-6">
            {/* Small Label: "ABOUT SRIJANTECH" */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                ABOUT SRIJANTECH
              </div>

              {/* Heading: "Building Digital Experiences That Matter" */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight leading-tight">
                Building Digital Experiences That Matter
              </h2>

              {/* Founder Name & Role */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                  Srijan Singh
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-cyan-300 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Founder &amp; Developer — SrijanTech
                </span>
              </div>
            </div>

            {/* Description (Exact text required) */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border-l-4 border-cyan-400 border-y border-r border-slate-800/80 text-slate-200 text-sm sm:text-base leading-relaxed">
              &ldquo;SrijanTech is a digital solutions company focused on building modern websites,
              web applications, e-commerce platforms, and reliable digital experiences for businesses
              and organizations.&rdquo;
            </div>

            {/* Technical Philosophy and Values */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                Operating from Varanasi, Uttar Pradesh, SrijanTech provides production-grade web
                engineering engineered for real commercial performance. We combine clean
                architectures, fluid mobile responsiveness, and dynamic Indian payment options (UPI QR)
                to convert casual traffic into active customers.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
                <Target className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Direct Collaboration</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    No middlemen or salespeople — architect directly with the founder.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
                <Code2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Production-Grade Code</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Modern TypeScript, React, Tailwind CSS, and resilient Cloud backends.
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons & Contact Indicators */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              {onOpenEnquiry && (
                <button
                  type="button"
                  onClick={onOpenEnquiry}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
                >
                  <span>Start Your Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('projects')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  <span>View All 12 Live Demos</span>
                </button>
              )}

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 ml-auto">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>Varanasi, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
