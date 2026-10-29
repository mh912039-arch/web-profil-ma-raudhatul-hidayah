import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Building2, MapPin } from 'lucide-react';

export const EditorialSpaces: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-white border-b border-slate-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-4 border-b border-slate-200/80">
          <div>
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
              03 / SARANA & RUANG BELAJAR
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Lingkungan Pendidikan yang Nyata & Kondusif
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              Sarana otentik di lingkungan sekolah MA Raudlatul Hidayah yang dirawat untuk kenyamanan belajar dan tumbuh kembang siswa.
            </p>
          </div>

          <Link
            href="/galeri"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-900 hover:text-amber-800 transition-colors whitespace-nowrap group"
          >
            <span>Buka Galeri Foto Lengkap</span>
            <ArrowRight className="w-4 h-4 text-amber-700 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Card 1: Perpustakaan & Khazanah Turots (7 cols - Featured) */}
            <div className="lg:col-span-7 bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between group">
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-200">
                <img
                  src="/perpus2.jpeg"
                  alt="Perpustakaan & Khazanah Turots MA Raudlatul Hidayah"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-md text-[11px] font-mono font-bold text-amber-400">
                  LITERASI & TUROTS
                </div>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-950 mb-2 group-hover:text-amber-800 transition-colors">
                    Perpustakaan & Khazanah Turots Sekolah
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Menyediakan ribuan koleksi buku paket Kurikulum Merdeka, ensiklopedia pengetahuan umum, serta kitab referensi keagamaan yang dapat diakses langsung oleh siswa untuk mengasah budaya literasi dan riset mandiri.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-900 group-hover:text-amber-800">
                  <span>Pusat Sumber Belajar Utama</span>
                  <Link href="/akademik#fasilitas" className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-900">
                    <span>Lihat Rincian</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Ruang Kelas Pembelajaran (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between group">
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-200">
                <img
                  src="/kelas.jpeg"
                  alt="Ruang Kelas Pembelajaran MA Raudlatul Hidayah"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-md text-[11px] font-mono font-bold text-amber-400">
                  RUANG KELAS
                </div>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-950 mb-2 group-hover:text-amber-800 transition-colors">
                    Ruang Kelas Pembelajaran Aktif
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Kondisi ruang kelas yang bersih, pencahayaan optimal, dan tata kelola meja diskusi yang mendukung proses pembelajaran interaktif serta kenyamanan interaksi guru dan murid.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-900">
                  <span className="text-slate-500">Kapasitas Maksimal 24 Siswa / Kelas</span>
                </div>
              </div>
            </div>

          </div>

          {/* Card 3: Halaman Sekolah & Lapangan (Horizontal Split) */}
          <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              
              <div className="lg:col-span-5 relative h-56 sm:h-64 lg:h-full min-h-[220px] overflow-hidden bg-slate-200">
                <img
                  src="/hero/slide-2.jpg"
                  alt="Halaman Sekolah MA Raudlatul Hidayah"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-md text-[11px] font-mono font-bold text-amber-400">
                  AREA OUTDOOR
                </div>
              </div>

              <div className="lg:col-span-7 p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>Kompleks Gedung MA Raudlatul Hidayah, Tanjung Anom</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-950">
                  Halaman Sekolah & Area Aktivitas Bersama
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Pusat kegiatan luar ruangan yang digunakan secara rutin untuk pelaksanaan upacara bendera hari Senin, latihan kepanduan Pramuka Penggalang, senam kebugaran jasmani, dan kegiatan projek P5 siswa.
                </p>
                <div className="pt-2">
                  <Link
                    href="/kesiswaan"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-amber-800 transition-colors"
                  >
                    <span>Pelajari Kegiatan Kesiswaan & Ekskul</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
