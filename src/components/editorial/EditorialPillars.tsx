import React from 'react';
import Link from 'next/link';
import { GraduationCap, HeartHandshake, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

export const EditorialPillars: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-[#f8fafc] border-b border-slate-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-4 border-b border-slate-200/80">
          <div>
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
              02 / FONDASI PENDIDIKAN SMP
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Tiga Pilar Pembinaan Karakter & Akademik
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              Kerangka kurikulum terintegrasi yang dirancang khusus untuk memenuhi kebutuhan tumbuh kembang siswa usia 12–15 tahun.
            </p>
          </div>

          <Link
            href="/akademik"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-900 hover:text-amber-800 transition-colors whitespace-nowrap group"
          >
            <span>Selengkapnya di Akademik</span>
            <ArrowRight className="w-4 h-4 text-amber-700 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Asymmetric Bento Layout (7 cols + 5 cols, followed by 12-col base card) */}
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Bento Card 1: Kurikulum Merdeka (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5 text-slate-900" />
                  </div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
                    Fase D (Kelas VII - IX)
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-950 mb-3">
                  Kurikulum Merdeka & Penalaran Kritis
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                  Menerapkan pendekatan pembelajaran mendalam (*deep learning*) yang memadukan penguasaan konsep matematika dasar, sains terpadu, literasi bahasa, dan teknologi informatika secara aplikatif dan kontekstual.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Matematika Terapan</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>IPA Terpadu</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Informatika Dasar</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Bahasa & Literasi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Adab & Karakter (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
                    <HeartHandshake className="w-5 h-5 text-slate-900" />
                  </div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                    Nilai Budi Pekerti
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-950 mb-3">
                  Pendidikan Karakter & Adab Harian
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                  Menanamkan kebiasaan ibadah wajib dan sunnah, adab menghormati guru serta orang tua, dan kejujuran sebagai pondasi utama sebelum siswa mengejar prestasi akademis.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Pembiasaan Sholat Berjamaah</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Bimbingan Tahsin & Setoran Quran</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Kultum Santun & Kepedulian Teman</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bento Card 3: Persiapan Masuk SMA/SMK Favorit (12 cols Horizontal) */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <div className="lg:col-span-8 space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>JALUR KELANJUTAN STUDI KELAS IX</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Kesiapan Sukses Melangkah ke SMA, SMK & MA Favorit
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                  Pendampingan terpadu mencakup pemetaan potensi minat bakat, pengayaan soal asesmen akhir, simulasi ujian berbasis komputer, serta bimbingan konsultasi jalur zonasi dan prestasi ke sekolah lanjutan atas impian.
                </p>
              </div>

              <div className="lg:col-span-4 flex lg:justify-end">
                <Link
                  href="/prestasi"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors shadow-sm whitespace-nowrap"
                >
                  <span>Lihat Prestasi & Lulusan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
