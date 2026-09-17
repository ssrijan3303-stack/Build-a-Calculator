import React, { useState } from 'react';
import { PricingPlan } from '../types';
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface PricingPageProps {
  pricing: PricingPlan[];
  onSelectPlan: (plan: PricingPlan) => void;
  onOpenEnquiry: (note?: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  pricing,
  onSelectPlan,
  onOpenEnquiry,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'website' | 'custom'>('all');

  const filteredPricing = pricing.filter((p) => {
    if (filterType === 'website') return p.price_type === 'starting';
    if (filterType === 'custom') return p.price_type === 'custom_quote';
    return true;
  });

  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-xs font-semibold text-cyan-400 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent Investment</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
          Clear Pricing, Honest Scope
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          Structured milestones and transparent estimates designed for startups, local businesses,
          and growing enterprises.
        </p>
      </div>

      {/* MANDATORY PRICING DISCLAIMER NOTE */}
      <div className="p-5 sm:p-6 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-xs sm:text-sm text-amber-200/90 flex items-start gap-3.5 max-w-4xl mx-auto shadow-lg">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white block font-semibold mb-0.5 font-['Outfit']">
            Important Pricing Scope Notice:
          </strong>
          Final pricing depends on requirements, features, integrations, design, development scope
          and project complexity. We do not provide fixed final quotes when project requirements are
          unknown, ensuring you only pay for exactly what your software requires.
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filterType === 'all'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          All Plans (7)
        </button>
        <button
          type="button"
          onClick={() => setFilterType('website')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filterType === 'website'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          Standard Websites (3)
        </button>
        <button
          type="button"
          onClick={() => setFilterType('custom')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filterType === 'custom'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          Custom Architecture (4)
        </button>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPricing.map((plan) => {
          const isCustom = plan.price_type === 'custom_quote';

          return (
            <div
              key={plan.id}
              className={`p-6 sm:p-7 rounded-3xl flex flex-col justify-between transition-all ${
                plan.is_popular
                  ? 'bg-slate-900 border-2 border-cyan-500/70 shadow-2xl shadow-cyan-500/10 relative scale-[1.02] z-10'
                  : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {plan.badge && (
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border ${
                      plan.is_popular
                        ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold text-white font-['Outfit']">{plan.name}</h3>
                <p className="text-xs text-slate-300 mt-2 min-h-[36px] leading-relaxed">
                  {plan.short_description}
                </p>

                <div className="my-5 pt-4 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                    {isCustom ? 'Scope Estimate' : 'Starting From'}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    {isCustom ? (
                      <span className="text-2xl font-extrabold text-white font-['Outfit']">
                        Custom Quote
                      </span>
                    ) : (
                      <>
                        <span className="text-3xl font-extrabold text-white font-['Outfit']">
                          ₹{plan.price.toLocaleString('en-IN')}+
                        </span>
                        <span className="text-xs font-mono text-slate-400">INR</span>
                      </>
                    )}
                  </div>
                  <div className="mt-2 text-[11px] text-cyan-400 font-medium">
                    {isCustom
                      ? 'Tailored milestone breakdown based on scope'
                      : `${plan.advance_percentage}% Advance to initiate project`}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2 mb-6 text-xs text-slate-300">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer ${
                    plan.is_popular
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/25'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {isCustom ? 'Request Custom Quote' : 'Select & Pay Advance'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Security & Milestones Notice */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-400">
        <ShieldCheck className="w-8 h-8 text-cyan-400 shrink-0" />
        <div className="text-center sm:text-left">
          <strong className="text-slate-200 block text-sm font-['Outfit'] mb-0.5">
            Transparent Milestone Terms &amp; Indian UPI
          </strong>
          All transactions are conducted in Indian Rupees (INR) via official UPI (7269068483@ptyes)
          or bank gateway. You receive a verified Tax Invoice and downloadable PDF receipt for each
          payment stage.
        </div>
      </div>
    </div>
  );
};
