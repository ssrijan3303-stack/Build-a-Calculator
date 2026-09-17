import React from 'react';
import { Service, Project, PricingPlan, Testimonial, Faq, WebsiteSettings } from '../types';
import { initialSettings } from '../data/defaultData';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
  Code2,
  CheckCircle2,
  ChevronRight,
  Globe,
  ShoppingCart,
  Phone,
  MessageCircle,
  Clock,
  Compass,
  Laptop,
} from 'lucide-react';
import { ProjectImage } from '../components/ProjectImage';
import { AboutSection } from '../components/AboutSection';
import { HeroCarousel } from '../components/HeroCarousel';
import { ProcessSection } from '../components/ProcessSection';
import { TargetCustomersSection } from '../components/TargetCustomersSection';

interface HomePageProps {
  services: Service[];
  projects: Project[];
  pricing: PricingPlan[];
  testimonials: Testimonial[];
  faqs: Faq[];
  settings?: WebsiteSettings;
  onNavigate: (tab: string) => void;
  onOpenEnquiry: (serviceId?: string) => void;
  onSelectProject: (project: Project) => void;
  onOpenDemo?: (project: Project) => void;
  onSelectPlan: (plan: PricingPlan) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  services,
  projects,
  pricing,
  testimonials,
  faqs,
  settings,
  onNavigate,
  onOpenEnquiry,
  onSelectProject,
  onOpenDemo,
  onSelectPlan,
}) => {
  const featuredServices = services.slice(0, 4);
  const featuredProjects = projects.slice(0, 4);
  const featuredFaqs = faqs.slice(0, 4);

  const handleDemoClick = (project: Project) => {
    if (onOpenDemo) {
      onOpenDemo(project);
    } else {
      onSelectProject(project);
    }
  };

  return (
    <div className="pt-20 sm:pt-24 space-y-24 sm:space-y-32">
      {/* 1. HERO SECTION WITH 6-SLIDE CAROUSEL */}
      <HeroCarousel onOpenEnquiry={onOpenEnquiry} onNavigate={onNavigate} />

      {/* 2. SERVICES PREVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              Core Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Crafted Digital Services
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-lg">
              From responsive websites to complex e-commerce architectures, we deliver clean,
              purpose-built software.
            </p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service) => (
            <div
              key={service.id}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {service.slug.includes('e-commerce') ? (
                    <ShoppingCart className="w-6 h-6" />
                  ) : service.slug.includes('maintenance') ? (
                    <ShieldCheck className="w-6 h-6" />
                  ) : service.slug.includes('app') ? (
                    <Laptop className="w-6 h-6" />
                  ) : (
                    <Globe className="w-6 h-6" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">{service.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {service.short_description}
                </p>

                <ul className="space-y-1.5 mb-6 text-xs text-slate-400">
                  {service.features.slice(0, 3).map((f, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">Starting from</span>
                  <span className="text-sm font-bold text-white font-mono">
                    ₹{service.base_price.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={() => onOpenEnquiry(service.id)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold transition-colors"
                >
                  Enquire
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE SRIJANTECH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5" />
              The SrijanTech Standard
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Why Businesses Choose SrijanTech
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              We reject bloated website templates and sluggish generic scripts. Every line of code is
              purposefully engineered for resilience and tangible business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h4 className="text-base font-bold text-white mb-2 font-['Outfit']">
                Direct Founder Access
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Work directly with founder Srijan Singh. No layers of non-technical account managers
                or delays in technical translation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h4 className="text-base font-bold text-white mb-2 font-['Outfit']">
                Bespoke Indian Payment Architecture
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Native integration with Indian UPI (7269068483@ptyes), dynamic amount-locked QR codes,
                and gateway webhooks designed for Indian consumers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h4 className="text-base font-bold text-white mb-2 font-['Outfit']">
                100% Code & Asset Ownership
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                No proprietary lock-ins. You receive full source code, deployment assets, database
                schemas, and freedom to host anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TARGET CUSTOMERS SECTION */}
      <TargetCustomersSection onOpenEnquiry={onOpenEnquiry} onNavigate={onNavigate} />

      {/* ABOUT SRIJANTECH & FOUNDER SECTION */}
      <AboutSection
        settings={settings || initialSettings}
        onOpenEnquiry={() => onOpenEnquiry()}
        onNavigate={onNavigate}
      />

      {/* 4. FEATURED PROJECTS / CONCEPTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              Featured Concepts & Demos
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Engineered Solutions & Prototypes
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-lg">
              Explore our functional demo architectures designed to show real-world capabilities.
            </p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                {/* Large Realistic Website Screenshot / Preview */}
                <div
                  onClick={() => handleDemoClick(project)}
                  className="relative cursor-pointer overflow-hidden rounded-2xl bg-slate-950 border border-slate-800/90 mb-5 group/img"
                >
                  <div className="w-full aspect-[16/10] overflow-hidden bg-slate-950">
                    <ProjectImage
                      src={project.thumbnail_url}
                      alt={`${project.title} - Website Preview Screenshot`}
                      className="w-full h-full aspect-[16/10]"
                      slug={project.slug}
                      category={project.category}
                      title={project.title}
                    />
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-slate-950/90 border border-slate-700/80 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-slate-300">
                    Live Concept
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                    {project.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Est: ₹{project.estimated_cost.toLocaleString('en-IN')}
                  </span>
                </div>

                <h3
                  onClick={() => onSelectProject(project)}
                  className="text-xl font-bold text-white font-['Outfit'] group-hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  {project.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-2">{project.description}</p>

                <div className="flex flex-wrap gap-1.5 my-4">
                  {project.technologies.slice(0, 4).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectProject(project)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  Details
                </button>
                <button
                  onClick={() => handleDemoClick(project)}
                  className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Live Demo →</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PROCESS / HOW WE WORK */}
      <ProcessSection onOpenEnquiry={() => onOpenEnquiry()} />

      {/* 6. PRICING PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5" />
              Honest Investment
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Transparent Project Packages
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-lg">
              No hidden fees. Every tier includes dedicated engineering and direct support.
            </p>
          </div>
          <button
            onClick={() => onNavigate('pricing')}
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            <span>View Full Comparison</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricing.slice(0, 3).map((plan) => (
            <div
              key={plan.id}
              className={`p-6 sm:p-8 rounded-2xl flex flex-col justify-between transition-all ${
                plan.is_popular
                  ? 'bg-slate-900 border-2 border-cyan-500/60 shadow-xl shadow-cyan-500/10 relative'
                  : 'bg-slate-900/50 border border-slate-800'
              }`}
            >
              <div>
                {plan.badge && (
                  <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-4">
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold text-white font-['Outfit']">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{plan.short_description}</p>

                <div className="mt-6 mb-6">
                  {plan.price_type === 'custom_quote' ? (
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                        Architecture Scope
                      </span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
                        Custom Quote
                      </span>
                      <span className="text-[11px] text-cyan-400 block mt-1">
                        Tailored milestone delivery schedule
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-slate-400">Starting from</span>
                        <span className="text-3xl font-extrabold text-white font-['Outfit']">
                          ₹{plan.price.toLocaleString('en-IN')}+
                        </span>
                        <span className="text-xs text-slate-400 font-mono">INR</span>
                      </div>
                      <span className="text-[11px] text-cyan-400 block mt-1">
                        {plan.advance_percentage}% Advance to initiate development
                      </span>
                    </>
                  )}
                </div>

                <ul className="space-y-2 mb-8 text-xs text-slate-300">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan(plan)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                  plan.is_popular
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {plan.price_type === 'custom_quote' ? 'Request Custom Quote' : 'Choose Plan & Pay Advance'}
              </button>
            </div>
          ))}
        </div>

        {/* Pricing Scope Notice */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 text-center max-w-3xl mx-auto shadow-md">
          <span className="text-white font-semibold block mb-0.5 font-['Outfit']">Clear Pricing Scope:</span>
          Final pricing depends on requirements, features, integrations, design, development scope and project complexity. We do not promise fixed final pricing when requirements are unknown.
        </div>
      </section>

      {/* 7. TESTIMONIALS & TRUST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Feedback
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Client Experiences
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            (Sample / demo reviews illustrating customer partnerships across retail and educational sectors)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed italic mb-6">"{t.feedback}"</p>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{t.client_name}</h4>
                  <p className="text-[11px] text-slate-400">
                    {t.client_role}, {t.company_name}
                  </p>
                </div>
                <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                  Varanasi
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Common questions about technical delivery, payments, and timelines.
          </p>
        </div>

        <div className="space-y-3">
          {featuredFaqs.map((faq) => (
            <div key={faq.id} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-2">{faq.question}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => onNavigate('faq')}
            className="text-xs font-semibold text-cyan-400 hover:underline"
          >
            Read all frequently asked questions →
          </button>
        </div>
      </section>

      {/* 9. CONTACT CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-cyan-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Ready to Turn Your Idea into Reality?
            </h2>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              Connect directly with SrijanTech in Varanasi. We'll examine your project scope and provide
              a detailed architectural blueprint within 24 hours.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onOpenEnquiry()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-sky-500/25 transition-all"
              >
                Submit Project Brief
              </button>
              <a
                href="https://wa.me/917269068483"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: 7269068483</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
