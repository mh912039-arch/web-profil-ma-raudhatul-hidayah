'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';

import initialChampionships from '@/data/championshipsData.json';

const defaultAchievements = (initialChampionships as any[]).map((d: any) => ({
  id: d.id,
  title: d.title,
  student: d.sub || 'Santri MA Raudlatul Hidayah',
  grade: d.category || 'Prestasi Santri',
  year: d.date_label || '2026',
  badge: d.badge || 'Juara',
  medalIcon: 'workspace_premium',
  eventTag: d.event_name || 'Kejuaraan',
  category: (d.category || '').toLowerCase().includes('olahraga')
    ? 'olahraga'
    : (d.category || '').toLowerCase().includes('pramuka')
    ? 'pramuka'
    : (d.category || '').toLowerCase().includes('seni')
    ? 'seni'
    : 'akademik',
  organizer: d.event_name || 'Kemenag & Kwarran',
  level: 'Tingkat Wilayah',
  image: d.image_url || '/foto-juara.jpeg',
  desc: d.caption || 'Prestasi membanggakan yang diraih santri dalam ajang kejuaraan resmi.',
}));

export default function PrestasiPage() {
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [items, setItems] = useState(defaultAchievements);

  useEffect(() => {
    fetch('/api/championships', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            student: d.sub || 'Santri MA Raudlatul Hidayah',
            grade: d.category || 'Prestasi Santri',
            year: d.date_label || '2026',
            badge: d.badge || 'Juara',
            medalIcon: 'workspace_premium',
            eventTag: d.event_name || 'Kejuaraan',
            category: (d.category || '').toLowerCase().includes('olahraga')
              ? 'olahraga'
              : (d.category || '').toLowerCase().includes('pramuka')
              ? 'pramuka'
              : (d.category || '').toLowerCase().includes('seni')
              ? 'seni'
              : 'akademik',
            organizer: d.event_name || 'Kemenag & Kwarran',
            level: 'Tingkat Wilayah',
            image: d.image_url || '/foto-juara.jpeg',
            desc: d.caption || 'Prestasi membanggakan yang diraih santri dalam ajang kejuaraan resmi.',
          }));
          setItems(mapped);
        }
      })
      .catch((err) => console.warn('Could not fetch championships for prestasi page:', err));
  }, []);

  const filteredAchievements =
    selectedCategory === 'semua'
      ? items
      : items.filter((a) => a.category === selectedCategory);

  const destinations = [
    { school: 'SMAN 1 Mauk', type: 'SMA Negeri Wilayah', count: '30 Siswa' },
    { school: 'MAN 1 Kabupaten Tangerang', type: 'Madrasah Aliyah Negeri Unggulan', count: '35 Siswa' },
    { school: 'SMAN 1 Kabupaten Tangerang', type: 'SMA Negeri Favorit', count: '28 Siswa' },
    { school: 'SMKN 1 Kabupaten Tangerang', type: 'SMK Negeri Kejuruan', count: '22 Siswa' },
    { school: 'MAN Insan Cendekia / Berasrama', type: 'MA Unggulan Berasrama', count: '8 Siswa' },
    { school: 'SMK Bidang Teknik & Teknologi Informasi', type: 'Pendidikan Vokasi', count: '16 Siswa' },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans text-on-surface">
      <StitchNavbar />

      <main className="w-full pt-20 bg-background flex-grow">
        {/* 1. Top Hero & Headline Section */}
        <section className="relative overflow-hidden bg-primary text-on-primary py-12 sm:py-16">
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-64 h-64 rounded-full bg-secondary-container/10 blur-2xl pointer-events-none" />

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-secondary-fixed w-fit shadow-sm border border-secondary/20">
                  <span className="material-symbols-outlined text-[16px]">military_tech</span>
                  <span className="font-sans text-[12px] tracking-wider uppercase font-semibold">
                    Pencapaian Generasi Rabbani
                  </span>
                </div>
                <h1 className="font-display text-[30px] sm:text-[40px] font-extrabold text-on-primary tracking-tight leading-tight">
                  Galeri Prestasi &amp; Jejak Juara Santri MA Raudlatul Hidayah
                </h1>
                <p className="font-sans text-[15.5px] text-on-primary-container leading-relaxed">
                  Menempa keunggulan intelektual, ketangkasan raga, dan budi pekerti luhur santri madrasah aliyah untuk peradaban masa depan.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-primary-container/70 backdrop-blur-md p-4 rounded-xl shadow-md border border-white/5 shrink-0">
                <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center text-on-secondary shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-[32px]">emoji_events</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-[32px] font-bold text-on-primary leading-none">
                      45
                    </span>
                    <span className="font-display text-[22px] font-bold text-secondary-fixed">+</span>
                  </div>
                  <span className="font-sans text-[12px] text-on-primary-container">
                    Penghargaan Kabupaten, Provinsi &amp; Nasional
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-surface-container-lowest/10 backdrop-blur-sm p-3.5 rounded-lg flex flex-col border border-white/5">
                <span className="font-display text-[22px] font-bold text-on-primary">18</span>
                <span className="font-sans text-[12px] text-on-primary-container">Emas &amp; Juara 1</span>
              </div>
              <div className="bg-surface-container-lowest/10 backdrop-blur-sm p-3.5 rounded-lg flex flex-col border border-white/5">
                <span className="font-display text-[22px] font-bold text-on-primary">15</span>
                <span className="font-sans text-[12px] text-on-primary-container">Perak &amp; Juara 2</span>
              </div>
              <div className="bg-surface-container-lowest/10 backdrop-blur-sm p-3.5 rounded-lg flex flex-col border border-white/5">
                <span className="font-display text-[22px] font-bold text-on-primary">12</span>
                <span className="font-sans text-[12px] text-on-primary-container">Perunggu &amp; Harapan</span>
              </div>
              <div className="bg-surface-container-lowest/10 backdrop-blur-sm p-3.5 rounded-lg flex flex-col border border-white/5">
                <span className="font-display text-[22px] font-bold text-secondary-fixed">100%</span>
                <span className="font-sans text-[12px] text-on-primary-container">Bimbingan Terpadu</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Interactive Filter Bar */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 z-20">
          <div className="bg-surface-container-lowest rounded-xl p-3 shadow-md flex flex-wrap items-center justify-between gap-3 border border-surface-container">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'semua', label: 'Semua Prestasi' },
                { id: 'akademik', label: 'Akademik / OSN' },
                { id: 'olahraga', label: 'Olahraga / O2SN' },
                { id: 'seni', label: 'Seni & Tahfidz' },
                { id: 'pramuka', label: 'Kepramukaan' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-on-primary shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-on-surface-variant font-sans text-[12px] px-2 font-medium">
              <span className="material-symbols-outlined text-[17px] text-secondary">verified</span>
              <span>Terverifikasi Kurikulum 2024/2025</span>
            </div>
          </div>
        </section>

        {/* 3. Achievement Cards Grid */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((item) => (
              <article
                key={item.id}
                className="group bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden border border-surface-container"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-primary-container">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent" />

                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-secondary text-on-secondary text-[11px] font-semibold shadow-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">{item.medalIcon}</span>
                      <span>{item.badge}</span>
                    </span>
                    <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary text-[11px] font-medium backdrop-blur-sm">
                      {item.eventTag}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-on-primary flex justify-between items-end">
                    <div>
                      <span className="font-sans text-[11px] text-secondary-fixed block">
                        {item.grade}
                      </span>
                      <h3 className="font-display text-[15px] sm:text-[16px] font-bold text-on-primary leading-tight">
                        {item.student}
                      </h3>
                    </div>
                    <span className="font-sans text-[11px] bg-surface-container-lowest/20 px-2 py-0.5 rounded backdrop-blur-sm text-on-primary font-semibold">
                      {item.year}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div className="flex flex-col gap-1.5">
                    <h4 className="font-display text-[16px] font-bold text-primary leading-snug group-hover:text-secondary transition-colors">
                      {item.title}
                    </h4>
                    <p className="font-sans text-[13.5px] text-on-surface-variant leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-surface-container flex items-center justify-between text-[12px] text-outline font-medium">
                    <span className="flex items-center gap-1 text-on-surface-variant truncate">
                      <span className="material-symbols-outlined text-[15px] text-secondary shrink-0">
                        place
                      </span>
                      <span className="truncate">{item.organizer}</span>
                    </span>
                    <span className="text-secondary font-bold shrink-0">{item.level}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 4. Rekam Jejak Lulusan ke SMA/SMK/MA Favorit */}
        <section className="py-12 sm:py-16 bg-surface-container-low border-t border-surface-container">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">

              <h2 className="font-display text-[26px] sm:text-[32px] font-bold text-primary tracking-tight">
                Distribusi Lulusan ke SMA / SMK / MA Favorit
              </h2>
              <p className="font-sans text-[15px] text-on-surface-variant mt-1 leading-relaxed">
                Lulusan SMP MA Raudlatul Hidayah berhasil bersaing dan diterima di berbagai sekolah menengah tingkat atas negeri maupun unggulan di Banten dan sekitarnya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {destinations.map((d, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-[15.5px] font-bold text-primary">
                      {d.school}
                    </h3>
                    <span className="text-[12px] font-bold text-secondary bg-secondary-container/20 px-2 py-0.5 rounded">
                      {d.count}
                    </span>
                  </div>
                  <p className="font-sans text-[13px] text-on-surface-variant">
                    Kategori: {d.type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <StitchFooter />
    </div>
  );
}
