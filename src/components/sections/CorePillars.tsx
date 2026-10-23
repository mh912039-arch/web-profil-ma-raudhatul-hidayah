import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, Trophy, ArrowRight } from 'lucide-react';

const pillars = [
  {
    number: '01',
    icon: BookOpen,
    title: 'Kurikulum Merdeka MA',
    description:
      'Pembelajaran interaktif yang menumbuhkan nalar kritis, kemampuan literasi, numerasi, dan keunggulan ilmu pengetahuan bagi santri Madrasah Aliyah.',
    linkHref: '/akademik',
    linkLabel: 'Lihat Kurikulum',
  },
  {
    number: '02',
    icon: ShieldCheck,
    title: 'Pendidikan Karakter & Adab Siswa',
    description:
      'Menanamkan nilai-nilai kejujuran, kedisiplinan, sopan santun, dan pembiasaan ibadah harian untuk membentuk kepribadian mulia sejak usia remaja.',
    linkHref: '/akademik',
    linkLabel: 'Pembiasaan Karakter',
  },
  {
    number: '03',
    icon: Trophy,
    title: 'Kesiapan Menuju SMA / SMK / MA Favorit',
    description:
      'Pendampingan belajar terarah dan pemetaan minat bakat untuk memastikan lulusan SMP siap bersaing masuk ke jenjang sekolah lanjutan tingkat atas impian.',
    linkHref: '/prestasi',
    linkLabel: 'Rekam Jejak Lulusan',
  },
];

export const CorePillars: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-stone-100/70 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Fondasi & Keunggulan</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight mb-3">
            Fondasi Kokoh, Membuka Peluang Masa Depan
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Tiga pilar strategis yang membentuk keunggulan belajar, pembinaan akhlak, dan kesiapan siswa SMP MAS Raudhatul Hidayah.
          </p>
        </div>

        {/* 3 White Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.number}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                      {pillar.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-stone-900 mb-3 group-hover:text-emerald-800 transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-stone-100">
                  <Link
                    href={pillar.linkHref}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors group/link"
                  >
                    <span>{pillar.linkLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-link:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CorePillars;
