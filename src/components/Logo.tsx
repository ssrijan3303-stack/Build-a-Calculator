import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'invoice';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  onClick,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Abstract Tech Node + Geometric S Symbol */}
      <div className={`relative flex-shrink-0 ${iconSizes[size]}`}>
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_2px_10px_rgba(6,182,212,0.25)]">
          <defs>
            <linearGradient id="logoGrad" x1="2" y1="2" x2="46" y2="46" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="nodeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {/* Background Rounded Shield */}
          <rect width="48" height="48" rx="12" fill={variant === 'invoice' ? '#0F172A' : '#090D16'} />
          <rect x="0.5" y="0.5" width="47" height="47" rx="11.5" stroke="#38BDF8" strokeOpacity="0.25" />

          {/* Flowing Tech 'S' Circuit */}
          <path
            d="M33 15C33 11.6863 30.3137 9 27 9H19C14.5817 9 11 12.5817 11 17C11 21.4183 14.5817 25 19 25H29C33.4183 25 37 28.5817 37 33C37 37.4183 33.4183 41 29 41H18C14.134 41 11 37.866 11 34"
            stroke="url(#logoGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Core Nodes */}
          <circle cx="19" cy="17" r="2.5" fill="url(#nodeGrad)" />
          <circle cx="29" cy="33" r="2.5" fill="#818CF8" />
          <line x1="21" y1="25" x2="27" y2="25" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Typography Wordmark */}
      {variant !== 'icon' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center">
            <span
              className={`font-extrabold tracking-tight font-['Outfit'] ${
                variant === 'invoice' ? 'text-slate-900' : 'text-white'
              } ${textSizes[size]}`}
            >
              Srijan<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400">Tech</span>
            </span>
          </div>
          {variant === 'full' && (
            <span className="text-[9.5px] uppercase tracking-[0.2em] font-medium mt-0.5 text-slate-400">
              Varanasi • Digital Solutions
            </span>
          )}
        </div>
      )}
    </div>
  );
};
