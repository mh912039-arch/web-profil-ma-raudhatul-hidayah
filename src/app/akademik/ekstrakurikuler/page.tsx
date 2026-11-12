'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  User,
  Trophy,
  ArrowUpRight,
} from 'lucide-react';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';
import defaultEkskuls from '@/data/extracurricularsData.json';

export default function EkstrakurikulerPage() {
  const [ekskulList, setEkskulList] = useState(defaultEkskuls);

  useEffect(() => {
    async function loadLiveEkskuls() {
      try {
        const res = await fetch('/api/extracurriculars', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setEkskulList(data);
          }
        }
      } catch (err) {
        console.warn('Fallback to local extracurriculars:', err);
      }
    }
    loadLiveEkskuls();
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans text-on-surface">
      <StitchNavbar />

      <main className="w-full pt-20 bg-background flex-grow">
        <section className="w-full py-12 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Toolbar: Title & Link to Prestasi */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200/80">
              <h1 className="font-serif text-[28px] sm:text-[38px] font-bold text-slate-900 tracking-tight leading-tight">
                Ekstrakurikuler
              </h1>

              <Link
                href="/akademik/foto-juara"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-[12.5px] font-bold transition-all shadow-xs hover:shadow-md cursor-pointer group shrink-0"
              >
                <Trophy className="w-4 h-4 text-slate-950" />
                <span>Lihat Galeri Prestasi Siswa</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* Extracurricular Editorial Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 sm:gap-y-14">
              {ekskulList.map((ekskul) => (
                <article
                  key={ekskul.id}
                  className="flex flex-col cursor-default"
                >
                  {/* Photo Frame (Clean Editorial, No Hover Zoom) */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs">
                    <Image
                      src={ekskul.image || '/hero/slide-1.jpg'}
                      alt={ekskul.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      className="object-cover"
                      unoptimized={Boolean(ekskul.image && (ekskul.image.startsWith('data:') || ekskul.image.startsWith('/uploads')))}
                    />
                  </div>

                  {/* Content Flow */}
                  <div className="pt-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Metadata Row: Level & Schedule */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                          {ekskul.level || 'Tingkat MA'}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="inline-flex items-center gap-1.5 text-slate-500 font-sans text-[12px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{ekskul.schedule}</span>
                        </span>
                      </div>

                      {/* Title: Solid Serif Typography (No Link Hover) */}
                      <h2 className="font-serif text-[20px] sm:text-[22px] font-bold text-slate-900 tracking-tight leading-snug mb-2.5">
                        {ekskul.name}
                      </h2>

                      {/* Description */}
                      <p className="font-sans text-[13.5px] sm:text-[14px] text-slate-600 leading-relaxed mb-5">
                        {ekskul.desc}
                      </p>
                    </div>

                    {/* Pembina Credit Line (Integrated Editorial Info) */}
                    <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[12.5px]">
                      <div className="flex items-center gap-2 text-slate-800">
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-900">
                          {ekskul.coach}
                        </span>
                      </div>
                      <span className="font-sans text-[11.5px] text-slate-500">
                        {ekskul.role || 'Pembina'}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <StitchFooter />
    </div>
  );
}
