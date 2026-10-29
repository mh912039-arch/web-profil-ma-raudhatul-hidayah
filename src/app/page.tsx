'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  Clock,
  CheckCircle2,
  ArrowRight,
  Compass,
  GraduationCap,
  Users,
  Award,
  Calendar,
  Megaphone,
} from 'lucide-react';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';
import { PpdbSection } from '@/components/sections/PpdbSection';
import { NewsCarouselSection } from '@/components/sections/NewsCarouselSection';
import { TeachersCarouselSection } from '@/components/sections/TeachersCarouselSection';
import { VisitorMetricsSection } from '@/components/sections/VisitorMetricsSection';
import { PpdbRegistrationModal } from '@/components/modals/PpdbRegistrationModal';

const defaultHomeConfig = {
  heroTitle: 'MA Raudlatul Hidayah',
  heroTagline: 'Membentuk Generasi Berkarakter, Beradab, dan Unggul Bernalar',
  heroBadge: 'Portal Resmi MA Raudlatul Hidayah',
  heroBackground: '/foto-semua.jpeg',
  heroBackgrounds: [
    '/foto-semua.jpeg',
    '/halaman-sekolah.jpeg',
    '/paskibra.jpeg',
  ],
  schoolLogo: '/school-logo.png',
  marqueeText1: 'PPDB (Penerimaan Peserta Didik Baru) MA Raudlatul Hidayah Tahun Ajaran 2027/2028 Telah Dibuka!',
  marqueeCta1: 'DAFTAR SEKARANG!',
  marqueeLink1: '/kontak',
  marqueeText2: 'Kuota Pendaftaran Terbatas • Pembinaan Berbasis Karakter & Kurikulum Merdeka • Mauk Tangerang',
  marqueeCta2: 'KONSULTASI WA',
  marqueeLink2: 'https://wa.me/628176614723',
  sambutanHeading: 'Sambutan Kepala Madrasah',
  sambutanSubtitle: 'Membina Integritas & Mutu Akademik',
  sambutanBadge: 'Pimpinan Satuan Pendidikan',
  headmasterName: 'A. Khutbi. AR, S.Pd',
  headmasterRole: 'Kepala Madrasah MA Raudlatul Hidayah',
  headmasterPhoto: '/kepala-madrasah.jpg',
  sambutanText1: 'Bismillah walhamdulillah. Assalamu’alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal resmi MA Raudlatul Hidayah jenjang Madrasah Aliyah (MA). Kami meyakini bahwa pendidikan sejati tidak hanya mengasah kecerdasan kognitif, tetapi juga merawat adab, keteguhan akidah, serta budi pekerti luhur sejak usia transisi remaja.',
  sambutanText2: 'Melalui integrasi Kurikulum Merdeka yang kontekstual dan kultur pembiasaan Islami, kami berikhtiar membimbing seluruh santri agar aktif bernalar, mencintai ilmu pengetahuan, dan terlatih hidup berdisiplin dalam lingkungan yang aman, ramah anak, serta penuh kehangatan persaudaraan.',
  ctaText: 'Pelajari Profil & Budaya Sekolah',
  ctaLink: '/profil/visi-misi',
  stat1Value: '152',
  stat1Label: 'Santri Aktif MA',
  stat2Value: '22',
  stat2Label: 'Guru & Staf',
  stat3Value: '35+',
  stat3Label: 'Prestasi',
  teachersSectionTitle: 'Guru',
  teachersSectionSubtitle: 'Menyambut Anda ke Dunia Pembelajaran yang Dipandu Guru-guru Terbaik',
};

export default function HomePage() {
  const [home, setHome] = useState(defaultHomeConfig);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const heroImages = useMemo(() => {
    if (Array.isArray(home.heroBackgrounds) && home.heroBackgrounds.length > 0) {
      const valid = home.heroBackgrounds.filter(
        (src) => typeof src === 'string' && src.trim().length > 0
      );
      if (valid.length > 0) return valid.slice(0, 3);
    }
    return [home.heroBackground || '/foto-semua.jpeg'];
  }, [home.heroBackgrounds, home.heroBackground]);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    fetch('/api/profile', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.homepage) {
          setHome((prev) => ({ ...prev, ...data.homepage }));
        }
      })
      .catch((err) => console.warn('Could not fetch homepage dynamic data:', err));

    const handleOpenModal = () => setIsRegModalOpen(true);
    window.addEventListener('open-ppdb-registration', handleOpenModal);

    // Auto open if URL param ?ppdb=open exists
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('ppdb') === 'open') {
        setIsRegModalOpen(true);
      }
    } catch (e) {}

    return () => window.removeEventListener('open-ppdb-registration', handleOpenModal);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#fbfbfa] font-sans text-slate-800 selection:bg-blue-600 selection:text-white relative">
      <StitchNavbar />

      <main className="w-full bg-[#fbfbfa] flex-grow">
        {/* =========================================================
            1. HERO SECTION (Translucent Campus Backdrop with Rich Contrast)
        ========================================================= */}
        <section className="relative min-h-[92dvh] lg:min-h-[100dvh] flex flex-col justify-between pt-28 sm:pt-32 pb-0 overflow-hidden border-b border-slate-800/30">
          {/* Real Campus Photo Background Slideshow with Translucent Cinematic Overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {heroImages.map((imgSrc, index) => (
              <div
                key={`${imgSrc}-${index}`}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentHeroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <Image
                  src={imgSrc}
                  alt={`${home.heroTitle} Latar ${index + 1}`}
                  fill
                  className="object-cover object-center scale-105 transition-transform duration-[12000ms] ease-out"
                  priority={index === 0}
                />
              </div>
            ))}
            {/* Translucent Dark Blue / Slate Overlay */}
            <div className="absolute inset-0 bg-slate-950/60 z-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/50 to-slate-950/85 z-20 pointer-events-none" />
          </div>

          {/* Center Emblem Crest & Grand Serif Title Branding */}
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center my-auto">
            {/* School Crest Container */}
            <div className="relative mb-3 flex flex-col items-center">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                <Image
                  src={home.schoolLogo || '/school-logo.png'}
                  alt={home.heroTitle}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Main Serif Headline */}
            <h1 className="font-serif text-[40px] sm:text-[60px] lg:text-[76px] font-bold text-white tracking-tight leading-[1.08] drop-shadow-xl">
              {home.heroTitle}
            </h1>

            {/* Tagline Motto */}
            <p className="font-sans text-[13px] sm:text-[15.5px] font-medium tracking-[0.16em] text-slate-100 uppercase mt-2.5 max-w-2xl drop-shadow-md">
              {home.heroTagline}
            </p>
          </div>

          {/* Running Ticker / Marquee PPDB Banner (Full Width beneath cards) */}
          <div className="relative z-20 w-full mt-10 bg-amber-500 border-y border-amber-600/50 shadow-md overflow-hidden py-3 text-blue-950 font-bold select-none">
            <div className="flex items-center animate-marquee cursor-pointer group">
              {[0, 1].map((copyIndex) => (
                <div key={copyIndex} className="flex items-center shrink-0">
                  <div className="flex items-center gap-3 px-8 text-[13.5px] sm:text-[14.5px] tracking-wide whitespace-nowrap">
                    <Megaphone className="w-4 h-4 text-red-600 fill-red-600 shrink-0 animate-bounce" />
                    <span>{home.marqueeText1}</span>
                    <GraduationCap className="w-4 h-4 text-blue-950 shrink-0" />
                    <button
                      type="button"
                      onClick={() => setIsRegModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-[#1e3a8a] text-white text-[12px] font-extrabold uppercase tracking-wider hover:bg-[#172554] transition-colors shadow-xs ml-1 cursor-pointer active:scale-95"
                    >
                      <span>{home.marqueeCta1 || 'DAFTAR SEKARANG!'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 px-8 text-[13.5px] sm:text-[14.5px] tracking-wide whitespace-nowrap">
                    <Megaphone className="w-4 h-4 text-red-600 fill-red-600 shrink-0" />
                    <span>{home.marqueeText2}</span>
                    <GraduationCap className="w-4 h-4 text-blue-950 shrink-0" />
                    <Link
                      href={home.marqueeLink2 || 'https://wa.me/628176614723'}
                      target={home.marqueeLink2?.startsWith('http') ? '_blank' : undefined}
                      rel={home.marqueeLink2?.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-[#1e3a8a] text-white text-[12px] font-extrabold uppercase tracking-wider hover:bg-[#172554] transition-colors shadow-xs ml-1"
                    >
                      <span>{home.marqueeCta2 || 'KONSULTASI WA'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            2. ABOUT SECTION (Editorial Split Stage with Negative Space)
        ========================================================= */}
        <section className="py-20 sm:py-32 bg-[#f8fafc] relative border-b border-slate-200/70 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Negative Space & Clean Typographic Hierarchy */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h2 className="font-serif text-[34px] sm:text-[46px] lg:text-[50px] font-bold text-slate-900 tracking-tight leading-[1.12]">
                    {home.sambutanHeading}
                  </h2>
                </div>

                <div className="font-sans text-[15px] sm:text-[16px] text-slate-600 flex flex-col gap-4 leading-relaxed max-w-xl">
                  <p>{home.sambutanText1}</p>
                  <p>{home.sambutanText2}</p>
                </div>

                {/* Key Fact Metric Counters */}
                <div className="grid grid-cols-3 gap-6 pt-5 border-t border-slate-200 max-w-lg">
                  <div>
                    <span className="font-serif text-[30px] sm:text-[36px] font-bold text-slate-900 block leading-tight">
                      {home.stat1Value}
                    </span>
                    <span className="font-sans text-[12px] text-slate-500 font-medium">
                      {home.stat1Label}
                    </span>
                  </div>
                  <div>
                    <span className="font-serif text-[30px] sm:text-[36px] font-bold text-slate-900 block leading-tight">
                      {home.stat2Value}
                    </span>
                    <span className="font-sans text-[12px] text-slate-500 font-medium">
                      {home.stat2Label}
                    </span>
                  </div>
                  <div>
                    <span className="font-serif text-[30px] sm:text-[36px] font-bold text-amber-600 block leading-tight">
                      {home.stat3Value}
                    </span>
                    <span className="font-sans text-[12px] text-slate-500 font-medium">
                      {home.stat3Label}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={home.ctaLink || '/profil/visi-misi'}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-slate-900 hover:bg-blue-600 text-white text-[13px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] group shadow-sm"
                  >
                    <span>{home.ctaText || 'Pelajari Profil & Budaya Sekolah'}</span>
                    <ArrowRight className="w-4 h-4 text-blue-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Headmaster Portrait & Name Plate Beneath Photo */}
              <div className="lg:col-span-5 flex flex-col items-center sm:items-start lg:items-center">
                <div className="w-full max-w-md bg-white rounded-3xl p-3 sm:p-4 shadow-xl border border-slate-200/90 transition-all duration-300 hover:shadow-2xl">
                  {/* Photo Frame */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-100 group">
                    <Image
                      src={home.headmasterPhoto || '/kepala-madrasah.jpg'}
                      alt={`${home.headmasterName} - ${home.headmasterRole}`}
                      fill
                      priority
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Name & Title Directly Underneath Photo */}
                  <div className="pt-4 pb-2 px-2 text-center">
                    <h3 className="font-serif text-[19px] sm:text-[21px] font-bold text-slate-900 tracking-tight">
                      {home.headmasterName}
                    </h3>
                    <p className="font-sans text-[13px] font-semibold text-blue-700 tracking-wide mt-0.5">
                      {home.headmasterRole}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            2.5 PPDB SECTION (Information & Admission Showcase)
        ========================================================= */}
        <PpdbSection onOpenRegister={() => setIsRegModalOpen(true)} />

        {/* =========================================================
            3. SLIDABLE NEWS CAROUSEL SECTION (Articles from API)
        ========================================================= */}
        <NewsCarouselSection />

        {/* =========================================================
            3.5 TEACHERS CAROUSEL SECTION (Dewan Guru Beranda - Auto Slide 4 Detik)
        ========================================================= */}
        <TeachersCarouselSection
          title={home.teachersSectionTitle}
          subtitle={home.teachersSectionSubtitle}
        />

        {/* =========================================================
            4. VISITOR METRICS & DISTRIBUTION GRAPH (Live Data Showcase)
        ========================================================= */}
        <VisitorMetricsSection />
      </main>

      <StitchFooter />

      {/* Online PPDB Registration Modal Dialog */}
      <PpdbRegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
      />
    </div>
  );
}
