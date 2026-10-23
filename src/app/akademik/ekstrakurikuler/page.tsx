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
  const [activeFilter, setActiveFilter] = useState('all');
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

  const filteredEkskul =
    activeFilter === 'all'
      ? ekskulList
      : ekskulList.filter((item) => item.category === activeFilter);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans text-on-surface">
      <StitchNavbar />

      <main className="w-full pt-20 bg-background flex-grow">
        <section className="w-full py-12 sm:py-20 bg-[#fbfbfa]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Toolbar: Title & Statistics Counter */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-8 border-b border-slate-200/80">
              <div>
                <h1 className="font-serif text-[28px] sm:text-[38px] font-bold text-slate-900 tracking-tight leading-tight">
                  Ekstrakurikuler
                </h1>
                <div className="w-12 h-1 bg-amber-500 rounded-full mt-2 mb-3" />
                <p className="font-sans text-[14.5px] sm:text-[15.5px] text-slate-600 max-w-xl leading-relaxed">
                  Wadah pembinaan karakter, kepemimpinan regu, kebugaran jasmani, kedisiplinan bela negara, dan kreativitas seni bagi seluruh santri MAS Raudhatul Hidayah.
                </p>
                <div className="mt-4">
                  <Link
                    href="/akademik/foto-juara"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-[12.5px] font-bold transition-all shadow-xs hover:shadow-md cursor-pointer group"
                  >
                    <Trophy className="w-4 h-4 text-slate-950" />
                    <span>Lihat Galeri Foto Juara Ekstrakurikuler</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Statistics Counter */}
              <div className="flex items-center gap-5 sm:gap-6 bg-white p-3.5 sm:p-4 rounded-2xl shadow-2xs border border-slate-200/90 shrink-0">
                <div className="flex flex-col">
                  <span className="font-serif text-[24px] font-bold text-blue-700 leading-none mb-1">
                    9
                  </span>
                  <span className="font-sans text-[11.5px] text-slate-500 font-medium">
                    Cabang Aktif
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="flex flex-col">
                  <span className="font-serif text-[24px] font-bold text-amber-600 leading-none mb-1">
                    100%
                  </span>
                  <span className="font-sans text-[11.5px] text-slate-500 font-medium">
                    Bimbingan Guru
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="flex flex-col">
                  <span className="font-serif text-[24px] font-bold text-slate-900 leading-none mb-1">
                    3
                  </span>
                  <span className="font-sans text-[11.5px] text-slate-500 font-medium">
                    Fasilitas Olahraga
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-10">
              {[
                { id: 'all', label: 'Semua Ekstrakurikuler' },
                { id: 'belanegara', label: 'Wajib & Bela Negara' },
                { id: 'olahraga', label: 'Olahraga' },
                { id: 'seni', label: 'Kesenian & Budaya' },
                { id: 'literasi', label: 'Literasi & Jurnalistik' },
              ].map((filterTab) => (
                <button
                  key={filterTab.id}
                  onClick={() => setActiveFilter(filterTab.id)}
                  type="button"
                  className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-150 active:scale-95 ${
                    activeFilter === filterTab.id
                      ? 'bg-blue-700 text-white shadow-xs font-semibold ring-2 ring-amber-400/60'
                      : 'bg-white text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {filterTab.label}
                </button>
              ))}
            </div>

            {/* Extracurricular Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEkskul.map((ekskul) => (
                <div
                  key={ekskul.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col border border-slate-200/90 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={ekskul.image}
                      alt={ekskul.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
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
