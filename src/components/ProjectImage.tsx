import React, { useState, useEffect } from 'react';

interface ProjectImageProps {
  src?: string;
  alt: string;
  className?: string;
  slug?: string;
  category?: string;
  title?: string;
}

// Map each business / project domain to its verified asset in public/assets/projects/
const KNOWN_PROJECT_ASSETS: Record<string, string> = {
  'ecommerce-website': '/assets/projects/ecommerce.webp',
  'restaurant-website': '/assets/projects/restaurant.webp',
  'gym-fitness-website': '/assets/projects/gym.webp',
  'hospital-website': '/assets/projects/hospital.webp',
  'real-estate-website': '/assets/projects/realestate.webp',
  'hotel-pg-website': '/assets/projects/hotel.webp',
  'automobile-garage-website': '/assets/projects/automobile.webp',
  'event-management-website': '/assets/projects/event.webp',
  'grocery-supermarket-website': '/assets/projects/grocery.webp',
  'beauty-salon-spa-website': '/assets/projects/salon.webp',
  'school-college-portal': '/assets/projects/school.webp',
  'travel-tourism-website': '/assets/projects/travel.webp',
};

export function resolveProjectAsset(src?: string, slug?: string, category?: string, title?: string): string {
  if (src && src.trim() !== '') {
    return src.trim();
  }

  const s = (slug || '').toLowerCase();
  const c = (category || '').toLowerCase();
  const t = (title || '').toLowerCase();

  // Direct slug match
  if (s && KNOWN_PROJECT_ASSETS[s]) {
    return KNOWN_PROJECT_ASSETS[s];
  }

  // Keyword heuristic match across slug, category, or title
  const combined = `${s} ${c} ${t}`;
  if (combined.includes('ecom') || combined.includes('shop') || combined.includes('store') || combined.includes('cart')) {
    return '/assets/projects/ecommerce.webp';
  }
  if (combined.includes('rest') || combined.includes('food') || combined.includes('cafe') || combined.includes('dining')) {
    return '/assets/projects/restaurant.webp';
  }
  if (combined.includes('gym') || combined.includes('fit') || combined.includes('workout') || combined.includes('crossfit')) {
    return '/assets/projects/gym.webp';
  }
  if (combined.includes('hosp') || combined.includes('health') || combined.includes('medic') || combined.includes('clinic') || combined.includes('opd')) {
    return '/assets/projects/hospital.webp';
  }
  if (combined.includes('real') || combined.includes('estate') || combined.includes('prop') || combined.includes('villa') || combined.includes('bhk')) {
    return '/assets/projects/realestate.webp';
  }
  if (combined.includes('hotel') || combined.includes('pg') || combined.includes('hostel') || combined.includes('resort') || combined.includes('stay')) {
    return '/assets/projects/hotel.webp';
  }
  if (combined.includes('auto') || combined.includes('garage') || combined.includes('car') || combined.includes('motor') || combined.includes('vehicle')) {
    return '/assets/projects/automobile.webp';
  }
  if (combined.includes('event') || combined.includes('wed') || combined.includes('banquet') || combined.includes('plan')) {
    return '/assets/projects/event.webp';
  }
  if (combined.includes('groc') || combined.includes('super') || combined.includes('mart') || combined.includes('daily')) {
    return '/assets/projects/grocery.webp';
  }
  if (combined.includes('salon') || combined.includes('beauty') || combined.includes('spa') || combined.includes('parlour')) {
    return '/assets/projects/salon.webp';
  }
  if (combined.includes('school') || combined.includes('college') || combined.includes('edu') || combined.includes('acad')) {
    return '/assets/projects/school.webp';
  }
  if (combined.includes('travel') || combined.includes('tour') || combined.includes('trip') || combined.includes('ghat')) {
    return '/assets/projects/travel.webp';
  }

  return '/assets/projects/ecommerce.webp';
}

export const ProjectImage: React.FC<ProjectImageProps> = ({
  src,
  alt,
  className = '',
  slug = '',
  category = '',
  title = '',
}) => {
  const initialResolved = resolveProjectAsset(src, slug, category, title);
  const [currentSrc, setCurrentSrc] = useState<string>(initialResolved);
  const [errorStage, setErrorStage] = useState<number>(0);

  // Sync state when props change
  useEffect(() => {
    const resolved = resolveProjectAsset(src, slug, category, title);
    setCurrentSrc(resolved);
    setErrorStage(0);
  }, [src, slug, category, title]);

  const handleError = () => {
    if (!currentSrc || typeof currentSrc !== 'string') {
      setErrorStage(3);
      return;
    }

    if (errorStage === 0) {
      // Stage 1: Try .jpg if it was .webp
      if (currentSrc.endsWith('.webp')) {
        setCurrentSrc(currentSrc.replace(/\.webp$/, '.jpg'));
        setErrorStage(1);
        return;
      }
      if (currentSrc.endsWith('.svg')) {
        setCurrentSrc(currentSrc.replace(/\.svg$/, '.webp'));
        setErrorStage(1);
        return;
      }
      // If it already had .jpg, try .svg
      if (currentSrc.endsWith('.jpg')) {
        setCurrentSrc(currentSrc.replace(/\.jpg$/, '.svg'));
        setErrorStage(2);
        return;
      }
    }

    if (errorStage === 1) {
      // Stage 2: Try .svg if .jpg failed
      const base = currentSrc.replace(/\.(webp|jpg|png)$/, '');
      setCurrentSrc(`${base}.svg`);
      setErrorStage(2);
      return;
    }

    // Stage 3: High-fidelity Vector UI Card Fallback
    setErrorStage(3);
  };

  if (errorStage >= 3) {
    return (
      <div
        className={`w-full h-full min-h-[160px] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center p-4 text-center border border-slate-800 relative overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 bg-cyan-500/5 backdrop-blur-[1px]" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-2 text-cyan-400 shadow-lg shadow-cyan-500/10">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-xs font-bold text-white tracking-tight">{title || 'Live Concept Preview'}</div>
          <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{category || 'SrijanTech Solution'}</div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      referrerPolicy="no-referrer"
      loading="lazy"
      className={`object-cover object-top w-full h-full transition-transform duration-500 group-hover:scale-105 group-hover/card:scale-105 group-hover/img:scale-105 ${className}`}
    />
  );
};
