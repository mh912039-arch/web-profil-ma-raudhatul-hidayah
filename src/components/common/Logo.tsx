'use client';

import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  showText = true,
}) => {
  const iconPixelSizes = {
    sm: 36,
    md: 46,
    lg: 60,
  };

  const isLight = variant === 'light';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Official School Emblem extracted from logo Ma.pdf */}
      <div
        className={`relative flex items-center justify-center rounded-xl overflow-hidden flex-shrink-0 transition-transform ${
          isLight ? 'bg-white/10 p-0.5' : 'bg-transparent'
        }`}
      >
        <img
          src="/school-logo.png"
          alt="Logo Resmi MA Raudlatul Hidayah"
          width={iconPixelSizes[size]}
          height={iconPixelSizes[size]}
          className="object-contain filter drop-shadow-sm hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = '/logo.png';
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-display font-bold tracking-tight leading-none ${
              size === 'sm'
                ? 'text-base'
                : size === 'lg'
                ? 'text-xl'
                : 'text-lg'
            } ${isLight ? 'text-white' : 'text-madrasah-950'}`}
          >
            MA Raudlatul Hidayah
          </span>
          <span
            className={`text-xs tracking-wider uppercase font-medium mt-1 ${
              isLight ? 'text-madrasah-200' : 'text-stone-500'
            }`}
          >
            Madrasah Aliyah Unggulan
          </span>
        </div>
      )}
    </div>
  );
};
