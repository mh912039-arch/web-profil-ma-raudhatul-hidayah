import React from 'react';
import Link from 'next/link';
import { Quote, ArrowRight } from 'lucide-react';
import { schoolData } from '@/data/mockSchoolData';

export const HeadmasterGreeting: React.FC = () => {
  const { headmaster } = schoolData;

  return (
    <section id="sambutan" className="py-16 lg:py-24 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Headmaster Photo Card matching Figma (4 cols) */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100 max-w-sm w-full">
              <div className="h-80 sm:h-96 w-full">
                <img
                  src={headmaster.photoUrl}
                  alt={headmaster.name}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <div className="p-4 bg-white border-t border-stone-100">
                <h3 className="font-display text-base font-bold text-stone-900">
                  {headmaster.name}
                </h3>
                <p className="text-xs text-emerald-700 font-medium">
                  {headmaster.title}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  NIP. {headmaster.nip}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Message matching Figma (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-800 uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Dari Kepala Madrasah</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight mb-5">
              Setiap Santri Memiliki Potensi. Setiap Masa Depan Memiliki Jalan Mulia
            </h2>

            <div className="space-y-4 text-stone-600 leading-relaxed text-sm sm:text-base mb-6">
              <p>
                Bismillah walhamdulillah. Selamat datang di portal resmi MA Raudlatul Hidayah. Kami meyakini bahwa pendidikan sejati tidak hanya mengasah kecerdasan intelektual, tetapi juga menumbuhkan kepekaan nurani, keteguhan akidah, dan akhlakul karimah.
              </p>
              <p>
                Di lingkungan sekolah kami, setiap siswa didorong untuk berani bereksplorasi dalam ilmu pengetahuan dan nalar kritis, sembari tetap berakar kuat pada nilai-nilai adab, akhlakul karimah, dan budi pekerti luhur.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/profil"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 group transition-colors"
              >
                <span>Pelajari Lebih Lanjut Profil & Visi Madrasah</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeadmasterGreeting;
