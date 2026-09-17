import React from 'react';
import {
  Compass,
  FileText,
  Palette,
  Code2,
  Rocket,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ProcessStep {
  step: string;
  title: string;
  phase: string;
  description: string;
  deliverables: string[];
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Discover',
    phase: 'Strategic Alignment',
    description:
      'We understand your business vision, functional requirements, target audience, and digital goals through transparent discussion.',
    deliverables: [
      'Requirements Analysis',
      'Target Audience & Competitive Review',
      'Technical Scope & Feature Roadmap',
    ],
    icon: Compass,
    accentColor: 'from-sky-500 to-blue-600',
  },
  {
    step: '02',
    title: 'Plan',
    phase: 'Architecture & Blueprint',
    description:
      'We formulate a clear development blueprint, system architecture, database design, technology stack, and milestone timeline.',
    deliverables: [
      'Information Architecture & Sitemap',
      'Database Schema & API Specifications',
      'Milestone Deliverable Schedule',
    ],
    icon: FileText,
    accentColor: 'from-blue-500 to-indigo-600',
  },
  {
    step: '03',
    title: 'Design',
    phase: 'Modern UI / UX Craftsmanship',
    description:
      'We craft clean, modern, and high-conversion user interfaces optimized for mobile touch, accessible typography, and smooth micro-interactions.',
    deliverables: [
      'Responsive Wireframes & Prototypes',
      'Design System & Component Library',
      'Interactive Design Review & Approvals',
    ],
    icon: Palette,
    accentColor: 'from-indigo-500 to-violet-600',
  },
  {
    step: '04',
    title: 'Develop',
    phase: 'Clean Code Engineering',
    description:
      'We write type-safe, modular, and maintainable code adhering to modern web standards, security best practices, and ultra-fast page speeds.',
    deliverables: [
      'Production-Grade React / TypeScript Code',
      'REST / Database Integrations & Auth',
      'UPI Payment & WhatsApp Workflow Routing',
    ],
    icon: Code2,
    accentColor: 'from-cyan-500 to-sky-600',
  },
  {
    step: '05',
    title: 'Test & Launch',
    phase: 'Quality Assurance & Deployment',
    description:
      'We conduct rigorous cross-browser testing, mobile responsiveness checks, SEO audits, and speed benchmarks before zero-downtime deployment.',
    deliverables: [
      'Cross-Device & Cross-Browser Validation',
      'Technical SEO, Meta Tags & SSL Setup',
      'Live Cloud Deployment & DNS Mapping',
    ],
    icon: Rocket,
    accentColor: 'from-emerald-500 to-teal-600',
  },
  {
    step: '06',
    title: 'Support',
    phase: 'Post-Launch Partnership',
    description:
      'We stand behind our work with warranty maintenance, routine security updates, performance monitoring, and founder-level support.',
    deliverables: [
      'Post-Launch Warranty & Bug Fixes',
      'Performance & Uptime Monitoring',
      'Future Feature Expansion & Consulting',
    ],
    icon: Headphones,
    accentColor: 'from-amber-500 to-orange-600',
  },
];

interface ProcessSectionProps {
  onOpenEnquiry?: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onOpenEnquiry }) => {
  return (
    <section id="process" className="relative py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-xs font-semibold text-cyan-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
            How We Build Your Digital Solutions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            A structured, 6-phase engineering lifecycle ensuring transparency, rapid delivery, and
            uncompromising code quality from initial discovery to long-term support.
          </p>
        </div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PROCESS_STEPS.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.step}
                className="relative rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20 group"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.accentColor} p-0.5 shadow-md flex items-center justify-center`}
                    >
                      <div className="w-full h-full bg-slate-950/70 rounded-[10px] flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-cyan-300" />
                      </div>
                    </div>
                    <span className="text-3xl font-extrabold font-['Outfit'] text-slate-700/80 group-hover:text-cyan-500/30 transition-colors">
                      {step.step}
                    </span>
                  </div>

                  {/* Title & Phase */}
                  <div className="text-xs uppercase tracking-wider font-semibold text-cyan-400 mb-1">
                    {step.phase}
                  </div>
                  <h3 className="text-xl font-bold text-white font-['Outfit'] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-5">
                    {step.description}
                  </p>
                </div>

                {/* Deliverables */}
                <div className="pt-4 border-t border-slate-800/80">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                    Key Deliverables
                  </div>
                  <ul className="space-y-1.5">
                    {step.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Process Bottom Callout */}
        {onOpenEnquiry && (
          <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900 to-slate-900/90 border border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h4 className="text-lg font-bold text-white font-['Outfit']">
                Have an idea ready for Phase 01 Discover?
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Consult directly with Srijan Singh for a transparent, zero-obligation architecture roadmap.
              </p>
            </div>
            <button
              onClick={onOpenEnquiry}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition-all shrink-0"
            >
              <span>Initiate Discovery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
