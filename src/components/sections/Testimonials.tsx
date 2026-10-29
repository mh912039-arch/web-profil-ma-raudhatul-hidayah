import React from 'react';
import { Quote } from 'lucide-react';
import { schoolData } from '@/data/mockSchoolData';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-madrasah-950 tracking-tight leading-tight mb-3">
            Amanah & Suara Komunitas Madrasah
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Refleksi nyata dari para wali santri dan alumni yang telah menuntaskan masa studi di MA Raudlatul Hidayah.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schoolData.testimonials.map((testi) => (
            <div
              key={testi.id}
              className="bg-stone-50 rounded-2xl p-6 sm:p-7 border border-stone-200/90 shadow-sm flex flex-col justify-between"
            >
              <div>
                <Quote className="w-6 h-6 text-madrasah-700/40 mb-4" strokeWidth={1.5} />
                <p className="text-sm text-stone-700 leading-relaxed italic mb-6">
                  "{testi.message}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-stone-200/70">
                <img
                  src={testi.avatarUrl}
                  alt={testi.name}
                  className="w-10 h-10 rounded-full object-cover border border-stone-300"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <h4 className="font-display text-xs sm:text-sm font-bold text-madrasah-950 truncate">
                    {testi.name}
                  </h4>
                  <p className="text-[11px] font-medium text-madrasah-800 truncate">
                    {testi.role}
                  </p>
                  <p className="text-[10px] text-stone-500 truncate">
                    {testi.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
