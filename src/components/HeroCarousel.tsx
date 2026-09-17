import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Globe,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Layers,
  ShoppingCart,
  MessageCircle,
} from 'lucide-react';

export interface HeroSlide {
  id: string;
  category: string;
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  subtitle: string;
  benefits: string[];
  icon: React.ComponentType<{ className?: string }>;
  primaryCtaText: string;
  secondaryCtaText: string;
  serviceId?: string;
  imageUrl: string;
  accentGlow: string;
}

const SLIDES: HeroSlide[] = [
  {
    id: 'web-dev',
    category: 'Web Development',
    badge: 'Core Engineering • Varanasi & Global',
    titlePrefix: 'High-Performance',
    titleHighlight: 'Web Architectures',
    titleSuffix: 'Engineered for Growth.',
    subtitle:
      'Bespoke corporate websites, marketing platforms, and responsive web portals built for sub-second page loads, SEO dominance, and high conversion.',
    benefits: ['<1s Core Web Vitals', 'Custom CMS & Clean UX', '100% Code Ownership'],
    icon: Globe,
    primaryCtaText: 'Get Free Consultation',
    secondaryCtaText: 'Explore Web Solutions',
    serviceId: 'srv-1',
    imageUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=80',
    accentGlow: 'from-sky-500/25 via-blue-600/20 to-cyan-500/15',
  },
  {
    id: 'mobile-app',
    category: 'Mobile App Development',
    badge: 'Cross-Platform iOS & Android',
    titlePrefix: 'Fluid Touch',
    titleHighlight: 'Mobile Applications',
    titleSuffix: 'With Native Power.',
    subtitle:
      'Modern iOS, Android, and Progressive Web Apps engineered for zero latency, offline caching, push notifications, and seamless app store releases.',
    benefits: ['iOS & Android Cross-Platform', 'Offline PWA Ready', 'Biometric Authentication'],
    icon: Smartphone,
    primaryCtaText: 'Start Mobile Project',
    secondaryCtaText: 'Explore Mobile Apps',
    serviceId: 'srv-2',
    imageUrl:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1920&q=80',
    accentGlow: 'from-blue-500/25 via-indigo-600/20 to-sky-500/15',
  },
  {
    id: 'ai-solutions',
    category: 'AI Solutions',
    badge: 'Intelligent Automation',
    titlePrefix: 'Practical & Grounded',
    titleHighlight: 'AI Integrations',
    titleSuffix: 'For Modern Workflows.',
    subtitle:
      'Supercharge daily operations with intelligent conversational agents, automated document extraction, and domain-grounded LLM workflows.',
    benefits: ['Private Context Grounding', 'Document & Invoice Extraction', 'Server-Side Security'],
    icon: Sparkles,
    primaryCtaText: 'Consult on AI',
    secondaryCtaText: 'Explore AI Solutions',
    serviceId: 'srv-3',
    imageUrl:
      'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1920&q=80',
    accentGlow: 'from-cyan-500/25 via-sky-600/20 to-violet-500/15',
  },
  {
    id: 'cybersecurity',
    category: 'Cybersecurity',
    badge: 'Defensive Architecture & Audits',
    titlePrefix: 'Enterprise-Grade',
    titleHighlight: 'Cybersecurity',
    titleSuffix: '& Hardened Systems.',
    subtitle:
      'Security-first development, penetration testing, OWASP Top 10 mitigation, strict Content Security Policies, and encrypted data architectures.',
    benefits: ['OWASP Top 10 Neutralization', 'Strict CSP & SSL Hardening', 'Comprehensive Audit Reports'],
    icon: ShieldCheck,
    primaryCtaText: 'Request Security Audit',
    secondaryCtaText: 'Explore Cybersecurity',
    serviceId: 'srv-4',
    imageUrl:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1920&q=80',
    accentGlow: 'from-emerald-500/25 via-teal-600/20 to-cyan-500/15',
  },
  {
    id: 'cloud-solutions',
    category: 'Cloud & Digital Solutions',
    badge: 'Cloud Infrastructure & Scalable SaaS',
    titlePrefix: 'Resilient Cloud &',
    titleHighlight: 'Digital Solutions',
    titleSuffix: 'Without Bloat.',
    subtitle:
      'Multi-role customer dashboards, cloud infrastructure, and database-backed SaaS portals designed to resolve your exact operational bottlenecks.',
    benefits: ['Role-Based Access Control', 'PostgreSQL & Cloud DBs', '99.9% Uptime Architecture'],
    icon: Layers,
    primaryCtaText: 'Plan Cloud Solutions',
    secondaryCtaText: 'Explore Architecture',
    serviceId: 'srv-5',
    imageUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    accentGlow: 'from-indigo-500/25 via-sky-600/20 to-blue-500/15',
  },
  {
    id: 'modern-software',
    category: 'Modern Software / Digital Technology',
    badge: 'Modern Software & UPI Commerce',
    titlePrefix: 'High-Performance',
    titleHighlight: 'Modern Software',
    titleSuffix: '& Digital Technology.',
    subtitle:
      'Online systems with frictionless Indian UPI QR checkout, real-time inventory management, automated GST invoices, and high-performance digital architectures.',
    benefits: ['Instant UPI QR Checkout', 'Automated GST Invoicing', 'Real-Time Inventory Sync'],
    icon: ShoppingCart,
    primaryCtaText: 'Launch Your Software',
    secondaryCtaText: 'Explore Technology',
    serviceId: 'srv-6',
    imageUrl:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=80',
    accentGlow: 'from-sky-500/25 via-cyan-600/20 to-blue-500/15',
  },
];

interface HeroCarouselProps {
  onOpenEnquiry: (serviceId?: string) => void;
  onNavigate: (tab: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onOpenEnquiry, onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    slideTimerRef.current = setInterval(() => {
      goToNext();
    }, 5000);

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [goToNext, isPaused, prefersReducedMotion]);

  const currentSlide = SLIDES[currentIndex];
  const CurrentIcon = currentSlide.icon;

  return (
    <section
      id="hero-carousel"
      className="relative overflow-hidden pt-6 sm:pt-10 pb-16 sm:pb-20 bg-slate-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="SrijanTech Featured Solutions Carousel"
    >
      {/* Background Image Layer with smooth opacity transitions */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-30' : 'opacity-0'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt=""
              loading={idx === 0 ? 'eager' : 'lazy'}
              className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform motion-safe:duration-7000"
            />
          </div>
        ))}

        {/* Ambient Radial Gradient matching active slide */}
        <div
          className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr ${currentSlide.accentGlow} blur-[140px] rounded-full transition-all duration-1000`}
        />

        {/* Dark Vignette Overlay for maximum text contrast */}
        <div className="absolute inset-0 bg-slate-950/85 backdrop-brightness-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/90" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Category Navigation Pills (Desktop & Tablet) */}
        <div className="hidden md:flex items-center justify-center gap-1.5 mb-8 flex-wrap">
          {SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            const Icon = slide.icon;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                type="button"
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/10 scale-105'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{slide.category}</span>
              </button>
            );
          })}
        </div>

        {/* Active Slide Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <CurrentIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-semibold">{currentSlide.badge}</span>
          </div>

          {/* Dynamic Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-['Outfit'] tracking-tight leading-[1.12] transition-all duration-300">
            {currentSlide.titlePrefix}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500">
              {currentSlide.titleHighlight}
            </span>{' '}
            {currentSlide.titleSuffix}
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {currentSlide.subtitle}
          </p>

          {/* Key Benefits List */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-300">
            {currentSlide.benefits.map((benefit, bIdx) => (
              <div
                key={bIdx}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-medium text-slate-200">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Dual CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              id={`hero-primary-cta-${currentSlide.id}`}
              onClick={() => onOpenEnquiry(currentSlide.serviceId)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-sky-500/25 active:scale-98 transition-all cursor-pointer"
            >
              <span>{currentSlide.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              id={`hero-secondary-cta-${currentSlide.id}`}
              onClick={() => onNavigate('services')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
            >
              <span>{currentSlide.secondaryCtaText}</span>
            </button>
          </div>
        </div>

        {/* Slide Controls: Prev / Next Buttons & Indicators */}
        <div className="mt-12 flex items-center justify-between max-w-4xl mx-auto px-4">
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous slide"
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dot Indicators */}
          <div className="flex items-center gap-2">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Slide ${idx + 1}: ${slide.category}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-8 bg-cyan-400 shadow-md shadow-cyan-400/50'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next slide"
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer shadow-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Trust Metrics Bar */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left max-w-4xl mx-auto">
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Leadership</div>
            <div className="text-xs sm:text-sm text-slate-200 font-medium mt-0.5">
              Direct Founder Engineering
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Performance</div>
            <div className="text-xs sm:text-sm text-slate-200 font-medium mt-0.5">
              Sub-Second Page Speeds
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Payment</div>
            <div className="text-xs sm:text-sm text-slate-200 font-medium mt-0.5">
              Native Indian UPI &amp; Cards
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Location</div>
            <div className="text-xs sm:text-sm text-slate-200 font-medium mt-0.5">
              Varanasi, UP, India
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
