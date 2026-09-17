import React from 'react';
import { Service } from '../types';
import {
  Globe,
  Layers,
  ShoppingCart,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Code2,
  Zap,
  Smartphone,
  Sparkles,
} from 'lucide-react';

interface ServicesPageProps {
  services: Service[];
  onOpenEnquiry: (serviceId?: string) => void;
  onNavigate: (tab: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  onOpenEnquiry,
  onNavigate,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'smartphone':
        return <Smartphone className="w-6 h-6" />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'shoppingcart':
        return <ShoppingCart className="w-6 h-6" />;
      case 'shieldcheck':
        return <ShieldCheck className="w-6 h-6" />;
      case 'layers':
        return <Layers className="w-6 h-6" />;
      default:
        return <Globe className="w-6 h-6" />;
    }
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
          Professional Digital Services
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight mt-2">
          Engineered for Performance & Measurable Impact
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          Explore our full suite of digital engineering disciplines. Every solution is delivered with robust
          TypeScript code, responsive design, and seamless Indian UPI payment support.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {getIcon(service.icon)}
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 block font-medium">
                    Investment Starting At
                  </span>
                  <span className="text-xl font-extrabold text-white font-mono">
                    ₹{service.base_price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white font-['Outfit'] mb-3">
                {service.title}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {service.detailed_description || service.short_description}
              </p>

              {/* Feature Checklist */}
              <div className="space-y-2.5 mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Included Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between gap-4">
              <button
                onClick={() => onNavigate('pricing')}
                className="text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                View Pricing Packages →
              </button>
              <button
                onClick={() => onOpenEnquiry(service.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all"
              >
                <span>Request Project Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tech Stack Callout */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white font-['Outfit']">Need a Custom Specification?</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Have custom API integrations, internal company database systems, or unique hardware requirements? We engineer custom solutions from the ground up.
          </p>
        </div>
        <button
          onClick={() => onOpenEnquiry()}
          className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors flex-shrink-0"
        >
          Discuss Custom Requirement
        </button>
      </div>
    </div>
  );
};
