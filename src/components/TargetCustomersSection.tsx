import React from 'react';
import {
  Rocket,
  Store,
  Building2,
  Video,
  UserCheck,
  Landmark,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CustomerProfile {
  title: string;
  category: string;
  description: string;
  idealFor: string[];
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
}

const TARGET_PROFILES: CustomerProfile[] = [
  {
    title: 'Startups & Tech Ventures',
    category: 'Startups',
    description:
      'Fast-paced agile teams needing minimum viable products (MVPs), scalable web platforms, and custom SaaS architectures built quickly without technical debt.',
    idealFor: ['MVP Prototyping', 'Scalable Cloud Databases', 'Investor-Ready UI/UX'],
    icon: Rocket,
    badgeColor: 'text-sky-400 bg-sky-950/60 border-sky-800/60',
  },
  {
    title: 'Local Businesses & Shops',
    category: 'Local Businesses',
    description:
      'Retail stores, clinics, restaurants, and service providers across Varanasi, UP, and India seeking a dominant Google Maps presence and direct customer WhatsApp orders.',
    idealFor: ['Google My Business Sync', 'Direct WhatsApp Ordering', 'Local SEO & Maps'],
    icon: Store,
    badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
  },
  {
    title: 'Small & Medium Businesses',
    category: 'Small & Medium Businesses',
    description:
      'Established businesses modernizing legacy systems, deploying corporate websites, customer portals, or streamlining day-to-day operations with custom software.',
    idealFor: ['Corporate Websites', 'Operations Dashboards', 'GST & UPI Billing Flows'],
    icon: Building2,
    badgeColor: 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60',
  },
  {
    title: 'Creators & Professionals',
    category: 'Creators',
    description:
      'Consultants, coaches, influencers, and creative professionals needing personal branding websites, digital asset sales, newsletters, and booking engines.',
    idealFor: ['Personal Portfolio & Bio', 'Digital Product Sales', 'Appointment Bookings'],
    icon: Video,
    badgeColor: 'text-violet-400 bg-violet-950/60 border-violet-800/60',
  },
  {
    title: 'Visionary Individuals',
    category: 'Individuals',
    description:
      'Independent founders, freelancers, and domain experts turning an innovative digital product concept or niche tool into a production-ready application.',
    idealFor: ['Custom Software MVPs', 'Utility Micro-Tools', 'Direct Founder Collaboration'],
    icon: UserCheck,
    badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
  },
  {
    title: 'Organizations & Institutions',
    category: 'Organizations',
    description:
      'Schools, non-profits, healthcare institutions, and hospitality venues requiring multi-tier administrative dashboards, student/patient records, and reliable portals.',
    idealFor: ['Role-Based Portals', 'Data Privacy & Security', 'Notice & Document Systems'],
    icon: Landmark,
    badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
  },
];

interface TargetCustomersProps {
  onOpenEnquiry?: () => void;
}

export const TargetCustomersSection: React.FC<TargetCustomersProps> = ({ onOpenEnquiry }) => {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Who We Serve</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Tailored Engineering For Every Scale
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            SrijanTech partners with ambitious clients at every stage of their digital journey,
            providing purposeful software architecture crafted to their exact operational goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TARGET_PROFILES.map((profile) => {
            const IconComp = profile.icon;
            return (
              <div
                key={profile.category}
                className="rounded-2xl bg-slate-900/50 border border-slate-800/80 p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-all hover:bg-slate-900/70"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center">
                      <IconComp className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${profile.badgeColor}`}
                    >
                      {profile.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white font-['Outfit'] mb-2.5">
                    {profile.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {profile.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Common Solutions
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.idealFor.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
