'use client';

import React, { useState, useEffect } from 'react';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';

const defaultVisi = 'Terwujudnya Peserta Didik SMP yang Berakhlak Mulia, Berprestasi, Mandiri, dan Berwawasan Lingkungan';
const defaultMissions = [
  'Menyelenggarakan proses pembelajaran yang aktif, inovatif, dan menyenangkan sesuai tahapan usia remaja guna memacu rasa ingin tahu dan keberanian berpikir kritis.',
  'Menumbuhkembangkan nilai keimanan, ketakwaan, dan budi pekerti luhur dalam keseharian siswa melalui pembiasaan salat berjamaah, tadarus Al-Qur’an, dan kajian adab.',
  'Mengembangkan potensi minat dan bakat siswa melalui kegiatan ekstrakurikuler umum, keolahragaan, seni, sains terapan, serta pendampingan intensif olimpiade prestasi.',
  'Membiasakan budaya disiplin waktu, gerakan gemar membaca (literasi 15 menit), serta etika hidup bersih bebas sampah plastik di seluruh ekosistem sekolah.',
  'Membangun kerjasama harmonis antara pihak sekolah, orang tua siswa (paguyuban kelas), dan masyarakat sekitar guna memastikan ekosistem pendidikan yang saling menopang.',
];

export default function VisiMisiPage() {
  const [vision, setVision] = useState(defaultVisi);
  const [missions, setMissions] = useState(defaultMissions);

  useEffect(() => {
    fetch('/api/profile', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.visionMission?.vision) {
          setVision(data.visionMission.vision);
        }
        if (data?.visionMission?.missions && Array.isArray(data.visionMission.missions) && data.visionMission.missions.length > 0) {
          setMissions(data.visionMission.missions);
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic profile data:', err));
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans text-on-surface">
      <StitchNavbar />

      <main className="w-full pt-20 bg-background flex-grow">
        <section className="w-full py-12 sm:py-20 bg-[#fbfbfa]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-12 sm:gap-16">

              {/* 1. Header Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/80">
                <div>
                  <h1 className="font-serif text-[28px] sm:text-[38px] font-bold text-slate-900 tracking-tight leading-tight">
                    Visi &amp; Misi Madrasah
                  </h1>
                  <p className="font-sans text-[14.5px] sm:text-[15.5px] text-slate-600 max-w-2xl leading-relaxed">
                    Arah haluan nilai pendidikan, visi kelembagaan, misi pembelajaran kontekstual, dan pilar keunggulan santri MAS Raudhatul Hidayah.
                  </p>
                </div>
              </div>

              {/* 2. Core Vision Card */}
              <div className="bg-primary text-on-primary rounded-3xl p-6 sm:p-12 shadow-xl relative overflow-hidden">
                <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-5 max-w-4xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[12px] font-bold uppercase tracking-wider w-fit">
                    <span>Visi Pokok Institusi</span>
                  </div>

                  <blockquote className="font-display text-[22px] sm:text-[30px] lg:text-[34px] font-bold text-on-primary leading-snug tracking-tight">
                    &ldquo;{vision}&rdquo;
                  </blockquote>

                  {/* 4 Pillars Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
                    <div className="bg-primary-container/70 rounded-xl p-3.5 flex flex-col gap-1 backdrop-blur-sm border border-white/5">
                      <span className="font-display text-[16px] font-bold text-on-primary">Berakhlak</span>
                      <span className="font-sans text-[12px] text-on-primary-container leading-snug">
                        Berbudi luhur &amp; adab santun harian
                      </span>
                    </div>
                    <div className="bg-primary-container/70 rounded-xl p-3.5 flex flex-col gap-1 backdrop-blur-sm border border-white/5">
                      <span className="font-display text-[16px] font-bold text-on-primary">Berprestasi</span>
                      <span className="font-sans text-[12px] text-on-primary-container leading-snug">
                        Unggul akademik &amp; non-akademik
                      </span>
                    </div>
                    <div className="bg-primary-container/70 rounded-xl p-3.5 flex flex-col gap-1 backdrop-blur-sm border border-white/5">
                      <span className="font-display text-[16px] font-bold text-on-primary">Mandiri</span>
                      <span className="font-sans text-[12px] text-on-primary-container leading-snug">
                        Tangguh &amp; berdaya saing personal
                      </span>
                    </div>
                    <div className="bg-primary-container/70 rounded-xl p-3.5 flex flex-col gap-1 backdrop-blur-sm border border-white/5">
                      <span className="font-display text-[16px] font-bold text-on-primary">Berwawasan</span>
                      <span className="font-sans text-[12px] text-on-primary-container leading-snug">
                        Peduli kelestarian lingkungan hidup
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Misi Pokok Sekolah */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 border-t border-slate-200">
                <div className="lg:col-span-4 flex flex-col gap-3 lg:sticky lg:top-40">
                  <h2 className="font-display text-[26px] sm:text-[32px] font-bold text-primary leading-tight">
                    Misi Pokok Penyelenggaraan Sekolah
                  </h2>
                  <p className="font-sans text-[14.5px] text-slate-600 leading-relaxed">
                    Langkah konkret institusi dalam mengejawantahkan visi luhur ke dalam iklim pembelajaran, kultur madrasah, dan interaksi sosial harian peserta didik.
                  </p>
                </div>

                <div className="lg:col-span-8 flex flex-col gap-4">
                  {missions.map((missionText, idx) => (
                    <div
                      key={idx}
                      className="group bg-white rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start border border-slate-200/90"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-display text-[18px] font-bold shrink-0 group-hover:bg-amber-500 group-hover:text-blue-950 transition-colors">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <p className="font-sans text-[14.5px] text-slate-800 leading-relaxed font-medium">
                          {missionText}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <StitchFooter />
    </div>
  );
}

