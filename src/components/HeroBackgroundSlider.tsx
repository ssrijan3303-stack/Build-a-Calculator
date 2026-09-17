import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  fallbackGradient: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 'web-dev',
    title: 'Web Engineering & Bespoke Platforms',
    category: 'Web Development',
    imageUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=80',
    fallbackGradient: 'from-blue-950/90 via-slate-950/95 to-slate-950',
  },
  {
    id: 'mobile-app',
    title: 'Mobile Applications & Cross-Platform Systems',
    category: 'Mobile App Development',
    imageUrl:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1920&q=80',
    fallbackGradient: 'from-indigo-950/90 via-slate-950/95 to-slate-950',
  },
  {
    id: 'ai-solutions',
    title: 'Intelligent AI Systems & Automation',
    category: 'AI Solutions',
    imageUrl:
      'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1920&q=80',
    fallbackGradient: 'from-cyan-950/90 via-slate-950/95 to-slate-950',
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Enterprise Hardening',
    category: 'Cybersecurity',
    imageUrl:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1920&q=80',
    fallbackGradient: 'from-emerald-950/90 via-slate-950/95 to-slate-950',
  },
  {
    id: 'cloud-solutions',
    title: 'Scalable Cloud Architecture & Databases',
    category: 'Cloud & Digital Solutions',
    imageUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    fallbackGradient: 'from-sky-950/90 via-slate-950/95 to-slate-950',
  },
  {
    id: 'modern-software',
    title: 'Modern Software & Enterprise Digital Products',
    category: 'Modern Software / Digital Technology',
    imageUrl:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=80',
    fallbackGradient: 'from-purple-950/90 via-slate-950/95 to-slate-950',
  },
];

export const HeroBackgroundSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    // Automatic slide change every 4.5 seconds
    const interval = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(interval);
  }, [handleNext, prefersReducedMotion, isPaused]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-35 z-0' : 'opacity-0 -z-10'
            }`}
          >
            {/* Background image */}
            <img
              src={slide.imageUrl}
              alt={slide.title}
              loading={index === 0 ? 'eager' : 'lazy'}
              className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform motion-safe:duration-10000"
            />
          </div>
        );
      })}

      {/* Dark Multi-layer Vignette & Radial Gradient Overlays for pristine text legibility */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-brightness-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(14,165,233,0.12),transparent_70%)]" />

      {/* Subtle Slide Controls (Pointer events enabled for arrows & indicators) */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-between px-6 max-w-7xl mx-auto pointer-events-auto">
        {/* Active Slide Category Tag */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-medium text-slate-300 backdrop-blur-md shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-300 font-semibold">{HERO_SLIDES[currentIndex].category}</span>
        </div>

        {/* Minimalist Slide Indicators (Dots) */}
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}: ${slide.category}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 bg-cyan-400 shadow-sm shadow-cyan-400/50'
                  : 'w-1.5 bg-slate-600 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* Subtle Next / Prev Buttons */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="p-1.5 rounded-lg bg-slate-900/70 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="p-1.5 rounded-lg bg-slate-900/70 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
