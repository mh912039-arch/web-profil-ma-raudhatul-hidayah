'use client';

import React, { useState, useEffect } from 'react';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';

const defaultVisi =
  'Terwujudnya generasi santri yang beriman dan bertakwa, berakhlak mulia, unggul dalam prestasi akademik dan non-akademik, serta berwawasan lingkungan dan keislaman yang moderat.';
const defaultMissions = [
  'Menyelenggarakan proses pembelajaran integratif antara Kurikulum Nasional dan kurikulum kepesantrenan berhaluan Ahlussunnah wal Jama’ah.',
  'Mengembangkan budaya riset ilmiah, penalaran kritis, dan literasi digital yang berlandaskan etika Islam.',
  'Membina program pembiasaan ibadah harian, Tahfidzul Quran bersanad, dan kajian kitab turots (kuning).',
  'Menumbuhkan jiwa kepemimpinan mandiri, kewirausahaan, dan kepedulian lingkungan hidup.',
  'Membangun tata kelola madrasah yang akuntabel, transparan, dan berbasis teknologi informasi modern.',
];

export default function VisiMisiPage() {
  const [pageTitle, setPageTitle] = useState('Visi & Misi Madrasah');
  const [pageSubtitle, setPageSubtitle] = useState(
    'Arah haluan nilai pendidikan, visi kelembagaan, misi pembelajaran kontekstual, dan pilar keunggulan santri MA Raudlatul Hidayah.'
  );
  const [vision, setVision] = useState(defaultVisi);
  const [missionTitle, setMissionTitle] = useState('Misi Pokok Penyelenggaraan Sekolah');
  const [missionSubtitle, setMissionSubtitle] = useState(
    'Langkah konkret institusi dalam mengejawantahkan visi luhur ke dalam iklim pembelajaran, kultur madrasah, dan interaksi sosial harian peserta didik.'
  );
  const [missions, setMissions] = useState(defaultMissions);

  useEffect(() => {
    fetch('/api/profile', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.visionMission?.pageTitle) {
          setPageTitle(data.visionMission.pageTitle);
        }
        if (data?.visionMission?.pageSubtitle) {
          setPageSubtitle(data.visionMission.pageSubtitle);
        }
        if (data?.visionMission?.vision) {
          setVision(data.visionMission.vision);
        }
        if (data?.visionMission?.missionTitle) {
          setMissionTitle(data.visionMission.missionTitle);
        }
        if (data?.visionMission?.missionSubtitle) {
          setMissionSubtitle(data.visionMission.missionSubtitle);
        }
        if (
          data?.visionMission?.missions &&
          Array.isArray(data.visionMission.missions) &&
          data.visionMission.missions.length > 0
        ) {
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
              <div className="pb-6 border-b border-slate-200/80">
                <h1 className="font-serif text-[28px] sm:text-[38px] font-bold text-slate-900 tracking-tight leading-tight">
                  {pageTitle}
                </h1>
              </div>

              {/* 2. Visi Madrasah (Clean & Transparent) */}
              <div className="flex flex-col gap-3 py-2">
                <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500 font-sans">
                  Visi Madrasah
                </span>
                <blockquote className="font-serif text-[22px] sm:text-[30px] font-bold text-slate-900 leading-snug max-w-4xl">
                  &ldquo;{vision}&rdquo;
                </blockquote>
              </div>

              {/* 4. Misi Pokok Sekolah */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 border-t border-slate-200">
                <div className="lg:col-span-4 flex flex-col gap-3 lg:sticky lg:top-40">
                  <h2 className="font-display text-[26px] sm:text-[32px] font-bold text-primary leading-tight">
                    {missionTitle}
                  </h2>
                  <p className="font-sans text-[14.5px] text-slate-600 leading-relaxed">
                    {missionSubtitle}
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

