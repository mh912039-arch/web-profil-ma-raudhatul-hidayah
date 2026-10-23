import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface PageHeaderProps {
  badge?: string;
  title: string;
  description: string;
  currentBreadcrumb?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  badge,
  title,
  description,
  currentBreadcrumb,
  imageUrl = '/hero/slide-1.jpg',
  imageAlt = 'MAS Raudhatul Hidayah',
}) => {
  return (
    <section className="bg-stone-50/80 border-b border-stone-200/80 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        {currentBreadcrumb && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-500 mb-6">
            <Link href="/" className="hover:text-emerald-700 flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-emerald-800 font-semibold">{currentBreadcrumb}</span>
          </nav>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Eyebrow + Big Headline + Description (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {badge && (
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>{badge}</span>
              </div>
            )}

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 mb-4 leading-tight">
              {title}
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          {/* Right Column: Visual Photo Card matching Figma (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm bg-white h-56 sm:h-64 lg:h-72 w-full group">
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PageHeader;
