import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

const spaces = [
  {
    title: 'Perpustakaan & Khazanah Turots',
    category: 'Literasi & Referensi',
    description: 'Koleksi buku bacaan, ensiklopedia pengetahuan umum, buku pelajaran, serta khazanah kitab keagamaan.',
    imageUrl: '/perpus2.jpeg',
    link: '/akademik#fasilitas',
  },
  {
    title: 'Halaman Sekolah',
    category: 'Lingkungan Sekolah',
    description: 'Area upacara bendera, pembiasaan senam pagi, latihan kepanduan pramuka, dan olahraga siswa.',
    imageUrl: '/hero/slide-2.jpg',
    link: '/profil/fasilitas',
  },
  {
    title: 'Ruang Kelas Pembelajaran',
    category: 'Fasilitas Belajar',
    description: 'Ruang kelas yang bersih dan kondusif untuk mendukung kegiatan belajar mengajar interaktif siswa.',
    imageUrl: '/kelas.jpeg',
    link: '/profil/fasilitas',
  },
];

export const CampusSpaces: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Right Link matching Figma */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Lingkungan & Sarana</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Tempat Menjelajah, Tempat Tumbuh Bersama
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              Sarana representatif di lingkungan sekolah MAS Raudhatul Hidayah yang menunjang kenyamanan dan perkembangan siswa.
            </p>
          </div>

          <Link
            href="/galeri"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors whitespace-nowrap group"
          >
            <span>Buka Galeri Foto</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Cards Grid matching user request */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {spaces.map((space, idx) => (
            <Link
              key={idx}
              href={space.link}
              className="group bg-stone-50 rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-stone-200">
                <img
                  src={space.imageUrl}
                  alt={space.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold text-emerald-800">
                  {space.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors mb-2">
                    {space.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2">
                    {space.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-200/70 flex items-center text-xs font-semibold text-emerald-700 group-hover:text-emerald-900">
                  <span>Lihat Selengkapnya</span>
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

export default CampusSpaces;
