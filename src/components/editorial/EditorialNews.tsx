import React from 'react';
import Link from 'next/link';
import { Newspaper, Calendar, ArrowRight, Clock } from 'lucide-react';
import { schoolData } from '@/data/mockSchoolData';

export const EditorialNews: React.FC = () => {
  const featured = schoolData.news[0];
  const sideArticles = schoolData.news.slice(1, 4);

  return (
    <section className="py-16 lg:py-24 bg-[#f8fafc] border-b border-slate-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-4 border-b border-slate-200/80">
          <div>
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
              04 / KABAR & PUBLIKASI RESMI
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Warta & Dinamika Terkini Sekolah
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              Catatan prestasi siswa, agenda pembiasaan akhlak, serta siaran informasi kelembagaan MA Raudlatul Hidayah.
            </p>
          </div>

          <Link
            href="/warta"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-900 hover:text-amber-800 transition-colors whitespace-nowrap group"
          >
            <span>Arsip Warta Lengkap</span>
            <ArrowRight className="w-4 h-4 text-amber-700 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Newsroom Split: 1 Featured Left + Vertical Stream Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Featured Article (7 cols) */}
          {featured && (
            <div className="lg:col-span-7">
              <Link
                href={`/warta/${featured.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-200">
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-md text-[11px] font-mono font-bold text-amber-400">
                    {featured.category}
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      <span>{featured.date}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>{featured.readTime}</span>
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-950 group-hover:text-amber-800 transition-colors leading-snug">
                    {featured.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {featured.summary}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-slate-900 group-hover:text-amber-800">
                    <span>Baca Artikel Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1 text-amber-700" />
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Side Articles Stream (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="px-2 pb-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Warta & Pengumuman Lainnya
              </span>
            </div>

            {sideArticles.map((item, idx) => (
              <Link
                key={item.id}
                href={`/warta/${item.slug}`}
                className="group block p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-2">
                  <span className="font-bold text-amber-800">
                    0{idx + 2} / {item.category}
                  </span>
                  <span>{item.date}</span>
                </div>

                <h4 className="font-display text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug mb-2">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </Link>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
