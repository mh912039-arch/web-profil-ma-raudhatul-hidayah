'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HeroSlide {
  id: number;
  image: string;
  label: string;
  caption: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    image: '/hero/slide-1.jpg',
    label: 'Gedung Utama',
    caption: 'Halaman Depan MA Raudlatul Hidayah, Jl. Raya Tanjung Kait, Mauk',
  },
  {
    id: 2,
    image: '/hero/slide-2.jpg',
    label: 'Lingkungan Sekolah',
    caption: 'Kompleks Halaman Sekolah & Ruang Belajar Terpadu',
  },
  {
    id: 3,
    image: '/hero/slide-3.jpg',
    label: 'Prestasi Siswa',
    caption: 'Dokumentasi Apresiasi Prestasi & Semangat Pembelajar Siswa',
  },
];

export const EditorialHero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-[#fcfcfd] border-b border-slate-200/90 overflow-hidden">
      {/* Background Decorative Grid Lines (Subtle Editorial Paper Texture) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Manifesto & Institutional Badges (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Academic Metadata Kicker */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200/80 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>ESTD. 2015</span>
              <span className="text-slate-400">·</span>
              <span>NPSN 69941777</span>
              <span className="text-slate-400">·</span>
              <span className="font-semibold text-slate-900">AKREDITASI A</span>
            </div>

            {/* Main Editorial Headline */}
            <div className="space-y-3">
              <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-slate-950 tracking-tight leading-[1.12]">
                Membina Akidah, <br className="hidden sm:inline" />
                <span className="text-slate-800">Mengasah Nalar,</span> <br className="hidden sm:inline" />
                <span className="text-amber-800">Menegakkan Akhlak.</span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-normal pt-1">
                Lembaga pendidikan formal tingkat Madrasah Aliyah (MA) berbasis Kurikulum Merdeka di Kecamatan Mauk, Kabupaten Tangerang. Menyeimbangkan pembiasaan adab, kecerdasan nalar kritis, dan kesiapan melangkah ke jenjang sekolah lanjutan impian.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/profil"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm active:scale-[0.98] whitespace-nowrap"
              >
                <span>Mengenal Sekolah Kami</span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </Link>

              <Link
                href="/akademik"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-300/80 transition-colors whitespace-nowrap"
              >
                <Compass className="w-4 h-4 text-amber-600" />
                <span>Program Kurikulum SMP</span>
              </Link>
            </div>

            {/* Integrated Institutional Metrics Ticker */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4">
              <div>
                <div className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
                  1 : 20
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                  Rasio Guru : Siswa
                </div>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <div className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
                  Fase D
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                  Kurikulum Merdeka
                </div>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <div className="font-display text-xl sm:text-2xl font-extrabold text-amber-800">
                  92%+
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                  Lolos SMA/SMK Favorit
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Architectural Photography Frame (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl p-2 bg-white border border-slate-200 shadow-lg">
              
              {/* Photo Viewport */}
              <div className="relative h-80 sm:h-96 lg:h-[430px] rounded-xl overflow-hidden bg-slate-100">
                {slides.map((slide, idx) => {
                  const isActive = idx === currentSlide;
                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.caption}
                        className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${
                          isActive ? 'scale-105' : 'scale-100'
                        }`}
                      />
                      {/* Gentle bottom shade for badge legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    </div>
                  );
                })}

                {/* Overlaid Corner Badge */}
                <div className="absolute top-3 left-3 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900/85 backdrop-blur-sm text-white text-[11px] font-mono tracking-wider">
                    <span className="text-amber-400 font-bold">
                      0{currentSlide + 1}
                    </span>
                    <span className="text-slate-400">/</span>
                    <span>0{slides.length}</span>
                  </span>
                </div>

                {/* Bottom Photo Caption */}
                <div className="absolute bottom-3 left-3 right-3 z-20 text-white">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-amber-300">
                    {slides[currentSlide].label}
                  </div>
                  <p className="text-xs text-slate-200 leading-snug line-clamp-1 mt-0.5 font-normal">
                    {slides[currentSlide].caption}
                  </p>
                </div>
              </div>

              {/* Slide Progress Ticker */}
              <div className="flex items-center justify-between px-3 py-2.5 mt-1 text-[11px] text-slate-500 font-mono">
                <span>Kampus MA Raudlatul Hidayah</span>
                <div className="flex gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      type="button"
                      aria-label={`Lihat Slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentSlide
                          ? 'w-6 bg-slate-900'
                          : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
