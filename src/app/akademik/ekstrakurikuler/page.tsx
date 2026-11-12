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

            {/* Extracurricular Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ekskulList.map((ekskul) => (
                <div
                  key={ekskul.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col border border-slate-200/90 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={ekskul.image || '/hero/slide-1.jpg'}
                      alt={ekskul.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized={Boolean(ekskul.image && (ekskul.image.startsWith('data:') || ekskul.image.startsWith('/uploads')))}
                    />
                    <div className="absolute top-3 left-3 bg-blue-900/85 backdrop-blur-xs text-white px-3 py-1 rounded-full text-[11px] font-semibold border border-white/20">
                      {ekskul.badge}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11.5px] text-amber-700 font-bold uppercase tracking-wider">
                          {ekskul.level || 'Tingkat MA'}
                        </span>
                        <span className="flex items-center text-slate-500 text-[12px] gap-1.5 font-sans">
                          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{ekskul.schedule}</span>
                        </span>
                      </div>

                      <h3 className="font-serif text-[18px] sm:text-[19px] font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                        {ekskul.name}
                      </h3>

                      <p className="font-sans text-[13px] sm:text-[13.5px] text-slate-600 leading-relaxed">
                        {ekskul.desc}
                      </p>
                    </div>

                    <div className="pt-3 bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-200/70">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-sans text-[12.5px] font-semibold text-slate-800">
                          {ekskul.coach}
                        </span>
                      </div>
                      <span className="font-sans text-[11px] font-medium text-slate-500">
                        {ekskul.role}
                      </span>
                    </div>
                  </div>
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
