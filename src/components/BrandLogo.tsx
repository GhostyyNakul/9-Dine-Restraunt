import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function BrandLogo({ className = '', size = 'md', showText = false }: BrandLogoProps) {
  // Dimensions
  const sizeMap = {
    sm: 'w-8 h-8 text-base',
    md: 'w-10 h-10 text-xl',
    lg: 'w-14 h-14 text-2xl',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 text-3xl sm:text-4xl',
  };

  const currentSizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Crown + 9 Emblem */}
      <div className={`relative flex items-center justify-center shrink-0 ${currentSizeClass}`}>
        {/* Soft Radial Gold Glow behind logo */}
        <div className="absolute inset-0 rounded-full bg-[#f2ca50]/20 blur-md pointer-events-none animate-pulse" />

        {/* Crown SVG shape as background */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full text-[#f2ca50] drop-shadow-[0_2px_10px_rgba(242,202,80,0.5)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff7e6" />
              <stop offset="35%" stopColor="#f2ca50" />
              <stop offset="70%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#997a15" />
            </linearGradient>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Detailed Royal Crown silhouette */}
          <path
            d="M 12,38 L 26,72 L 74,72 L 88,38 L 68,52 L 50,22 L 32,52 Z"
            fill="url(#crownGold)"
            opacity="0.35"
          />
          <path
            d="M 12,38 L 26,72 L 74,72 L 88,38 L 68,52 L 50,22 L 32,52 Z"
            stroke="url(#crownGold)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            filter="url(#goldGlow)"
          />
          {/* Crown Jewels / Accents */}
          <circle cx="12" cy="36" r="3.5" fill="#fff7e6" />
          <circle cx="50" cy="20" r="4.5" fill="#fff7e6" />
          <circle cx="88" cy="36" r="3.5" fill="#fff7e6" />
          <circle cx="32" cy="50" r="2.5" fill="#f2ca50" />
          <circle cx="68" cy="50" r="2.5" fill="#f2ca50" />
          {/* Crown Base Rim */}
          <path d="M 22,76 L 78,76" stroke="url(#crownGold)" strokeWidth="3" strokeLinecap="round" />
          <path d="M 26,81 L 74,81" stroke="url(#crownGold)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        </svg>

        {/* The numeral '9' centered inside & in front of the crown */}
        <span className="relative z-10 font-serif font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#f2ca50] to-[#b38f24] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] select-none translate-y-[2px]">
          9
        </span>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-serif font-bold text-lg md:text-xl text-[#f2ca50] tracking-wide leading-none">
            9 DINE
          </span>
          <span className="text-[9px] font-label-caps tracking-[0.25em] text-[#d0c5af]/80">
            LUXURY DINING
          </span>
        </div>
      )}
    </div>
  );
}
