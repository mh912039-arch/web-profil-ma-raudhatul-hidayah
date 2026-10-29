import React from 'react';
import { Target, Compass, Shield, BookCheck, Sparkles, Building2 } from 'lucide-react';
import { schoolData } from '@/data/mockSchoolData';

export const IdentityBento: React.FC = () => {
  const { visionMission, profile } = schoolData;

  return (
    <section className="py-16 lg:py-24 bg-stone-100/70 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-madrasah-950 tracking-tight leading-tight mb-3">
            Visi, Misi & Falsafah Nilai Pendidikan
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Fondasi kelembagaan MA Raudlatul Hidayah yang menuntun arah kurikulum, pembinaan karakter santri, dan tata kelola madrasah unggul.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Cell 1: Visi Madrasah (Span 7 cols) */}
          <div className="md:col-span-7 bg-madrasah-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-madrasah-800 shadow-md">
            <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-64 h-64 bg-madrasah-800/30 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-madrasah-900 border border-madrasah-700/60 text-gold-400 text-xs font-semibold mb-6">
                <Target className="w-3.5 h-3.5" strokeWidth={2} />
                <span>Visi Utama Lembaga</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold leading-snug tracking-tight text-white mb-4">
                "{visionMission.vision}"
              </h3>
            </div>

            <div className="pt-6 mt-6 border-t border-madrasah-800/80 flex items-center justify-between text-xs text-stone-300">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-madrasah-400" />
                <span>Didirikan Tahun {profile.foundedYear}</span>
              </span>
              <span className="font-mono text-gold-400 font-medium">NPSN: {profile.npsn}</span>
            </div>
          </div>

          {/* Bento Cell 2: Misi Utama (Span 5 cols) */}
          <div className="md:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-madrasah-800 text-xs font-bold uppercase tracking-wider mb-4">
                <Compass className="w-4 h-4 text-madrasah-600" strokeWidth={2} />
                <span>Misi Strategis</span>
              </div>
              <ul className="space-y-3.5">
                {visionMission.missions.map((mission, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-madrasah-100 text-madrasah-900 font-bold text-xs flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{mission}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bento Cell 3: 4 Pilar Nilai Karakter (Span 12 cols, 4 sub-columns) */}
          <div className="md:col-span-12 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-madrasah-950">
                  Empat Pilar Karakter Santri
                </h3>
                <p className="text-xs text-stone-500">Nilai-nilai luhur yang ditanamkan dalam keseharian madrasah dan asrama</p>
              </div>
              <span className="text-xs font-semibold text-madrasah-700 bg-madrasah-50 px-3 py-1 rounded-md self-start sm:self-auto border border-madrasah-100">
                Ahlussunnah wal Jama’ah
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {visionMission.values.map((val, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 hover:border-madrasah-300 transition-colors"
                >
                  <div className="text-right font-serif text-lg text-madrasah-800 mb-1" dir="rtl">
                    {val.arabic}
                  </div>
                  <h4 className="font-display text-sm font-bold text-madrasah-950 mb-1.5">
                    {val.name}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {val.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
