import React from 'react';
import Link from 'next/link';
import { Quote, ArrowRight, ShieldCheck } from 'lucide-react';
import { schoolData } from '@/data/mockSchoolData';

export const EditorialGreeting: React.FC = () => {
  const { headmaster } = schoolData;

  return (
    <section id="sambutan" className="py-16 lg:py-24 bg-white border-b border-slate-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Kicker */}
        <div className="flex items-center gap-3 mb-10 pb-4 border-b border-slate-200/80">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-800">
            01 / WARKAT PIMPINAN
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500 font-medium">
            Amanat & Visi Pendidikan Kepala Sekolah
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Formal Portrait Frame (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/90 shadow-sm">
              <div className="relative h-80 sm:h-96 w-full rounded-xl overflow-hidden bg-slate-200">
                <img
                  src={headmaster.photoUrl}
                  alt={headmaster.name}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>

              {/* Portrait Caption */}
              <div className="p-4 bg-white rounded-xl mt-3 border border-slate-200/70">
                <div className="font-display font-bold text-base text-slate-950">
                  {headmaster.name}
                </div>
                <div className="text-xs font-semibold text-amber-800 mt-0.5">
                  Kepala Sekolah MA Raudhatul Hidayah
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  NIP. {headmaster.nip}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Open Letter Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Big Editorial Quote */}
            <blockquote className="relative">
              <Quote className="w-10 h-10 text-amber-200 absolute -top-4 -left-2 -z-10" />
              <h2 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-bold text-slate-950 tracking-tight leading-snug">
                "Pendidikan bukan sekadar transfer ilmu hafalan, melainkan menumbuhkan rasa ingin tahu yang berakar pada keteguhan adab dan budi pekerti."
              </h2>
            </blockquote>

            {/* Letter Paragraphs */}
            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                Bismillahirrohmanirrohim. Assalamu’alaikum Warahmatullahi Wabarakatuh.
                Selamat datang di portal informasi resmi MA Raudhatul Hidayah. Kami meyakini bahwa masa Sekolah Menengah Pertama (SMP) adalah fase paling menentukan dalam pembentukan karakter, logika berpikir, dan kemandirian seorang anak.
              </p>
              <p>
                Melalui penerapan Kurikulum Merdeka yang integratif dengan nilai-nilai kepesantrenan Ahlussunnah wal Jama’ah, kami mendampingi setiap siswa agar memiliki pemahaman akidah yang lurus, kebiasaan ibadah yang disiplin, serta kecakapan literasi dan sains yang siap bersaing saat melangkah ke jenjang SMA, SMK, maupun MA unggulan.
              </p>
            </div>

            {/* Credo Callout Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border-l-4 border-amber-600 text-xs sm:text-sm text-slate-700 italic">
              "Ilmu tanpa adab ibarat pohon tanpa buah; adab tanpa ilmu ibarat pelita tanpa minyak."
            </div>

            {/* Action Link */}
            <div className="pt-2">
              <Link
                href="/profil"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-amber-800 transition-colors group"
              >
                <span>Baca Sejarah & Profil Lengkap Sekolah</span>
                <ArrowRight className="w-4 h-4 text-amber-700 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
