import React from 'react';
import { Testimonial } from '../types';
import { Sparkles, MessageSquare, Star, Info, ArrowRight } from 'lucide-react';

interface TestimonialsPageProps {
  testimonials: Testimonial[];
  onOpenEnquiry: () => void;
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({
  testimonials,
  onOpenEnquiry,
}) => {
  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Client Partnerships & Feedback
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
          What Our Partners Experience
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          Read feedback and case study reviews from businesses collaborating with SrijanTech.
        </p>

        {/* Ethical Transparency Notice */}
        <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>Note: Prototype reviews are clearly marked as demo/sample content. Real client feedback is added via the Admin Panel as projects close.</span>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between shadow-xl relative"
          >
            <div>
              {/* Rating stars */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-400 gap-1 text-sm">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                {t.is_demo && (
                  <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Sample Case
                  </span>
                )}
              </div>

              {/* Feedback text */}
              <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                "{t.feedback}"
              </p>
            </div>

            {/* Author details */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-base font-['Outfit']">{t.client_name}</h4>
                <p className="text-xs text-slate-400">
                  {t.client_role}, <strong className="text-slate-300">{t.company_name}</strong>
                </p>
                {t.project_title && (
                  <span className="text-[11px] text-cyan-400 mt-0.5 block">{t.project_title}</span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                Varanasi, UP
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-center max-w-2xl mx-auto space-y-4">
        <h3 className="text-2xl font-bold text-white font-['Outfit']">
          Ready to Build Your Success Story?
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Let's collaborate to engineer a digital asset you will be proud of. Get in touch with
          Srijan Singh today.
        </p>
        <button
          onClick={onOpenEnquiry}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20"
        >
          Begin Project Discussion
        </button>
      </div>
    </div>
  );
};
