'use client';

import React, { useState } from 'react';
import { Trophy, Calendar, UserCheck, Sparkles, Medal } from 'lucide-react';
import { schoolData } from '@/data/mockSchoolData';

export const StudentLife: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Keagamaan', 'Kepemimpinan', 'Kreativitas & Sains', 'Olahraga & Seni'];

  const filteredEkskul =
    filterCategory === 'Semua'
      ? schoolData.extracurriculars
      : schoolData.extracurriculars.filter((item) => item.category === filterCategory);

  return (
    <section id="kesiswaan" className="py-16 lg:py-24 bg-stone-50 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-madrasah-950 tracking-tight leading-tight mb-3">
            Kesiswaan, Ekstrakurikuler & Prestasi
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Wadah pengembangan bakat, pembentukan mental kepemimpinan santri, serta torehan prestasi di kancah daerah dan nasional.
          </p>
        </div>

        {/* Prestasi / Hall of Fame Grid */}
        <div id="prestasi" className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-gold-500" strokeWidth={2} />
            <h3 className="font-display text-xl font-bold text-madrasah-950">
              Galeri Prestasi Santri Terkini
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {schoolData.achievements.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-madrasah-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-madrasah-800 bg-madrasah-50 px-2.5 py-0.5 rounded-full border border-madrasah-200/70">
                      <Medal className="w-3 h-3 text-gold-500" />
                      <span>{item.level}</span>
                    </span>
                    <span className="font-mono text-xs text-stone-400 font-semibold">{item.year}</span>
                  </div>

                  <h4 className="font-display text-sm font-bold text-madrasah-950 leading-snug mb-2">
                    {item.title}
                  </h4>

                  <p className="text-xs text-stone-500 line-clamp-2 mb-3">
                    {item.event}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <span className="text-[11px] font-medium text-stone-700 block truncate">
                    Oleh: {item.recipient}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ekstrakurikuler Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="font-display text-xl font-bold text-madrasah-950">
              Pengembangan Diri & Ekstrakurikuler
            </h3>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  type="button"
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    filterCategory === cat
                      ? 'bg-madrasah-900 text-white shadow-sm'
                      : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Ekstrakurikuler Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEkskul.map((ekskul) => (
              <div
                key={ekskul.id}
                className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-madrasah-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-madrasah-800 bg-madrasah-50 px-2 py-0.5 rounded">
                      {ekskul.category}
                    </span>
                  </div>

                  <h4 className="font-display text-base font-bold text-madrasah-950 mb-2">
                    {ekskul.name}
                  </h4>

                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {ekskul.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-stone-100 text-xs text-stone-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-madrasah-600 flex-shrink-0" />
                    <span>{ekskul.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-madrasah-600 flex-shrink-0" />
                    <span>Pembina: {ekskul.coach}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
