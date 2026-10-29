'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';

interface HeroSlide {
  id: number;
  image: string;
  alt: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    image: '/hero/slide-1.jpg',
    alt: 'Halaman Depan Kampus MA Raudlatul Hidayah',
  },
  {
    id: 2,
    image: '/hero/slide-2.jpg',
    alt: 'Halaman Sekolah & Gedung Madrasah',
  },
  {
    id: 3,
    image: '/hero/slide-3.jpg',
    alt: 'Galeri Prestasi Santri MA Raudlatul Hidayah',
  },
];

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Otomatis bergiliran berganti foto setiap 5.5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="beranda"
      className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden bg-stone-950 text-white"
      aria-label="Beranda MA Raudlatul Hidayah"
    >
      {/* Background Photo Carousel (3 Foto Sekolah Asli Bergiliran Otomatis) */}
      <div className="absolute inset-0 z-0">
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
                alt={slide.alt}
                className={`w-full h-full object-cover object-center transition-transform duration-[6000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* Gradient overlay on the left matching Figma layout for high readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/65 to-stone-950/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/40" />
            </div>
          );
        })}
      </div>

      {/* Hero Content (Left-aligned matching Figma Screen 1) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-5 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Madrasah Aliyah (MA) — Terakreditasi</span>
          </div>

          {/* Main Display Headline matching Figma */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 leading-[1.12] drop-shadow-md">
            Selamat Datang di <br className="hidden sm:inline" />
            <span className="text-emerald-300">MA Raudlatul Hidayah</span>
          </h1>

          {/* Subtitle in Indonesian */}
          <p className="text-stone-200 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 max-w-xl font-normal drop-shadow">
            Membina akidah, mengasah nalar, dan menegakkan akhlakul karimah. Pendidikan tingkat Madrasah Aliyah (MA) berbasis Kurikulum Merdeka dan pembiasaan karakter di Kecamatan Mauk, Kabupaten Tangerang.
          </p>

          {/* Action Buttons matching Figma */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/profil"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-emerald-700 hover:bg-emerald-800 transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              <span>Jelajahi Profil Madrasah</span>
              <ArrowRight className="w-4 h-4 text-emerald-200" />
            </Link>

            <Link
              href="/akademik"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-stone-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all whitespace-nowrap"
            >
              <Compass className="w-4 h-4 text-emerald-300" />
              <span>Program Akademik</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
