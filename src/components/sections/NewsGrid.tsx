'use client';

import React from 'react';
import Link from 'next/link';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { schoolData } from '@/data/mockSchoolData';

export const NewsGrid: React.FC = () => {
  const articles = schoolData.news.slice(0, 3);

  return (
    <section id="warta" className="py-16 lg:py-24 bg-stone-100/70 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Figma (Around School / Kabar Terkini) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
              <Newspaper className="w-4 h-4 text-emerald-600" />
              <span>Warta & Informasi</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Kabar Terkini MAS Raudhatul Hidayah
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              Informasi prestasi, kegiatan akademik, dan pengumuman resmi madrasah.
            </p>
          </div>

          <Link
            href="/warta"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors whitespace-nowrap group"
          >
            <span>Buka Semua Warta</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 News Cards Grid matching Figma Screen 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((item) => (
            <Link
              key={item.id}
              href={`/warta/${item.slug}`}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-md hover:border-emerald-600/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold text-emerald-800 shadow-sm">
                    {item.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-3 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors mb-2.5 leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-stone-100 flex items-center text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default NewsGrid;
